import * as actionCreators from 'store/actionsCreators/buildHistory';
import { RootState } from 'store/store';
import { Dispatch } from 'redux';

export const mapStateToProps = (store: RootState) => {
  const { builds, offset, limit } = store.buildHistory;
  const { repoName } = store.settings;
  return {
    builds,
    offset,
    limit,
    repoName,
  };
};

export const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadBuildsAsync: actionCreators.loadBuildsAsync(dispatch),
    runBuildAsync: actionCreators.runBuildAsync(dispatch),
  };
};
