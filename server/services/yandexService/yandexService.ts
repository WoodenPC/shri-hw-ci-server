import { AxiosInstance, AxiosResponse } from 'axios';
import { IService } from 'interfaces/service.intfs';
import { IRepoSettings, IBuildInfo } from 'interfaces/data.intfs';

export interface IBuildListParams {
  offset: number;
  limit: number;
}

export interface IYandexService extends IService {
  getBuildList(params: IBuildListParams): Promise<AxiosResponse<any>>;
  addBuildToQueue(params: IBuildInfo): Promise<AxiosResponse<any>>;
  getBuildInfo(buildId: string): Promise<AxiosResponse<any>>;
  getBuildLogs(buildId: string): Promise<AxiosResponse<any>>;
  getSavedSettings(): Promise<AxiosResponse<{ data: IRepoSettings }>>;
  saveSettings(params: IRepoSettings): Promise<AxiosResponse<any>>;
}

/**
 * сервис для работы с хранилищем яндекса
 */
export class YandexService implements IYandexService {
  private webClient: AxiosInstance;
  constructor(webClient: AxiosInstance) {
    this.webClient = webClient;
  }

  public static getName = (): string => {
    return 'YandexService';
  };

  /**
   * получение списка сборок
   */
  getBuildList = ({ offset, limit }: IBuildListParams) => {
    return this.webClient.get('/api/build/list', {
      params: {
        offset: offset || 0,
        limit: limit || 25,
      },
    });
  };

  /**
   * добавление сборки в очередь
   */
  addBuildToQueue = async ({ commitHash, commitMessage, branchName, authorName }: IBuildInfo) => {
    return this.webClient.post('/api/build/request', {
      commitHash,
      commitMessage,
      branchName,
      authorName,
    }); // TODO: Проверить где эта функа вызывалась
  };

  /**
   * получение инфо о сборке
   */
  getBuildInfo = (buildId: string) => {
    return this.webClient.get('/api/build/details', {
      params: {
        buildId,
      },
    });
  };

  /**
   * получение логов сборки
   */
  getBuildLogs = (buildId: string) => {
    return this.webClient.get('/api/build/log', {
      params: {
        buildId,
      },
      responseType: 'stream',
    });
  };

  /**
   * получение сохраненных настроек
   */
  getSavedSettings = (): Promise<AxiosResponse<{ data: IRepoSettings }>> => {
    return this.webClient.get('/api/conf');
  };

  /**
   * сохранение настроек в хранилище
   */
  saveSettings = ({ repoName, buildCommand, mainBranch, period }: IRepoSettings) => {
    return this.webClient.post('/api/conf', {
      repoName: repoName,
      buildCommand: buildCommand,
      mainBranch: mainBranch,
      period: period,
    });
  };
}
