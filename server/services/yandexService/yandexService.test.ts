import { YandexService } from './yandexService';

const mockWebClient: any = {};

describe('Тесты сервиса запросов к хранилищу яндекса', () => {
  beforeEach(() => {
    mockWebClient.get = jest.fn(() => Promise.resolve({}));
    mockWebClient.post = jest.fn(() => Promise.resolve({}));
  });

  test('функция получения списка сборок обращается к ручке /api/build/list с правильными параметрами', async () => {
    const yandexService = new YandexService(mockWebClient);
    await yandexService.getBuildList({ offset: 5, limit: 5 });
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/build/list', {
      params: {
        offset: 5,
        limit: 5,
      },
    });
  });

  test('Функция добавления сборки в очередь обращается к ручке /api/build/request с правильными параметрами', async () => {
    const yandexService = new YandexService(mockWebClient);
    const testBuildData = {
      commitHash: 'testhash123',
      commitMessage: 'testMessageLul',
      branchName: 'master2',
      authorName: 'pogromist',
    };
    await yandexService.addBuildToQueue(testBuildData);
    expect(mockWebClient.post).toHaveBeenLastCalledWith('/api/build/request', {
      ...testBuildData,
    });
  });

  test('Функция получения инфы о сборке обращается к ручке /api/build/details с правильными параметрами', async () => {
    const yandexService = new YandexService(mockWebClient);
    await yandexService.getBuildInfo('testBuildId');
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/build/details', {
      params: {
        buildId: 'testBuildId',
      },
    });
  });

  test('Функция получения логов сборки о сборке обращается к ручке /api/build/log с правильными параметрами', async () => {
    const yandexService = new YandexService(mockWebClient);
    await yandexService.getBuildLogs('testBuildId');
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/build/log', {
      params: {
        buildId: 'testBuildId',
      },
      responseType: 'stream',
    });
  });

  test('Функция получения сохраненных настроек обращается к ручке /api/conf с правильными параметрами', async () => {
    const yandexService = new YandexService(mockWebClient);
    await yandexService.getSavedSettings();
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/conf');
  });

  test('Функция сохранение настроек в хранилище обращается к ручке /api/conf с правильными параметрами', async () => {
    const yandexService = new YandexService(mockWebClient);
    const testSettings = {
      repoName: 'some test repo',
      buildCommand: 'npm run testttt',
      mainBranch: 'fake branch',
      period: 95,
    };
    await yandexService.saveSettings({
      ...testSettings,
    });
    expect(mockWebClient.post).toHaveBeenLastCalledWith('/api/conf', {
      ...testSettings,
    });
  });
});
