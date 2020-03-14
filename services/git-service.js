const { resolve } = require('path');
const { spawn } = require('child_process');
const { fileExistsAsync } = require('../utils/promisified');

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
  intervalTime = 10000; // 10c

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
        resolve(code === 0);
      });
  
      gitCloneProcess.stderr.on('data', (data) => {
        console.error(`Git clone stderr: ${data}`);
      });
    });
  }

  // инициализация севиса
  init = async (settings) => {
    this.repoName = settings.repoName;
    this.repoUrl = `${BASE_GITHUB_URL}/${this.repoName}`;

    if (!await fileExistsAsync(this.getRepoFolder(this.repoName))) {
      try {
        await this.clone(this.repoUrl, this.repoName);
      } catch(e) {
        console.log(e);
        return false;
      }
    } else {
      console.log('repo already cloned. continue');
    }

    //this.stop();
    //this.interval = setInterval(this.pull, this.intervalTime);
    return true;
  }



  watch = (file) => {

  }

  stop = () => {
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
  }
}

const instance = new GitService();

module.exports = instance;