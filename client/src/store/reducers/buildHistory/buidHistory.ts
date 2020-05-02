import * as actionTypes from 'store/actionTypes/buildHistory';
import type { BuildHistoryAction } from 'store/actionTypes/buildHistory';
import type { BuildInfo } from 'types/data.types';

interface IBuildHistoryState {
  offset: number;
  limit: number;
  builds: Array<BuildInfo>;
}

export const initialState: IBuildHistoryState = {
  offset: 0,
  limit: 10,
  builds: [],
};

const reducer = (state = initialState, action: BuildHistoryAction) => {
  switch (action.type) {
    case actionTypes.DELETE_BUILDS_HISTORY:
      return { ...initialState };
    case actionTypes.ADD_MORE_BUILDS:
      return {
        ...state,
        builds: state.builds.concat(action.builds),
        offset: state.offset + action.offset,
      };
    case actionTypes.SET_BUILDS:
      return {
        ...state,
        builds: action.builds,
        offset: action.builds.length,
      };
    default:
      return state;
  }
};

export { reducer };
