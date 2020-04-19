const { spawn } = require('child_process');
const { promisify } = require('util');
const { exists, rmdir } = require('fs');

const existsAsync = promisify(exists);
const rmdirAsync = promisify(rmdir);

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

  runBuildCommand = () => {
    const { buildCommand } = this.buildParams;
    console.log('starting to build command ', buildCommand);
    const dir = this.getRepoDir();
    const result = { log: '' }
    return new Promise((resolve) => {
      const buildProcess = spawn(buildCommand, {
        shell: true,
        cwd: dir,
        stdio: 'inherit'
      })

      buildProcess.on('data', (data) => {
        console.log('build command data', data.toString());
        result.log += data.toString();
      }).on('close', (code) => {
        result.status = code === 0 ? 'Success' : 'Fail';
        resolve(result);
      }).on('error', (err) => {
        result.log += err.toString();
        resolve(result);
      });
      buildProcess.stderr.on('data', (data) => {
        console.log('build command stderr', data.toString());
        result.log += data.toString();
      });
    }).catch((err) => {
      result.log += err.toString();
      return result;
    })
  }

  /**получение папки где будет лежать репа */
  getRepoDir = () => {
    return `${this.buildPath}/repo`;
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

      gitCheckoutProcess.stderr.on('data', (data) => {
        console.log('git checkout stderr data, ',data.toString());
        result.log += data.toString();
      });
    });
  }

  processRepository = async () => {
    const time = Date.now();
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

    console.log('checkout result', checkoutResult);

    const buildResult = await this.runBuildCommand();
    console.log('build result', buildResult);
    return {
      status: buildResult.status,
      buildLog: cloneResult.log + checkoutResult.log + buildResult.log,
      duration: Date.now() - time
    };
  }

}

module.exports = BuildService;