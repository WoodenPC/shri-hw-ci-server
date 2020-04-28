import * as actionCreators from 'store/actionsCreators/buildDetails';
import { RootState } from 'store/store';
import { Dispatch } from 'redux';

export const mapStateToProps = (store: RootState) => {
  const { settings } = store;
  return {
    repoName: settings.repoName,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    runRebuildAsync: actionCreators.runRebuildAsync(dispatch),
    loadBuildDetailsAsync: actionCreators.loadBuildDetailsAsync(dispatch),
    loadBuildLogsAsync: actionCreators.loadBuildLogsAsync(dispatch),
  };
};
