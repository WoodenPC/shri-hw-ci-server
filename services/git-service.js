const { resolve } = require('path');
const { watch } = require('fs');
const { spawn } = require('child_process');

const { fileExistsAsync } = require('../utils/promisified');
const yandexSvc = require('./yandex-service');
const GitCommandBuilder = require('../utils/git-command-builder');
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
    return resolve('/home/repos', repoName);
  }

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
          resolve();
        } else {
          reject();
        }
      });
  
      gitCloneProcess.stderr.on('data', (data) => {
        console.error(`Git clone stderr: ${data.toString()}`);
      });
    });
  }

  // инициализация севиса
  init = async (settings) => {
    this.repoName = settings.repoName;
    this.repoUrl = `${BASE_GITHUB_URL}/${this.repoName}`;
    this.mainBranch = settings.mainBranch;
    if (!await fileExistsAsync(this.getRepoFolder(this.repoName))) {
      this.lastBuildCommitHash = null;
      try {
        await this.clone(this.repoUrl, this.repoName);
      } catch(e) {
        console.log(e);
        return false;
      }
    } else {
      console.log(`repo ${this.repoName} already cloned. continue`);
    }

    this.stop();
    this.watch(this.repoName);
    return true;
  }

  /**
   * наблюдение за клонированным репозиторием
   */
  watch = (repoName) => {
    this.fsWatcher = watch(this.getRepoFolder(repoName), () => {
      console.log('repo updated');
    });

    this.interval = setInterval(async () => {
      await this.pullRepo(repoName);
      const log = await this.getLog(repoName, this.mainBranch, this.lastBuildCommitHash);
      for (let i = 0; i < log.length; i++) {
        const logData = log[i];
        const { commitHash, commitMessage, authorName } = logData;
        this.yandexService.addBuildToQueue({
          commitHash,
          commitMessage,
          authorName,
          branchName: this.mainBranch
        }).catch((reason) => {
          onsole.log('Cannot add build to queue after pull ', reason.toString());
        });
      }
    }, this.intervalTime);
  }

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
  }

  /**
   * обновление репозитория
   */
  pullRepo = (repoName) => {
    return new Promise((resolve, reject) => {
      const pullProcess = spawn('git', ['pull'], {
        cwd: this.getRepoFolder(repoName)
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
  }

  getLogCommand = (branchName, untilHash = null) => {
    const format = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';
    const builder = new GitCommandBuilder();
    builder.addTarget('log');
    if (untilHash === null) {
      builder.addCount(1);
    } else {
      builder.addOtherInfo(`${untilHash}...HEAD`);
    }

    const command = builder.addPretty(format)
      .addBranch(branchName)
      .build();

    return command;
  }

  getLog = (repoName, branchName, untilHash = null) => {
    return new Promise((resolve, reject) => {
      let logData = '';
      const logProcess = spawn('git', this.getLogCommand(branchName, untilHash),
        {
          cwd: this.getRepoFolder(repoName)
        }
      );

      logProcess.stdout.on('data', (data) => {
        const str = data.toString();
        logData += str;
      });
  
      logProcess.on('close', (code) => {
        console.log(`Git log is finished. code=${code}`);
        if (code === 0) {
          const dataArr = logData.split('\n');
          const result = dataArr.map((logItem) => JSON.parse(logItem));
          resolve(result);
        } else {
          reject();
        }
      });
  
      logProcess.stderr.on('data', (data) => {
        console.error(`Git log stderr: ${data}`);
      });
    });
  }
}

const instance = new GitService(yandexSvc);

module.exports = instance;