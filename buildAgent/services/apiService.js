const { Socket } = require('net');

class ApiService {
  constructor(webClient) {
    this.webClient = webClient;
  }

  checkWebClientIsAlive = () => {
    return new Promise((resolve) => {
      const socket = new Socket();
      socket.on('connect', () => {
        resolve(true);
      }).on('timeout', () => {
        resolve(false)
      }).on('error', () => {
        resolve(false);
      }).connect(this.webClient.defaults.baseUrl);
    })
  }

  notifyAgent = ({ host, port }) => {
    return this.webClient.post('/notify-agent', {
      host,
      port
    });
  }

  notifyBuildResult = ({ buildId, buildStatus, buildLog }) => {
    return this.webClient.post('/notify-build-result', {
      buildId,
      buildStatus,
      buildLog
    })
  }
}

module.exports = ApiService