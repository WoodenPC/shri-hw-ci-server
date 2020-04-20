const { Socket } = require('net');

class ApiService {
  constructor(webClient, host, port) {
    this.webClient = webClient;
    this.host = host;
    this.port = port;
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

  notifyAgent = () => {
    return this.webClient.post('/notify-agent', {
      host: this.host,
      port: this.port
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