import { IService } from 'interfaces/service.intfs';

export interface IServiceContainer {
  setService(name: string, instance: IService): void;
  getService(name: string): IService;
}

/** контейнер сервисов */
class ServiceContainer implements IServiceContainer {
  private static instance: ServiceContainer;
  private readonly services: Map<string, IService>;
  constructor() {
    this.services = new Map<string, IService>();
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }

    return ServiceContainer.instance;
  }

  setService(name: string, instance: IService): void {
    this.services.set(name, instance);
  }

  getService(name: string): IService {
    const service = this.services.get(name);
    if (service === undefined) {
      throw `Cannot get service with name ${name}`;
    } else {
      return service;
    }
  }
}

export function getServiceContainer(): IServiceContainer {
  return ServiceContainer.getInstance();
}
