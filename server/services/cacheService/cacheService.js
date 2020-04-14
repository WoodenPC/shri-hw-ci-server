const { join } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { differenceInMinutes } = require('date-fns');
const { getStatAsync, fileExistsAsync, mkDirAsync } = require('../../utils/promisified');

/**
 * сервис кэширования логов
 */
class CacheService {
  logsDirPath = '';
  cacheLifetime = 1; // 1 minute

  constructor(logsDirPath) {
    this.logsDirPath = logsDirPath;
    if (process.env.CACHE_LIFETIME_MINUTES) {
      try {
        this.cacheLifetime = parseInt(process.env.CACHE_LIFETIME_MINUTES, 10);
      } catch (e) {
        console.log(e);
      }
    } else {
      this.cacheLifetime = 1;
    }

    console.log('CACHE lifetime = ', this.cacheLifetime);
  }

  /** возвращает путь до файла с кэшем лога */
  getBuildCacheLogPath = (buildId) => {
    return join(this.logsDirPath, buildId, 'log.cache');
  };

  /** возвращает путь до папки кэша сборки */
  getBuildCacheDir = (buildId) => {
    return join(this.logsDirPath, buildId);
  };

  /**
   * чекает лог на валидность по времени создании файла
   */
  checkLog = async (buildId) => {
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
    }
  };

  /**
   * пишет лог в файл через стрим
   */
  write = async (buildId, stream) => {
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
  read = async (buildId, stream) => {
    const path = this.getBuildCacheLogPath(buildId);

    if (!(await fileExistsAsync(path))) {
      resolve(false);
    }
    return new Promise((resolve, reject) => {
      const readStream = createReadStream(path);
      readStream.pipe(stream);
      readStream.on('close', () => {
        resolve(true);
      });
      readStream.on('error', (err) => {
        reject('read cache error ', err.toString());
      });
    });
  };
}

module.exports = CacheService;
