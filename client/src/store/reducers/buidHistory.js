import * as actionTypes from 'store/actionTypes/buildHistory';

const initialState = {
  offset: 0,
  limit: 10,
  builds: [],
  buildsLoaded: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DELETE_BUILDS_HISTORY:
      return { ...initialState, isLoaded: false };
    case actionTypes.ADD_MORE_BUILDS:
      return {
        ...state,
        builds: state.builds.concat(action.builds),
        offset: state.offset + action.offset,
        buildsLoaded: true,
      };
    case actionTypes.SET_BUILDS:
      return {
        ...state,
        builds: action.builds,
        buildsLoaded: true,
      };
    default:
      return state;
  }
};

export { reducer as buildHistoryReducer };
