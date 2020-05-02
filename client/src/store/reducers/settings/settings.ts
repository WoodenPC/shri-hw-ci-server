import * as actionTypes from 'store/actionTypes/settings';
import { SettingsAction } from 'store/actionTypes/settings';

export const initialState = {
  repoName: '',
  buildCommand: '',
  mainBranch: '',
  period: 10,
};

const reducer = (state = initialState, action: SettingsAction) => {
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

export { reducer };
