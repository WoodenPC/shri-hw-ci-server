const { spawn } = require('child_process');
const { promisify } = require('util');
const { exists, rmdir, readFile, mkdir } = require('fs');
const { resolve } = require('path');
const { createInterface } = require('readline');

const existsAsync = promisify(exists);
const rmdirAsync = promisify(rmdir);
const readFileAsync = promisify(readFile);
const mkdirAsync = promisify(mkdir);

class BuildService {
  constructor(buildPath) {
    this.buildParams = {};
    this.buildPath = buildPath;
  }

  setParams = ({ buildId, commitHash, repoAddress, buildCommand }) => {
    this.buildParams = {
      buildId,
      commitHash,
      repoAddress,
      buildCommand
    }
  }

  readLogsFromFile = async () => {
    const dir = this.getRepoDir();
    const logsPath = resolve(dir, 'logs.txt');
    console.log('reading logs from logs.txt, path=', logsPath);
    try {
      if (!await existsAsync(logsPath)) {
        return '';
      }
    
      const logs = await readFileAsync(logsPath, { encoding: 'utf8' });
      return logs;
    } catch(e) {
      return e.toString();
    }
  }

  runBuildCommand = () => {
    const { buildCommand } = this.buildParams;
    console.log('starting to build command ', buildCommand);
    const dir = this.getRepoDir();
    const result = { log: '' }
    return new Promise((resolve) => {
      const buildProcess = spawn(buildCommand, {
        shell: true,
        cwd: dir,
      });

      createInterface({
        input: buildProcess.stdout,
        terminal: false,
      }).on('line', (line) => {
        result.log += `${line}\n`;
      });

      createInterface({
        input: buildProcess.stderr,
        terminal: false,
      }).on('line', (line) => {
        result.log += `${line}\n`;
      });

      buildProcess.on('error', (data) => {
        console.error('build process error', data);
        resolve(result);
      });

      buildProcess.on('close', (code) => {
        console.log('Build command code = ', code);
        result.status = code === 0 ? 'Success' : 'Fail';
        resolve(result);
      });

    }).catch((err) => {
      result.log += err.toString();
      return result;
    })
  }

  /**получение папки где будет лежать репа */
  getRepoDir = () => {
    return resolve(`${this.buildPath}/repo`);
  }

  /** удаление папки с репозиторием  */
  removeRepoDir = async () => {
    const dir = this.getRepoDir();
    if (!await existsAsync(dir)) {
      return;
    }

    await rmdirAsync(dir, { recursive: true });
  }

    /**
   * клонирование репозитория
   */
  clone = async () => {
    if (!await existsAsync(this.buildPath)) {
      await mkdirAsync(this.buildPath);
    }
    return new Promise((resolve) => {
      let result = { isCloned: false, log: '' };
      const { repoAddress } = this.buildParams;
      const gitCloneProcess = spawn('git', ['clone', repoAddress, 'repo'], {
        cwd: this.buildPath
      });
      gitCloneProcess.stdout.on('data', (data) => {
        result.log += data.toString();
        console.log(`Git clone stdout: ${data}`);
      });

      gitCloneProcess.on('close', (code) => {
        console.log(`Git clone is finished. code=${code}`);
        result.isCloned = code === 0;
        resolve(result);
      });

      gitCloneProcess.on('error', (err) => {
        result.log += err.toString();
        resolve(result);
      });

      gitCloneProcess.stderr.on('data', (data) => {
        result.log += data.toString();
        console.error(`Git clone stderr: ${data.toString()}`);
      });
    });
  };

  /** переключение на коммит */
  checkoutToCommit = () => {
    return new Promise((resolve) => {
      let result = { isCheckouted: false, log: '' };
      const { commitHash } = this.buildParams;
      const gitCheckoutProcess = spawn('git', ['checkout', commitHash], {
        cwd: this.getRepoDir()
      });
      gitCheckoutProcess.stdout.on('data', (data) => {
        console.log('git checkout data', data.toString())
        result.log += data.toString();
      });

      gitCheckoutProcess.on('close', (code) => {
        console.log(`Git checkout is finished. code=${code}`);
        result.isCheckouted = code === 0;
        resolve(result);
      });

      gitCheckoutProcess.on('error', (err) => {
        result.log += err.toString();
        resolve(result);
      });

      gitCheckoutProcess.stderr.on('data', (data) => {
        console.log('git checkout stderr data, ',data.toString());
        result.log += data.toString();
      });
    });
  }

  processRepository = async () => {
    const time = Date.now();
    try {
      await this.removeRepoDir();
      const cloneResult = await this.clone();
      if (!cloneResult.isCloned) {
        return {
          status: 'Fail',
          buildLog: cloneResult.log,
          duration: Date.now() - time
        };
      }
  
      const checkoutResult = await this.checkoutToCommit();
  
      if (!checkoutResult.isCheckouted) {
        return {
          status: 'Fail',
          buildLog: cloneResult.log + checkoutResult.log,
          duration: Date.now() - time
        };
      }
  
      const buildResult = await this.runBuildCommand();
      return {
        buildStatus: buildResult.status,
        buildLog: cloneResult.log + checkoutResult.log + buildResult.log,
        duration: Date.now() - time
      };
    } catch(e) {
      return {
        buildStatus: 'Fail',
        buildLog: e.toString(),
        duration: 0
      };
    }
  }

}

module.exports = BuildService;