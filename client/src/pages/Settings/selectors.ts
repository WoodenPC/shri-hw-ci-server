import * as actionsCreators from 'store/actionsCreators/settings';
import { deleteBuildsHistory } from 'store/actionsCreators/buildHistory';
import { Dispatch } from 'redux';
import { IRepoSettings } from 'interfaces/data.intfs';
import { RootState } from 'store/store';

export const mapStateToProps = (store: RootState) => {
  return {
    settings: store.settings,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setSettings: (settings: IRepoSettings) =>
      dispatch(actionsCreators.setSettings(settings)),
    saveSettingsAsync: actionsCreators.saveSettingsAsync(dispatch),
    deleteBuildsHistory: () => dispatch(deleteBuildsHistory()),
  };
};
