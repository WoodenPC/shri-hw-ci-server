/**
 * сервис для работы с хранилищем яндекса
 */
class YandexService {
  constructor(webClient) {
    this.webClient = webClient;
  }

  /**
   * получение списка сборок
   */
  getBuildsList = ({ offset, limit }) => {
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
  addBuildToQueue = async ({ commitHash, commitMessage, branchName, authorName }) => {
    try {
      const apiResponse = await this.webClient.post('/api/build/request', {
        commitHash,
        commitMessage: commitMessage || '',
        branchName: branchName || '',
        authorName: authorName || '',
      });

      const { data } = apiResponse;
      return data;
    } catch (e) {
      console.log('Cannot add build to queue', e.toString());
    }
  };

  /**
   * получение инфо о сборке
   */
  getBuildInfo = (buildId) => {
    return this.webClient.get('/api/build/details', {
      params: {
        buildId,
      },
    });
  };

  /**
   * получение логов сборки
   */
  getBuildLogs = (buildId) => {
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
  getSavedSettings = () => {
    return this.webClient.get('/api/conf');
  };

  /**
   * сохранение настроек в хранилище
   */
  saveSettings = ({ repoName, buildCommand, mainBranch, period }) => {
    return this.webClient.post('/api/conf', {
      repoName: repoName,
      buildCommand: buildCommand,
      mainBranch: mainBranch,
      period: period,
    });
  };

  /**
   * имитация старта сборки
   */
  startBuildMock = ({ buildId }) => {
    return this.webClient.post('/api/build/start', {
      buildId,
      dateTime: new Date(Date.now()),
    });
  };

  /**
   * имитация завершения сборки
   */
  finishBuildMock = ({ buildId }) => {
    return this.webClient.post('/api/build/finish', {
      buildId,
      duration: 10,
      success: true,
      buildLog: 'test logs',
    });
  };
}

module.exports = YandexService;
