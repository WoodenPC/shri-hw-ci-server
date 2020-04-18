import MockAdapter from 'axios-mock-adapter';

import { loadSettingsFromServerAsync, saveSettingsAsync } from './settings';

import * as actionTypes from 'store/actionTypes/settings';

import { mockStoreCreator } from 'utils/testUtils';
import { axios } from 'utils/axiosInstance';

const mockAxios = new MockAdapter(axios);

describe('Тесты ассинхронных экшенов Settings', () => {
  afterAll(() => {
    mockAxios.reset();
  });

  const testSettings = {
    repoName: 'some test repo',
    buildCommand: 'some build command',
    mainBranch: 'test branch',
    period: 69,
  };

  test('загрузка настроек с сервера', async () => {
    mockAxios.onGet('/api/settings').reply(200, {
      ...testSettings,
    });

    const expectedActions = [
      {
        type: actionTypes.LOAD_SETTINGS_FROM_SERVER_START,
      },
      {
        type: actionTypes.SET_SETTINGS,
        settings: testSettings,
      },
    ];

    const store = mockStoreCreator()({});
    await loadSettingsFromServerAsync(store.dispatch)();
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('сохранение (отправка на сервер) настроек', async () => {
    mockAxios.onPost('/api/settings').reply(200);

    const expectedActions = [
      {
        type: actionTypes.SET_SETTINGS,
        settings: testSettings,
      },
    ];

    const store = mockStoreCreator()({});
    const result = await saveSettingsAsync(store.dispatch)(testSettings);
    expect(result).toBeTruthy();
    expect(store.getActions()).toEqual(expectedActions);
  });
});
