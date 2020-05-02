import type { BuildInfo } from 'types/data.types';
export const LOAD_BUILDS_START = 'LOAD_BUILDS_START';
export const LOAD_BUILDS_END = 'LOAD_BUILDS_END';
export const SET_BUILDS = 'SET_BUILDS';
export const ADD_MORE_BUILDS = 'ADD_MORE_BUILDS';
export const DELETE_BUILDS_HISTORY = 'DELETE_BUILDS_HISTORY';
export const RUN_BUILD = 'RUN_BUILD';

type DeleteBuildsHistoryAction = {
  type: typeof DELETE_BUILDS_HISTORY;
};

type SetBuildsAction = {
  type: typeof SET_BUILDS;
  builds: Array<BuildInfo>;
};

type AddMoreBuildsAction = {
  type: typeof ADD_MORE_BUILDS;
  builds: Array<BuildInfo>;
  offset: number;
};

export type BuildHistoryAction =
  | DeleteBuildsHistoryAction
  | SetBuildsAction
  | AddMoreBuildsAction;
