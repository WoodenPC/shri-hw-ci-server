const { Socket } = require('net');

const svcContainer = require('./serviceContainer');
/**
 * Сервис, который умеет в управление агентами
 */
class AgentsService {
  constructor() {
    this.agents = {};
    this.interval = setInterval(this.checkAgentsAsync, 1000 * 60);
  }

  // зарегистрировать агента
  register = ({ host, port }) => {
    console.log(`registered agent with host: ${host}, port: ${port}`);
    this.agents[`${host}:${port}`] = null;
  }

  // отрегестрировать агента
  unregister = ({ host, port }) => {
    console.log(`unregistered agent with host: ${host}, port: ${port}`);
    delete this.agents[`${host}:${port}`];
  }

  // отрегестрировать агента
  unregister = (agentAddress) => {
    console.log(`unregistered agent with address: ${agentAddress}`);
    if (this.agents.hasOwnProperty(agentAddress)) {
      delete this.agents[agentAddress];
    }
  }

  bindAgentAddressToBuild = (agentAddress, buildData) => {
    console.log(`binded agent to build ${buildData}`);
    this.agents[agentAddress] = buildData
  }

  unBindAgentAddress = (agentAddress) => {
    console.log(`unbinded agent with address ${agentAddress}`);
    this.agents[agentAddress] = null;
  }

  freeAgentAddress = (agentAddress) => {
    console.log(`agent on address ${agentAddress} is free now`);
    this.agents[agentAddress] = null;
  }

  unBindAgentByBuildId = (buildId) => {
    const entries = Object.entries(this.agents);
    for (let [key, value] of entries) {
      if (value !== null && value.id === buildId) {
        this.unBindAgentAddress(key);
      }
    }
  }

  /** проверка на доступность агента */
  checkAgentIsAliveAsync = (agentAddress) => {
    const [host, port] = agentAddress.split(':');
    return new Promise((resolve) => {
      const socket = new Socket();
      socket.on('connect', () => {
        console.log(`${agentAddress} is alive`);
        resolve(true);
      }).on('error', (err) => {
        console.log(err);
        resolve(false);
      }).on('timeout', () => {
        console.log(`${agentAddress} timeout`);
        resolve(false);
      }).connect(Number(port), host)
    });
  }

  /** Проверка агентов на доступность */
  checkAgentsAsync = async () => {
    const apiService = svcContainer.getService('ApiService');
    console.log('checking agents');
    const agentAddresses = Object.keys(this.agents);

    for (let i = 0; i < agentAddresses.length; i++) {
      const agentAddress = agentAddresses[i];
      try {
        const isAlive = await this.checkAgentIsAliveAsync(agentAddress);
        if (!isAlive) {
          const agentData = this.agents[agentAddress] ;
          if (agentData !== null) {
            const { id } = agentData;
            await apiService.finishBuildAsync({
              buildId: id,
              buildLog: 'Build agent not responded during build',
              duration: 0,
              success: false
            })
          }
          this.unregister(agentAddress);
        }
      } catch(e) {
        this.unregister(agentAddress);
      }
    }
  }

  /** получение первого свободного адреса агента */
  getFirstAvailableAgentAddress = () => {
    const agentAddresses = Object.keys(this.agents);

    for (let i = 0; i < agentAddresses.length; i++) {
      const agentAddress = agentAddresses[i];
      if (this.agents[agentAddress] === null) {
        return agentAddress;
      }
    }
  }

  getFreeAgentsAddresses = () => {
    const agentAddresses = Object.keys(this.agents);
    const result = [];

    for (let i = 0; i < agentAddresses.length; i++) {
      const agentAddress = agentAddresses[i];
      if (this.agents[agentAddress] === null) {
        result.push(agentAddress);
      }
    }

    return result;
  }
}

module.exports = AgentsService;