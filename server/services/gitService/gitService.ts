import { resolve } from 'path';
import { watch, FSWatcher } from 'fs';
import { spawn } from 'child_process';

import { fileExistsAsync } from 'utils/promisified';

import { IServiceContainer, getServiceContainer } from 'services/serviceContainer';
import { IRepoSettings } from 'interfaces/data.intfs';
import { IYandexService } from 'services/yandexService';
import { IService } from 'interfaces/service.intfs';
import { ICommitInfo } from 'interfaces/data.intfs';

const BASE_GITHUB_URL: string = 'https://github.com';

export interface IGitService extends IService {
  clone(url: string, repoName: string): Promise<boolean>;
  checkout(repoName: string, branchName: string): Promise<boolean>;
  init(settings: IRepoSettings): Promise<boolean>;
  sendBuildsForNewCommits(): Promise<void>;
  pullRepo(repoName: string): Promise<boolean>;
  getCommitInfo(commitHash: string): Promise<ICommitInfo | undefined>;
}

interface ILogData {
  commitHash: string;
  authorName: string;
  commitMessage: string;
}

/**
 * сервис для работы с гит репозиториями
 * умеет в клонирование и слежение за текущем репозиторием
 */
export class GitService implements IGitService {
  private repoUrl: string;
  private repoSettings: IRepoSettings;
  private interval: NodeJS.Timeout | null;
  private fsWatcher: FSWatcher | null;
  private intervalTime: number;
  private lastBuildCommitHash: string;

  constructor() {
    this.repoUrl = '';
    this.repoSettings = {
      repoName: '',
      buildCommand: '',
      mainBranch: '',
      period: 0,
    };
    this.lastBuildCommitHash = '';
    this.intervalTime = 10000; // 10c
    this.interval = null;
    this.fsWatcher = null;
  }

  public static getName = (): string => 'GitService';

  getRepoFolder = (repoName: string): string => {
    const repoFolder = process.env.REPOS_DIR || '/home/repos';
    return resolve(repoFolder, repoName);
  };

  /**
   * клонирование репозитория
   */
  clone = (url: string, repoName: string) => {
    return new Promise<boolean>((resolve, reject) => {
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

      gitCloneProcess.on('error', (err) => {
        reject(err);
      });
    });
  };

  // изменение ветки
  checkout = (repoName: string, branchName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      const repoPath = this.getRepoFolder(repoName);
      const gitCheckoutProcess = spawn('git', ['checkout', branchName], {
        cwd: repoPath,
      });
      gitCheckoutProcess.stdout.on('data', (data) => {
        console.log(`Git checkout stdout: ${data}`);
      });

      gitCheckoutProcess.on('close', (code) => {
        console.log(`Git checkout is finished. code=${code}`);
        if (code === 0) {
          resolve(true);
        } else {
          reject(`Cannot checkout. Finished this code ${code}`);
        }
      });

      gitCheckoutProcess.stderr.on('data', (data) => {
        console.error(`Git checkout stderr: ${data.toString()}`);
      });

      gitCheckoutProcess.on('error', (err) => {
        reject(err);
      });
    });
  };

  /** загружает настройки из сервиса хранилища яндекса и инициализируется с этими настройками */
  loadSettingsFromYandexStorage = async () => {
    try {
      const serviceContainer: IServiceContainer = getServiceContainer();
      const yandexService: IYandexService = serviceContainer.getService('YandexService') as IYandexService;
      const apiResponse = await yandexService.getSavedSettings();
      const { data } = apiResponse;
      if (!data || !data.data) {
        return;
      }

      await this.init(data.data);
    } catch (e) {
      console.log(e.toString());
    }
  };

  // инициализация севиса
  init = async (settings: IRepoSettings): Promise<boolean> => {
    this.repoSettings = settings;
    this.repoUrl = `${BASE_GITHUB_URL}/${settings.repoName}`;
    this.intervalTime = settings.period * 1000 * 60; // делаем минуты
    if (!(await fileExistsAsync(this.getRepoFolder(settings.repoName)))) {
      this.lastBuildCommitHash = '';
      try {
        await this.clone(this.repoUrl, settings.repoName);
        await this.checkout(settings.repoName, settings.mainBranch);
      } catch (e) {
        console.log(e.toString());
        return false;
      }
    } else {
      await this.checkout(settings.repoName, settings.mainBranch);
      // ставим билд на последний коммит
      const log = await this.getLog(settings.repoName, this.getLogCommand());
      if (log) {
        // получаем последний коммит
        this.lastBuildCommitHash = log[0] && log[0].commitHash;
      }
      console.log(`repo ${settings.repoName} already cloned. continue`);
    }

    this.stop();
    this.watch(settings.repoName);
    return true;
  };

  /**
   * отправка коммитов на сборку
   */
  sendBuildsForNewCommits = async (): Promise<void> => {
    let log;
    const { mainBranch, repoName } = this.repoSettings;
    try {
      log = await this.getLog(repoName, this.getLogCommand({ untilHash: this.lastBuildCommitHash }));
    } catch (e) {
      console.log('cannot get log ', e);
      return;
    }

    if (!log || log.length === 0) {
      return;
    }

    // 0 - самый последний коммит
    this.lastBuildCommitHash = log[0].commitHash;
    const serviceContainer: IServiceContainer = getServiceContainer();
    const yandexService: IYandexService = serviceContainer.getService('YandexService') as IYandexService;
    // запускаем сборки в порядке истории коммитов
    for (let i = log.length - 1; i >= 0; i--) {
      const logData = log[i];
      if (!logData) {
        continue;
      }

      const { commitHash, commitMessage, authorName } = logData;
      // видимо у хранилища есть таймаут, поэтому приходится дожидаться выполнения добавления
      try {
        await yandexService.addBuildToQueue({
          commitHash,
          commitMessage,
          authorName,
          branchName: mainBranch,
        });
      } catch (e) {
        console.log('Cannot add build to queue after pull ', e);
      }
    }
  };

  /**
   * наблюдение за клонированным репозиторием
   */
  watch = async (repoName: string): Promise<void> => {
    const { intervalTime } = this;
    this.fsWatcher = watch(this.getRepoFolder(repoName), () => {
      console.log('repo updated');
    });

    this.interval = setInterval(async () => {
      try {
        await this.pullRepo(repoName);
        await this.sendBuildsForNewCommits();
      } catch (e) {
        console.log('Check repo error', e.toString());
        this.stop();
      }
    }, intervalTime);
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
  pullRepo = (repoName: string): Promise<boolean> => {
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

      pullProcess.on('error', (err) => {
        reject(err);
      });
    });
  };

  /**
   * получение команды для лога
   */
  getLogCommand = (params: { untilHash?: string } = {}): Array<string> => {
    const format = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';
    const command = ['log'];
    if (!params.untilHash) {
      command.push('-1');
    } else {
      command.push(`${params.untilHash}...HEAD`);
    }

    command.push(format);
    return command;
  };

  getShowCommand = (commitHash: string) => {
    const format = '--pretty=format:{ "commitHash":"%H", "authorName":"%cn", "commitMessage": "%s" }';
    const command = ['show', '--quiet'];

    command.push(format);
    command.push(commitHash);

    return command;
  };

  getCommitInfo = async (commitHash: string): Promise<ICommitInfo | undefined> => {
    const { repoName, mainBranch } = this.repoSettings;
    try {
      console.log(`getting ${commitHash} info from git service`);
      const log: Array<ILogData> = await this.getLog(repoName, this.getShowCommand(commitHash));
      if (!log || log.length === 0) {
        return;
      }

      return {
        ...log[0],
        branchName: mainBranch,
        commitHash,
      };
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * получение лога в отдельном процессе
   */
  getLog = (repoName: string, command: Array<string>): Promise<Array<ILogData>> => {
    console.log('starting getting log, command = ', command);
    return new Promise<Array<ILogData>>((resolve, reject) => {
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
        const result: Array<ILogData> = [];
        dataArr.forEach((logItem) => {
          try {
            if (logItem !== '') {
              result.push(JSON.parse(logItem));
            }
          } catch (e) {
            console.log(e.toString());
          }
        });
        resolve(result);
      });

      logProcess.stderr.on('data', (data) => {
        console.error(`Git log stderr: ${data}`);
      });

      logProcess.on('error', (err) => {
        reject(err);
      });
    });
  };
}
