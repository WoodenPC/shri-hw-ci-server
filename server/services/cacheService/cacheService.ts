import { join } from 'path';
import { createReadStream, createWriteStream, WriteStream, ReadStream } from 'fs';
import { differenceInMinutes } from 'date-fns';
import { getStatAsync, fileExistsAsync, mkDirAsync } from 'utils/promisified';
import { IService } from 'interfaces/service.intfs';

export interface ICacheService extends IService {
  checkLog(buildId: string): Promise<boolean>;
  read(buildId: string, stream: WriteStream): Promise<boolean>;
  write(buildId: string, stream: ReadStream): Promise<boolean>;
}

/**
 * сервис кэширования логов
 */
export class CacheService implements ICacheService {
  private logsDirPath: string;
  private cacheLifetime: number;

  constructor(logsDirPath: string) {
    this.logsDirPath = logsDirPath;
    this.cacheLifetime = 1;
    if (process.env.CACHE_LIFETIME_MINUTES) {
      this.cacheLifetime = Number(process.env.CACHE_LIFETIME_MINUTES);
    }

    console.log('CACHE lifetime = ', this.cacheLifetime);
  }

  /** возвращает путь до файла с кэшем лога */
  getBuildCacheLogPath = (buildId: string): string => {
    return join(this.logsDirPath, buildId, 'log.cache');
  };

  /** возвращает путь до папки кэша сборки */
  getBuildCacheDir = (buildId: string): string => {
    return join(this.logsDirPath, buildId);
  };

  /**
   * чекает лог на валидность по времени создании файла
   */
  checkLog = async (buildId: string): Promise<boolean> => {
    const path = this.getBuildCacheLogPath(buildId);
    try {
      if (!(await fileExistsAsync(path))) {
        console.log('cache file not exists');
        return false;
      }

      const stat = await getStatAsync(path);
      const { mtime } = stat;
      const now = Date.now();
      return differenceInMinutes(now, mtime) <= this.cacheLifetime;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  /**
   * пишет лог в файл через стрим
   */
  write = async (buildId: string, stream: NodeJS.ReadableStream): Promise<boolean> => {
    const path = this.getBuildCacheLogPath(buildId);
    const dir = this.getBuildCacheDir(buildId);
    if (!(await fileExistsAsync(dir))) {
      await mkDirAsync(dir, { recursive: true });
    }
    return new Promise((resolve, reject) => {
      console.log(`writing cache to ${path}`);
      const writeStream = createWriteStream(path, { flags: 'w' });
      stream.pipe(writeStream);

      writeStream.on('close', () => {
        resolve(true);
      });

      writeStream.on('error', (err) => {
        reject(`write cache error ${err.toString()}`);
      });
    });
  };

  /**
   * читает лог из файла через стрим
   */
  read = async (buildId: string, stream: NodeJS.WritableStream): Promise<boolean> => {
    const path = this.getBuildCacheLogPath(buildId);

    if (!(await fileExistsAsync(path))) {
      return false;
    }
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(path);
      readStream.pipe(stream);
      readStream.on('close', () => {
        resolve(true);
      });
      readStream.on('error', (err) => {
        reject(`read cache error ${err.toString()}`);
      });
    });
  };
}
