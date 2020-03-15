const { resolve } = require('path');

class CacheService {
  logsDirPath = '';
  logs = null;

  constructor(logsDirPath) {
    this.logsDirPath = logsDirPath;
    this.logs = new Map();
  }

  write = (repoName, commitHash) => {

  }

  read = (repoName, commitHash) => {

  }
}

const dir = resolve('/home/logsCache');

const instance = new CacheService(dir);

module.exports = instance;