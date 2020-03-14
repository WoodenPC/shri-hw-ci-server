const axios = require('../axios-instance');

class YandexService {
  constructor(webClient) {
    this.webClient = webClient;
  }

  getBuildsList = (params) => {
    return this.webClient.get('/api/build/list', {
      params: {
        offset: params.offset || 0,
        limit: params.limit || 25
      }
    });
  }

  addBuildToQueue = (commitHash, params) => {
    return this.webClient.post('/api/build/request', {
      commitHash,
      commitMessage: params.commitMessage || '',
      branchName: params.branchName || '',
      authorName: params.authorName || ''
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

  saveSettings = (params) => {
    return this.webClient.post('/api/conf', {
      repoName: params.repoName,
      buildCommand: params.buildCommand,
      mainBranch: params.mainBranch,
      period: params.period
    });
  }
}

const instance = new YandexService(axios);
module.exports = instance;