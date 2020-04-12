import * as actionCreators from 'store/actionsCreators/buildHistory';

export const mapStateToProps = (store) => {
  const { builds, offset, limit } = store.buildHistory;
  const { repoName } = store.settings;
  return {
    builds,
    offset,
    limit,
    repoName,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    loadBuildsAsync: actionCreators.loadBuildsAsync(dispatch),
    runBuildAsync: actionCreators.runBuildAsync(dispatch),
  };
};
