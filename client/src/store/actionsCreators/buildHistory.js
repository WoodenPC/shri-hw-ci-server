import * as actionTypes from 'store/actionTypes/buildHistory';
import { axios } from 'axiosInstance';

/**
 * дроп билдов
 */
export const deleteBuildsHistory = () => {
  return {
    type: actionTypes.DELETE_BUILDS_HISTORY,
  };
};

/**
 * сохранение билдов в сторе
 */
export const setBuilds = (builds) => {
  return {
    type: actionTypes.SET_BUILDS,
    builds,
  };
};

/**
 * добавление в список билдов
 */
export const addMoreBuilds = (builds) => {
  return {
    type: actionTypes.ADD_MORE_BUILDS,
    builds,
    offset: builds.length,
  };
};

/**
 * загрузка чанка билдов с сервера
 */
export const loadBuildsAsync = (dispatch) => {
  return async (offset = 0, limit = 10) => {
    dispatch({
      type: actionTypes.LOAD_BUILDS_START,
    });

    try {
      const res = await axios.get('/api/builds', {
        params: {
          offset,
          limit,
        },
      });

      console.log(res.data);
      return dispatch(addMoreBuilds(res.data.data));
    } catch (e) {
      console.log(e);
    }
  };
};

export const runBuildAsync = (dispatch) => {
  return async (commitHash) => {
    try {
      dispatch({ type: actionTypes.RUN_BUILD });
      const res = await axios.post(`/api/builds/${commitHash}`);
      return res && res.status === 200;
      // не меняем стейт, т.к. наверное предполагается
      // что юзер должен обновить страничку и список билдов
      // загрузится заного
    } catch (e) {
      console.log(e);
    }
  };
};
