import { Dispatch } from 'redux';
import { axios } from 'utils/axiosInstance';
import * as actionTypes from 'store/actionTypes/buildDetails';
import { ICommitInfo, IBuildInfo, IDataWrapper } from 'interfaces/data.intfs';
import { AxiosResponse } from 'axios';

/**
 * запустить билд снова по выбранному хэшу
 */
export const runRebuildAsync = (dispatch: Dispatch) => {
  return async (commitInfo: ICommitInfo) => {
    dispatch({
      type: actionTypes.RUN_REBUILD,
    });

    try {
      const res: AxiosResponse<IDataWrapper<IBuildInfo>> = await axios.post(
        `/api/builds/${commitInfo.commitHash}`,
        {
          commitHash: commitInfo.commitHash,
          commitMessage: commitInfo.commitMessage,
          authorName: commitInfo.authorName,
          branchName: commitInfo.branchName,
        }
      );
      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  };
};

/** загрузка деталей билда */
export const loadBuildDetailsAsync = (dispatch: Dispatch) => {
  return async (buildId: string) => {
    dispatch({ type: actionTypes.LOAD_BUILD_DETAILS });
    try {
      const res: AxiosResponse<IDataWrapper<IBuildInfo>> = await axios.get(
        `/api/builds/${buildId}`
      );
      return res.data.data;
    } catch (e) {
      console.log(e);
    }
  };
};

/** загрузка логов билда */
export const loadBuildLogsAsync = (dispatch: Dispatch) => {
  return async (buildId: string) => {
    dispatch({ type: actionTypes.LOAD_BUILD_LOGS });
    try {
      const res: AxiosResponse<string> = await axios.get(
        `/api/builds/${buildId}/logs`
      );
      return res.data;
    } catch (e) {
      console.log(e);
    }
  };
};
