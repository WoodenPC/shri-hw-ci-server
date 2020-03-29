import { axios } from 'axiosInstance';

import * as actionTypes from 'store/actionTypes/settings';

/**
 * сохранение настроек в сторе
 */
export const setSettings = (newSettings) => {
  return {
    type: actionTypes.SET_SETTINGS,
    settings: newSettings,
    isLoaded: true,
  };
};

export const loadSettingsFromServerAsync = (dispatch) => {
  return async () => {
    dispatch({ type: actionTypes.LOAD_SETTINGS_FROM_SERVER_START });
    try {
      const res = await axios.get('/api/settings');
      const { data } = res;
      const isLoaded = Object.keys(data).length > 0;
      dispatch(setSettings({ ...data, isLoaded }));
      return isLoaded;
    } catch (e) {
      console.log(e);
    }
  };
};
