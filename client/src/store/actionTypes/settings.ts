import { IRepoSettings } from 'interfaces/data.intfs';

export const SET_SETTINGS = 'SET_SETTINGS';
export const LOAD_SETTINGS_FROM_SERVER_START =
  'LOAD_SETTINGS_FROM_SERVER_START';
export const LOAD_SETTINGS_FROM_SERVER_END = 'LOAD_SETTINGS_FROM_SERVER_END';

interface ISetSettingsAction {
  type: string;
  settings: IRepoSettings;
}

export type SettingsAction = ISetSettingsAction;
