const { resolve, join } = require('path');
const { createReadStream, createWriteStream } = require('fs');
const { differenceInMinutes } = require('date-fns');
const { getStatAsync,
  fileExistsAsync,
  mkDirAsync,
} = require('../utils/promisified');

class CacheService {
  logsDirPath = '';
  cacheLifetime = 1; // 1minute

  constructor(logsDirPath) {
    this.logsDirPath = logsDirPath;
  }

  getBuildCachePath = (buildId) => {
    return join(this.logsDirPath, buildId, 'log.cache');
  }

  getBuildCacheDir = (buildId) => {
    return join(this.logsDirPath, buildId);
  }

  /**
   * чекает лог на валидность по времени создании файла
   */
  checkLog = async (buildId) => {
    const path = this.getBuildCachePath(buildId);
    if (!await fileExistsAsync(path)) {
      console.log('cache file not exists');
      return false;
    }

    const stat = await getStatAsync(path);
    const { mtime } = stat;
    const now = Date.now();
    return differenceInMinutes(now, mtime) <= this.cacheLifetime; 
  }

  /**
   * пишет лог в файл через стрим
   */
  write = (buildId, stream) => {
    return new Promise(async (resolve, reject) => {
      const path = this.getBuildCachePath(buildId);
      const dir = this.getBuildCacheDir(buildId);
      if (!await fileExistsAsync(dir)) {
        await mkDirAsync(dir, { recursive: true });
      }

      console.log(`writing cache to ${path}`);
      const writeStream = createWriteStream(path, { flags: 'w' });
      stream.pipe(writeStream);

      writeStream.on('close', () => {
        resolve(true);
      });

      writeStream.on('error', (err) => {
        reject(`write cache error ${err.toString()}`)
      });
    });
  }

  /**
   * читает лог из файла через стрим
   */
  read = async (buildId, stream) => {
    return new Promise(async (resolve, reject) => {
      const path = this.getBuildCachePath(buildId);

      if (!await fileExistsAsync(path)) {
        resolve(false);
      }

      const readStream = createReadStream(path);
      readStream.pipe(stream);
      readStream.on('close', () => {
        resolve(true);
      });
      readStream.on('error', (err) => {
        reject('read cache error ', err.toString());
      });
    });
  }
}

const dir = '/home/logsCache';

const instance = new CacheService(dir);

module.exports = instance;