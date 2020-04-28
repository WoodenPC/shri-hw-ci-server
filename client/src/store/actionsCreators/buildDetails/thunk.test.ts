import MockAdapter from 'axios-mock-adapter';

import {
  loadBuildDetailsAsync,
  loadBuildLogsAsync,
  runRebuildAsync,
} from './buildDetails';

import * as actionTypes from 'store/actionTypes/buildDetails';

import { mockStoreCreator } from 'utils/testUtils';
import { axios } from 'utils/axiosInstance';

const mockAxios = new MockAdapter(axios);

describe('Тесты ассинхронных экшенов BuildDetails', () => {
  afterAll(() => {
    mockAxios.reset();
  });

  const testBuildDetails = {
    authorName: 'testAuthor',
    commitMessage: 'tesMmsg',
    commitHash: 'testHash',
    branchName: 'master',
  };

  test('загрузка подробностей сборки', async () => {
    mockAxios.onGet('/api/builds/testId').reply(200, {
      data: {
        ...testBuildDetails,
      },
    });

    const expectedActions = [
      {
        type: actionTypes.LOAD_BUILD_DETAILS,
      },
    ];

    const store = mockStoreCreator()({});
    const result = await loadBuildDetailsAsync(store.dispatch)('testId');
    expect(result).toEqual(testBuildDetails);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('загрузка лога сборки', async () => {
    const testLogs = 'test logs';
    mockAxios.onGet('/api/builds/testId/logs').reply(200, testLogs);

    const expectedActions = [
      {
        type: actionTypes.LOAD_BUILD_LOGS,
      },
    ];

    const store = mockStoreCreator()({});
    const result = await loadBuildLogsAsync(store.dispatch)('testId');
    expect(result).toBe(testLogs);
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('Поставить сборку заново', async () => {
    mockAxios.onPost('/api/builds/testHash').reply(200, {
      ...testBuildDetails,
    });

    const expectedActions = [
      {
        type: actionTypes.RUN_REBUILD,
      },
    ];

    const store = mockStoreCreator()({});
    const result = await runRebuildAsync(store.dispatch)(testBuildDetails);
    expect(result).toStrictEqual(testBuildDetails);
    expect(store.getActions()).toEqual(expectedActions);
  });
});
