const { Socket } = require('net');

class ApiService {
  constructor(webClient, { host, port, serverHost, serverPort }) {
    this.webClient = webClient;
    this.host = host;
    this.port = port;
    this.serverHost = serverHost;
    this.serverPort = serverPort
    this.connectedToServer = false;
    this.interval = setInterval(this.spyOnWebClient, 1000 * 30); //30c
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
      }).connect(Number(this.serverPort), this.serverHost);
    })
  }

  spyOnWebClient = async () => {
    try {
      const isAlive = await this.checkWebClientIsAlive();
      if (isAlive && this.connectedToServer) {
        console.log('server is alive, resume work');
        return;
      }
  
      if (!isAlive) {
        this.connectedToServer = false;
        console.log('server is not alive');
        return;
      } else if (!this.connectedToServer) {
        await this.notifyAgent();
      }
    } catch(e) {
      console.log(e);
    }
  }

  notifyAgent = async () => {
    console.log('notifying server');
    const apiRes = await this.webClient.post('/notify-agent', {
      host: this.host,
      port: this.port
    });

    this.connectedToServer = apiRes.status === 200;
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