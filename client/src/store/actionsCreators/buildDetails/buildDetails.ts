import { Dispatch } from 'redux';
import { axios } from 'utils/axiosInstance';
import * as actionTypes from 'store/actionTypes/buildDetails';
import { ICommitInfo } from 'interfaces/data.intfs';

/**
 * запустить билд снова по выбранному хэшу
 */
export const runRebuildAsync = (dispatch: Dispatch) => {
  return async (commitInfo: ICommitInfo) => {
    dispatch({
      type: actionTypes.RUN_REBUILD,
    });

    try {
      const res = await axios.post(`/api/builds/${commitInfo.commitHash}`, {
        commitHash: commitInfo.commitHash,
        commitMessage: commitInfo.commitMessage,
        authorName: commitInfo.authorName,
        branchName: commitInfo.branchName,
      });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
};

/** загрузка логов билда */
export const loadBuildDetailsAsync = (dispatch: Dispatch) => {
  return async (buildId: string) => {
    dispatch({ type: actionTypes.LOAD_BUILD_DETAILS });
    try {
      const res = await axios.get(`/api/builds/${buildId}`);
      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  };
};

export const loadBuildLogsAsync = (dispatch: Dispatch) => {
  return async (buildId: string) => {
    dispatch({ type: actionTypes.LOAD_BUILD_LOGS });
    try {
      const res = await axios.get(`/api/builds/${buildId}/logs`);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
};
