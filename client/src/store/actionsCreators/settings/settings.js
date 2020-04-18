import { axios } from 'utils/axiosInstance';

import * as actionTypes from 'store/actionTypes/settings';

/**
 * сохранение настроек в сторе
 */
export const setSettings = (newSettings) => {
  return {
    type: actionTypes.SET_SETTINGS,
    settings: newSettings,
  };
};

export const loadSettingsFromServerAsync = (dispatch) => {
  return async () => {
    dispatch({ type: actionTypes.LOAD_SETTINGS_FROM_SERVER_START });
    try {
      const res = await axios.get('/api/settings');
      const { data } = res;
      dispatch(setSettings({ ...data }));
      return data;
    } catch (e) {
      console.log(e);
    }
  };
};

/**
 * сохранение настроек и отправка их на сервер
 */
export const saveSettingsAsync = (dispatch) => {
  return async (settings) => {
    try {
      dispatch(setSettings({ ...settings }));
      const res = await axios.post('/api/settings', {
        ...settings,
      });
      return res && res.status === 200;
    } catch (e) {
      console.log(e);
    }
  };
};
