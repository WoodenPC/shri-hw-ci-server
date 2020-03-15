
const axios = require('../axios-instance');
const cacheSvc = require('./cache-service');

class YandexService {
  constructor(webClient, cacheService) {
    this.webClient = webClient;
    this.cacheService = cacheService;
  }

  getBuildsList = (params) => {
    return this.webClient.get('/api/build/list', {
      params: {
        offset: params.offset || 0,
        limit: params.limit || 25
      }
    });
  }

  addBuildToQueue = ({ commitHash, commitMessage, branchName, authorName }) => {
    return this.webClient.post('/api/build/request', {
      commitHash,
      commitMessage: commitMessage || '',
      branchName: branchName || '',
      authorName: authorName || ''
    });
  }

  getBuildInfo = (buildId) => {
    return this.webClient.get('/api/build/details', {
      params: {
        buildId
      }
    });
  }

  getBuildLogs = (buildId) => {
    return this.webClient.get('/api/build/log', {
      params: {
        buildId
      }
    });
  }

  getSavedSettings = () => {
    return this.webClient.get('/api/conf');
  }

  saveSettings = ({ repoName, buildCommand, mainBranch, period }) => {
    return this.webClient.post('/api/conf', {
      repoName: repoName,
      buildCommand: buildCommand,
      mainBranch: mainBranch,
      period: period
    });
  }

  startBuildMock = async ({ buildId }) => {
    try {
      await this.webClient.post('/api/build/start', {
        buildId: buildId,
        dateTime: Date.now().toLocaleString()
      });
    } catch(e) {
      console.log('Start build mock failed', e.toString());
    }
  }

  finishBuildMock = async ({ buildId }) => {
    try {
      await this.webClient.post('/api/build/finish', {
        buildId: buildId,
        duration: 1,
        success: true,
        buildLog: 'some test log'
      });
    } catch(e) {
      console.log('Finish build mock failed', e.toString());
      return;
    }

    await this.cacheService.write(buildId, 'some test log');
  }
}

const instance = new YandexService(axios, cacheSvc);
module.exports = instance;