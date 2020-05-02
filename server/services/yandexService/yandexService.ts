import { AxiosInstance, AxiosResponse } from 'axios';
import { IService } from 'interfaces/service.intfs';
import { IRepoSettings, ICommitInfo, IBuildInfo, IDataWrapper } from 'interfaces/data.intfs';

export interface IBuildListParams {
  offset: number;
  limit: number;
}

export type BuildListResponse = AxiosResponse<IDataWrapper<Array<IBuildInfo>>>;
export type BuildRequestResponse = AxiosResponse<IDataWrapper<IBuildInfo>>;
export type BuildInfoResponse = AxiosResponse<IDataWrapper<IBuildInfo>>;
export type SavedSettingsResponse = AxiosResponse<IDataWrapper<IRepoSettings>>;

export interface IYandexService extends IService {
  getBuildList(params: IBuildListParams): Promise<BuildListResponse>;
  addBuildToQueue(params: ICommitInfo): Promise<BuildRequestResponse>;
  getBuildInfo(buildId: string): Promise<BuildInfoResponse>;
  getBuildLogs(buildId: string): Promise<AxiosResponse<string>>;
  getSavedSettings(): Promise<SavedSettingsResponse>;
  saveSettings(params: IRepoSettings): Promise<AxiosResponse<string>>;
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
  getBuildList = (params: IBuildListParams): Promise<BuildListResponse> => {
    return this.webClient.get('/api/build/list', {
      params: {
        offset: params.offset,
        limit: params.limit,
      },
    });
  };

  /**
   * добавление сборки в очередь
   */
  addBuildToQueue = async (commitInfo: ICommitInfo): Promise<BuildRequestResponse> => {
    return this.webClient.post('/api/build/request', {
      commitHash: commitInfo.commitHash,
      commitMessage: commitInfo.commitMessage,
      branchName: commitInfo.branchName,
      authorName: commitInfo.authorName,
    });
  };

  /**
   * получение инфо о сборке
   */
  getBuildInfo = (buildId: string): Promise<BuildInfoResponse> => {
    return this.webClient.get('/api/build/details', {
      params: {
        buildId,
      },
    });
  };

  /**
   * получение логов сборки
   */
  getBuildLogs = (buildId: string): Promise<AxiosResponse<string>> => {
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
  getSavedSettings = (): Promise<SavedSettingsResponse> => {
    return this.webClient.get('/api/conf');
  };

  /**
   * сохранение настроек в хранилище
   */
  saveSettings = (settings: IRepoSettings): Promise<AxiosResponse<string>> => {
    return this.webClient.post('/api/conf', {
      repoName: settings.repoName,
      buildCommand: settings.buildCommand,
      mainBranch: settings.mainBranch,
      period: settings.period,
    });
  };
}
