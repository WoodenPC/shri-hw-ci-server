
const axios = require('../axios-instance');
const cacheSvc = require('./cache-service');

class YandexService {
  constructor(webClient, cacheService) {
    this.webClient = webClient;
    this.cacheService = cacheService;
  }

  /**
   * получение списка сборок
   */
  getBuildsList = ({ offset, limit }) => {
    return this.webClient.get('/api/build/list', {
      params: {
        offset: offset || 0,
        limit: limit || 25
      }
    });
  }

  /**
   * добавление сборки в очередь
   */
  addBuildToQueue = async ({ commitHash, commitMessage, branchName, authorName }) => {
    try {
      await this.webClient.post('/api/build/request', {
        commitHash,
        commitMessage: commitMessage || '',
        branchName: branchName || '',
        authorName: authorName || ''
      });

      const apiResponse = await this.getBuildsList({ limit: 1, offset: 0 });
  
      const { data } = apiResponse;
      if (data === undefined) {
        return;
      }
      const buildParams = { buildId: data.data[0].id };
      await this.startBuildMock(buildParams);
    
      setTimeout(() => {
        this.finishBuildMock(buildParams);
      }, 2000);

      return data;
    } catch(e) {
      console.log('Cannot add build to queue', e.toString());
    }
  }

  /**
   * получение инфо о сборке
   */
  getBuildInfo = (buildId) => {
    return this.webClient.get('/api/build/details', {
      params: {
        buildId
      }
    });
  }

  /**
   * получение логов сборки
   */
  getBuildLogs = (buildId) => {
    return this.webClient.get('/api/build/log', {
      params: {
        buildId
      },
      responseType: 'stream'
    });
  }

  /**
   * получение сохраненных настроек
   */
  getSavedSettings = () => {
    return this.webClient.get('/api/conf');
  }

  /**
   * сохранение настроек в хранилище
   */
  saveSettings = ({ repoName, buildCommand, mainBranch, period }) => {
    return this.webClient.post('/api/conf', {
      repoName: repoName,
      buildCommand: buildCommand,
      mainBranch: mainBranch,
      period: period
    });
  }

  /**
   * имитация старта сборки
   */
  startBuildMock = async ({ buildId }) => {
    try {
      await this.webClient.post('/api/build/start', {
        buildId,
        dateTime: new Date(Date.now())
      });
    } catch(e) {
      console.log('Start build mock failed', e.toString());
    }
  }

  /**
   * имитация завершения сборки
   */
  finishBuildMock = async ({ buildId }) => {
    try {
      await this.webClient.post('/api/build/finish', {
        buildId,
        duration: 1,
        success: true,
        buildLog: 'some test log'
      });
    } catch(e) {
      console.log('Finish build mock failed', e.toString());
      return;
    }
  }
}

const instance = new YandexService(axios, cacheSvc);
module.exports = instance;