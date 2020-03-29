import { axios } from 'axiosInstance';
import * as actionTypes from 'store/actionTypes/buildDetails';

/**
 * запустить билд снова по выбранному хэшу
 */
export const runRebuild = (dispatch) => {
  return async (commitHash) => {
    dispatch({
      type: actionTypes.RUN_REBUILD,
    });

    await axios.post(`/api/builds/${commitHash}`);
  };
};
