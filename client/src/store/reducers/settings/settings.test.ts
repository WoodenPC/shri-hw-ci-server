import { reducer, initialState } from './settings';
import * as actionCreators from 'store/actionsCreators/settings';

describe('Тесты редьюсера Settings', () => {
  test('SET_SETTINGS', () => {
    const testSettings = {
      repoName: 'some test repo',
      buildCommand: 'some build command',
      mainBranch: 'test branch',
      period: 69,
    };
    const action = actionCreators.setSettings(testSettings);
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      ...testSettings,
    });
  });
});
