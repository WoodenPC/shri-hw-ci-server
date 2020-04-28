import { reducer, initialState } from './buidHistory';
import * as actionCreators from 'store/actionsCreators/buildHistory';

describe('тесты редьюсера BuildHistory', () => {
  test('DELETE_BUILDS_HISTORY', () => {
    const initialStateWithBuilds = {
      ...initialState,
      offset: 3,
      limit: 10,
      builds: [{ id: '1' }, { id: '2' }, { id: '3' }],
    };

    const action = actionCreators.deleteBuildsHistory();
    expect(reducer(initialStateWithBuilds, action)).toEqual({
      ...initialState,
    });
  });

  test('SET_BUILDS', () => {
    const testBuilds = [{ id: '1' }, { id: '321' }];
    const action = actionCreators.setBuilds(testBuilds);
    expect(reducer(initialState, action)).toEqual({
      ...initialState,
      builds: testBuilds,
      offset: testBuilds.length,
    });
  });

  test('ADD_MORE_BUILDS', () => {
    const testBuilds = [{ id: '223' }, { id: '321' }];
    const action = actionCreators.addMoreBuilds(testBuilds);
    const initialStateWithBuilds = {
      ...initialState,
      builds: [{ id: 's12' }, { id: 'gh23' }, { id: 'pf2' }],
      offset: 3,
    };

    expect(reducer(initialStateWithBuilds, action)).toEqual({
      ...initialStateWithBuilds,
      builds: initialStateWithBuilds.builds.concat(testBuilds),
      offset: 5,
    });
  });
});
