import * as actionTypes from 'store/actionTypes/settings';

const initialState = {
  repoName: '',
  buildCommand: '',
  mainBranch: '',
  period: 10,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_SETTINGS:
      return {
        ...state,
        ...action.settings,
      };
    default:
      return state;
  }
};

export { reducer as settingsReducer };
