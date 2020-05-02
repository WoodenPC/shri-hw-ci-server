import * as actionsCreators from 'store/actionsCreators/settings';
import { deleteBuildsHistory } from 'store/actionsCreators/buildHistory';
import type { Dispatch } from 'redux';
import type { RepoSettings } from 'types/data.types';
import type { RootState } from 'store/store';

export const mapStateToProps = (store: RootState) => {
  return {
    settings: store.settings,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setSettings: (settings: RepoSettings) =>
      dispatch(actionsCreators.setSettings(settings)),
    saveSettingsAsync: actionsCreators.saveSettingsAsync(dispatch),
    deleteBuildsHistory: () => dispatch(deleteBuildsHistory()),
  };
};
