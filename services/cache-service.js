const { resolve, join } = require('path');
const { differenceInMinutes } = require('date-fns');
const { getStatAsync, fileExistsAsync, readFileAsync, writeFileAsync } = require('../utils/promisified');

class CacheService {
  logsDirPath = '';
  cacheTimeout = 1; // 1minute

  constructor(logsDirPath) {
    this.logsDirPath = logsDirPath;
  }

  /**
   * чекает лог на валидность по времени создании файла
   */
  checkLog = async (buildId) => {
    const path = join(this.logsDirPath, buildId);
    if (!await fileExistsAsync(path)) {
      return false;
    }

    const stat = await getStatAsync(path);
    const { birthtime } = stat;
    const now = Date.now();
    return differenceInMinutes(now, birthtime) <= this.cacheTimeout; 
  }

  /**
   * пишет лог в файл через стрим
   */
  write = async (buildId, log) => {
    const result = await writeFileAsync(join(this.logsDirPath, buildId, '.cache'),
      log, { recursive: true });
    return result;
  }

  /**
   * читает лог из файла через стрим
   */
  read = async (buildId) => {
    const path = join(this.logsDirPath, buildId, '.cache');
    if (!await fileExistsAsync(path)) {
      return;
    }
    const result = await readFileAsync(path);
    return result;
  }
}

const dir = resolve('/home/logsCache');

const instance = new CacheService(dir);

module.exports = instance;