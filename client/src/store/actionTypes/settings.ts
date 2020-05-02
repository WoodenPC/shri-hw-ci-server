import type { RepoSettings } from 'types/data.types';

export const SET_SETTINGS = 'SET_SETTINGS';
export const LOAD_SETTINGS_FROM_SERVER_START =
  'LOAD_SETTINGS_FROM_SERVER_START';
export const LOAD_SETTINGS_FROM_SERVER_END = 'LOAD_SETTINGS_FROM_SERVER_END';

interface SetSettingsAction {
  type: string;
  settings: RepoSettings;
}

export type SettingsAction = SetSettingsAction;
