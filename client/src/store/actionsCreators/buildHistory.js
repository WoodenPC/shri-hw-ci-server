import * as actionTypes from 'store/actionTypes/buildHistory';
import { axios } from 'axiosInstance';

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
 * загрузка чанка билдов с сервера
 */
export const loadMoreBuildsAsync = (dispatch) => {
  return async () => {
    dispatch({
      type: actionTypes.LOAD_MORE_BUILDS_START,
    });

    try {
      const res = await axios.get('/api/builds');
      // TODO
      console.log(res.data);
    } catch (e) {
      console.log(e);
    }

    return dispatch({
      type: actionTypes.LOAD_MORE_BUILDS_END,
      builds: [],
    });
  };
};
