import { axios } from 'utils/axiosInstance';
import * as actionTypes from 'store/actionTypes/buildDetails';

/**
 * запустить билд снова по выбранному хэшу
 */
export const runRebuildAsync = (dispatch) => {
  return async ({ commitHash, commitMessage, authorName, branchName }) => {
    dispatch({
      type: actionTypes.RUN_REBUILD,
    });

    try {
      const res = await axios.post(`/api/builds/${commitHash}`, {
        commitHash,
        commitMessage,
        authorName,
        branchName,
      });
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
};

/** загрузка логов билда */
export const loadBuildDetailsAsync = (dispatch) => {
  return async (buildId) => {
    dispatch({ type: actionTypes.LOAD_BUILD_DETAILS });
    try {
      const res = await axios.get(`/api/builds/${buildId}`);
      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  };
};

export const loadBuildLogsAsync = (dispatch) => {
  return async (buildId) => {
    dispatch({ type: actionTypes.LOAD_BUILD_LOGS });
    try {
      const res = await axios.get(`/api/builds/${buildId}/logs`);
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
};
