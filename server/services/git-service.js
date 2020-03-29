const { resolve } = require('path');
const { watch } = require('fs');
const { spawn } = require('child_process');

const { fileExistsAsync } = require('../utils/promisified');
const yandexSvc = require('./yandex-service');

const BASE_GITHUB_URL = 'https://github.com';

/**
 * сервис для работы с гит репозиториями
 * умеет в клонирование и слежение за текущем репозиторием
 */
class GitService {
  repoUrl = '';
  repoName = '';
  mainBranch = '';
  buildCommand = '';
  period = 0;
  interval = null;
  fsWatcher = null;
  intervalTime = 10000; // 10c
  lastBuildCommitHash = null;
  yandexService = null;

  constructor(yandexService) {
    this.yandexService = yandexService;
  }

  getRepoFolder = (repoName) => {
    const repoFolder = process.env.REPOS_DIR || '/home/repos';
    return resolve(repoFolder, repoName);
  };

  /**
   * клонирование репозитория
   */
  clone = (url, repoName) => {
    return new Promise((resolve, reject) => {
      const repoPath = this.getRepoFolder(repoName);
      const gitCloneProcess = spawn('git', ['clone', url, repoPath]);
      gitCloneProcess.stdout.on('data', (data) => {
        console.log(`Git clone stdout: ${data}`);
      });

      gitCloneProcess.on('close', (code) => {
        console.log(`Git clone is finished. code=${code}`);
        if (code === 0) {
          resolve(true);
        } else {
          reject(`Cannot clone. Finished this code ${code}`);
        }
      });

      gitCloneProcess.stderr.on('data', (data) => {
        console.error(`Git clone stderr: ${data.toString()}`);
      });
    });
  };

  // инициализация севиса
  init = async (settings) => {
    this.repoName = settings.repoName;
    this.repoUrl = `${BASE_GITHUB_URL}/${this.repoName}`;
    this.mainBranch = settings.mainBranch;
    if (!(await fileExistsAsync(this.getRepoFolder(this.repoName)))) {
      this.lastBuildCommitHash = null;
      try {
        await this.clone(this.repoUrl, this.repoName);
      } catch (e) {
        console.log(e);
        return false;
      }
    } else {
      const log = await this.getLog(this.repoName, this.getLogCommand(this.mainBranch));
      if (log) {
        // получаем последний коммит
        this.lastBuildCommitHash = log[0] && log[0].commitHash;
      }
      console.log(`repo ${this.repoName} already cloned. continue`);
    }

    this.stop();
    this.watch(this.repoName);
    return true;
  };

  /**
   * отправка коммитов на сборку
   */
  sendBuildsForNewCommits = async () => {
    let log;
    try {
      log = await this.getLog(
        this.repoName,
        this.getLogCommand(this.mainBranch, { untilHash: this.lastBuildCommitHash }),
      );
    } catch (e) {
      console.log('cannot get log ', e);
      return;
    }

    if (!log || log.length === 0) {
      return;
    }

    // 0 - самый последний коммит
    this.lastBuildCommitHash = log[0].commitHash;

    // запускаем сборки в порядке истории коммитов
    for (let i = log.length - 1; i >= 0; i--) {
      const logData = log[i];
      if (!logData) {
        continue;
      }

      const { commitHash, commitMessage, authorName } = logData;
      // видимо у хранилища есть таймаут, поэтому приходится дожидаться выполнения добавления
      await this.yandexService
        .addBuildToQueue({
          commitHash,
          commitMessage,
          authorName,
          branchName: this.mainBranch,
        })
        .catch((reason) => {
          console.log('Cannot add build to queue after pull ', reason.toString());
        });
    }
  };

  /**
   * наблюдение за клонированным репозиторием
   */
  watch = (repoName) => {
    this.fsWatcher = watch(this.getRepoFolder(repoName), async () => {
      console.log('repo updated');
    });

    this.interval = setInterval(async () => {
      try {
        await this.pullRepo(repoName);
        await this.sendBuildsForNewCommits();
      } catch (e) {
        console.log('Check repo error', e);
        this.stop();
      }
    }, this.intervalTime);
  };

  /**
   * остановка наблюдения за клонированным репозиторием
   */
  stop = () => {
    if (this.fsWatcher !== null) {
      this.fsWatcher.close();
    }

    if (this.interval !== null) {
      clearInterval(this.interval);
    }
  };

  /**
   * обновление репозитория
   */
  pullRepo = (repoName) => {
    return new Promise((resolve, reject) => {
      const pullProcess = spawn('git', ['pull'], {
        cwd: this.getRepoFolder(repoName),
      });
      pullProcess.stdout.on('data', (data) => {
        console.log(`Git pull stdout: ${data}`);
      });
      pullProcess.on('close', (code) => {
        console.log(`Git pull is finished. code=${code}`);
        if (code === 0) {
          resolve(true);
        } else {
          reject(false);
        }
      });

      pullProcess.stderr.on('data', (data) => {
        console.error(`Git pull stderr: ${data}`);
      });
    });
  };

  /**
   * получение команды для лога
   */
  getLogCommand = (branchName, params = {}) => {
    const format = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';
    const command = ['log'];
    if (params.untilHash === null) {
      command.push('-1');
    } else {
      command.push(`${untilHash}...HEAD`);
    }

    command.push(format);
    command.push(branchName);

    return command;
  };

  getShowCommand = (commitHash) => {
    const format = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';
    const command = ['show', '--quiet'];

    command.push(format);
    command.push(commitHash);

    return command;
  };

  getCommitInfo = async (commitHash) => {
    try {
      const log = await this.getLog(this.repoName, this.getShowCommand(commitHash));
      if (!log || log.length === 0) {
        return;
      }

      return log[0];
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * получение лога в отдельном процессе
   */
  getLog = (repoName, command) => {
    return new Promise((resolve, reject) => {
      let logData = '';
      const logProcess = spawn('git', command, {
        cwd: this.getRepoFolder(repoName),
      });

      logProcess.stdout.on('data', (data) => {
        const str = data.toString();
        logData += str;
      });

      logProcess.on('close', (code) => {
        console.log(`Git log is finished. code=${code}`);
        if (code !== 0) {
          reject();
        }

        const dataArr = logData.split('\n');
        const result = [];
        dataArr.forEach((logItem) => {
          try {
            if (logItem !== '') {
              result.push(JSON.parse(logItem));
            }
          } catch (e) {
            console.log(e);
          }
        });
        resolve(result);
      });

      logProcess.stderr.on('data', (data) => {
        console.error(`Git log stderr: ${data}`);
      });
    });
  };
}

const instance = new GitService(yandexSvc);

module.exports = instance;
