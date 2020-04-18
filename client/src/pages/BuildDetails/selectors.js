import * as actionCreators from 'store/actionsCreators/buildDetails';

export const mapStateToProps = (store) => {
  const { settings } = store;
  return {
    repoName: settings.repoName,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    runRebuildAsync: actionCreators.runRebuildAsync(dispatch),
    loadBuildDetailsAsync: actionCreators.loadBuildDetailsAsync(dispatch),
    loadBuildLogsAsync: actionCreators.loadBuildLogsAsync(dispatch),
  };
};
