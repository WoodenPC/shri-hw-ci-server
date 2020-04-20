const svcContainer = require('./serviceContainer');
const axios = require('axios');

class ApiService {
  constructor(webClient) {
    this.webClient = webClient;
    this.interval = setInterval(this.checkBuildsAsync, 10000);
  }

  /** старт сборки */
  startBuildAsync = ({ buildId }) => {
    return this.webClient.post('/build/start', {
      buildId,
      dateTime: new Date(Date.now()),
    });
  }

  /** завершение сборки */
  finishBuildAsync = ({ buildId, buildLog, duration = 0, success = 'false' }) => {
    return this.webClient.post('/build/finish', {
      buildId,
      duration,
      success,
      buildLog,
    });
  }

  cancelBuild = ({ buildId }) => {
    return this.webClient.post('/build/cancel', {
      buildId
    });
  };

  /** получение списка билдов */
  getBuildsListAsync = ({ offset, limit }) => {
    return this.webClient.get('/build/list', {
      params: {
        offset: offset || 0,
        limit: limit || 25,
      },
    });
  };

  getSavedSettings = () => {
    return this.webClient.get('/conf');
  };

  checkBuildsAsync = async () => {
    try {
      const agentsSvc = svcContainer.getService('AgentsService');
      const apiResSettings = await this.getSavedSettings();
      const savedSettings = apiResSettings.data.data;
      await agentsSvc.checkAgentsAsync();
      const freeAgentsAddresses = agentsSvc.getFreeAgentsAddresses();
      const apiResBuilds = await this.getBuildsListAsync({ offset: 0, limit: 300 });
      const builds = apiResBuilds.data.data;
      let lastBuildInWaiting = null;
      for (let i = builds.length - 1; i >= 0; i--) {
        if (freeAgentsAddresses.length === 0) {
          return;
        }

        if (builds[i].status !== 'Waiting') {
          continue;
        }

        console.log('start building ', builds[i]);

        lastBuildInWaiting = builds[i];
        const agentAddress = freeAgentsAddresses.pop();
        agentsSvc.bindAgentAddressToBuild(agentAddress, lastBuildInWaiting);
        await this.startBuildAsync({ buildId: lastBuildInWaiting.id });
        const buildRes = await axios.post(`http://${agentAddress}/build`, {
          buildId: lastBuildInWaiting.id,
          repoAddress: `http://github.com/${savedSettings.repoName}`,
          commitHash: lastBuildInWaiting.commitHash,
          buildCommand: savedSettings.buildCommand
        });

        if (buildRes.status !== 200) {
          this.finishBuildAsync({
            buildId: lastBuildInWaiting.id,
            buildLog: 'Cannot start build',
            duration: 0,
            buildLog: ''
          });
        }
      }
    } catch(e) {
      console.log(e);
    }
  }
} 

module.exports = ApiService;