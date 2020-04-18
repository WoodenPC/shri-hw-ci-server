import * as actionsCreators from 'store/actionsCreators/settings';
import { deleteBuildsHistory } from 'store/actionsCreators/buildHistory';

export const mapStateToProps = (store) => {
  return {
    settings: store.settings,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setSettings: (settings) => dispatch(actionsCreators.setSettings(settings)),
    saveSettingsAsync: actionsCreators.saveSettingsAsync(dispatch),
    deleteBuildsHistory: () => dispatch(deleteBuildsHistory()),
  };
};
