const YandexSvc = require('./yandexService');

const mockWebClient = {};

describe('Тесты сервиса запросов к хранилищу яндекса', () => {
  beforeEach(() => {
    mockWebClient.get = jest.fn(() => Promise.resolve({}));
    mockWebClient.post = jest.fn(() => Promise.resolve({}));
  });

  test('функция получения списка сборок обращается к ручке /api/build/list с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    await yandexService.getBuildsList({ offset: 5, limit: 5 });
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/build/list', {
      params: {
        offset: 5,
        limit: 5,
      },
    });
  });

  test('Функция добавления сборки в очередь обращается к ручке /api/build/request с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    const testBuildData = {
      commitHash: 'testhash123',
      commitMessage: 'testMessageLul',
      branchName: 'master2',
      authorName: 'pogromist',
    };
    yandexService.startBuildMock = jest.fn();
    yandexService.finishBuildMock = jest.fn();
    await yandexService.addBuildToQueue(testBuildData);
    expect(mockWebClient.post).toHaveBeenLastCalledWith('/api/build/request', {
      ...testBuildData,
    });
  });

  test('Функция получения инфы о сборке обращается к ручке /api/build/details с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    await yandexService.getBuildInfo('testBuildId');
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/build/details', {
      params: {
        buildId: 'testBuildId',
      },
    });
  });

  test('Функция получения логов сборки о сборке обращается к ручке /api/build/log с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    await yandexService.getBuildLogs('testBuildId');
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/build/log', {
      params: {
        buildId: 'testBuildId',
      },
      responseType: 'stream',
    });
  });

  test('Функция получения сохраненных настроек обращается к ручке /api/conf с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    await yandexService.getSavedSettings('testBuildId');
    expect(mockWebClient.get).toHaveBeenLastCalledWith('/api/conf');
  });

  test('Функция сохранение настроек в хранилище обращается к ручке /api/conf с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
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

  test('Функция имитации старта сборки обращается к ручке /api/build/start с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    await yandexService.startBuildMock({ buildId: 'testBuildId' });
    expect(mockWebClient.post).toHaveBeenLastCalledWith('/api/build/start', {
      buildId: 'testBuildId',
      dateTime: expect.any(Date),
    });
  });

  test('Функция имитации завершения сборки обращается к ручке /api/build/finish с правильными параметрами', async () => {
    const yandexService = new YandexSvc(mockWebClient);
    await yandexService.finishBuildMock({ buildId: 'testBuildId' });
    expect(mockWebClient.post).toHaveBeenLastCalledWith('/api/build/finish', {
      buildId: 'testBuildId',
      duration: 10,
      success: true,
      buildLog: 'test logs',
    });
  });
});
