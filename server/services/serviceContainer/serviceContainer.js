/** контейнер сервисов */
class ServiceContainer {
  constructor() {
    this.services = {};
  }

  setService(svcName, svcInstance) {
    this.services[svcName] = svcInstance;
  }

  getService(svcName) {
    const service = this.services[svcName];
    if (service === undefined) {
      throw `Cannot get service with name ${svcName}`;
    } else {
      return service;
    }
  }
}

const container = new ServiceContainer();
module.exports = container;
