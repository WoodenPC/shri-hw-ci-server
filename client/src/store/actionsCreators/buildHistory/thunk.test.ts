import MockAdapter from 'axios-mock-adapter';

import { loadBuildsAsync, runBuildAsync } from './buildHistory';

import * as actionTypes from 'store/actionTypes/buildHistory';

import { mockStoreCreator } from 'utils/testUtils';
import { axios } from 'utils/axiosInstance';

const mockAxios = new MockAdapter(axios);

describe('Тесты ассинхронных экшенов BuildHistory', () => {
  afterAll(() => {
    mockAxios.reset();
  });

  const testBuildsData = {
    builds: [{ id: 'test1' }, { id: 'test2' }, { id: 'test3' }],
    offset: 3,
  };

  test('загрузка чанка билдов с сервера', async () => {
    mockAxios.onGet('/api/builds').reply(200, {
      data: [...testBuildsData.builds],
    });

    const expectedActions = [
      {
        type: actionTypes.LOAD_BUILDS_START,
      },
      {
        type: actionTypes.ADD_MORE_BUILDS,
        ...testBuildsData,
      },
    ];

    const store = mockStoreCreator()({});
    await loadBuildsAsync(store.dispatch)();
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('Запуск билда', async () => {
    mockAxios.onPost('/api/builds/testHash').reply(200);

    const expectedActions = [
      {
        type: actionTypes.RUN_BUILD,
      },
    ];

    const store = mockStoreCreator()({});
    const result = await runBuildAsync(store.dispatch)('testHash');
    expect(result).toBeTruthy();
    expect(store.getActions()).toEqual(expectedActions);
  });
});
