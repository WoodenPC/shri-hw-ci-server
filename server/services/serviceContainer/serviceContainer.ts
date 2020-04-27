import { IService } from 'interfaces/service.intfs';

export interface IServiceContainer {
  setService<T extends IService>(name: string, instance: T): void;
  getService<T extends IService>(name: string): T;
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

  setService<T>(name: string, instance: T): void {
    this.services.set(name, instance);
  }

  getService<T>(name: string): T {
    const service = this.services.get(name);
    if (service === undefined) {
      throw `Cannot get service with name ${name}`;
    } else {
      return service as T;
    }
  }
}

export function getServiceContainer(): IServiceContainer {
  return ServiceContainer.getInstance();
}
