import { Dispatch } from 'redux';
import { AxiosResponse } from 'axios';

import * as actionTypes from 'store/actionTypes/buildHistory';
import { BuildHistoryAction } from 'store/actionTypes/buildHistory';
import { axios } from 'utils/axiosInstance';
import { IBuildInfo, IDataWrapper } from 'interfaces/data.intfs';

/**
 * дроп билдов
 */
export const deleteBuildsHistory = (): BuildHistoryAction => {
  return {
    type: actionTypes.DELETE_BUILDS_HISTORY,
  };
};

/**
 * сохранение билдов в сторе
 */
export const setBuilds = (builds: Array<IBuildInfo>): BuildHistoryAction => {
  return {
    type: actionTypes.SET_BUILDS,
    builds,
  };
};

/**
 * добавление в список билдов
 */
export const addMoreBuilds = (
  builds: Array<IBuildInfo>
): BuildHistoryAction => {
  return {
    type: actionTypes.ADD_MORE_BUILDS,
    builds,
    offset: builds.length,
  };
};

/**
 * загрузка чанка билдов с сервера
 */
export const loadBuildsAsync = (dispatch: Dispatch) => {
  return async (offset = 0, limit = 10) => {
    dispatch({
      type: actionTypes.LOAD_BUILDS_START,
    });

    try {
      const res: AxiosResponse<IDataWrapper<
        Array<IBuildInfo>
      >> = await axios.get('/api/builds', {
        params: {
          offset,
          limit,
        },
      });

      return dispatch(addMoreBuilds(res.data.data));
    } catch (e) {
      console.log(e);
    }
  };
};

export const runBuildAsync = (dispatch: Dispatch) => {
  return async (commitHash: string) => {
    try {
      dispatch({ type: actionTypes.RUN_BUILD });
      const res = await axios.post(`/api/builds/${commitHash}`);
      return res && res.status === 200;
      // не меняем стейт, т.к. наверное предполагается
      // что юзер должен обновить страничку и список билдов
      // загрузится заного
    } catch (e) {
      console.log(e);
      return false;
    }
  };
};
