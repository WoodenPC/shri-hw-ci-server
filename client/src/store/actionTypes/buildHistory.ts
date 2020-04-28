import { IBuildInfo } from 'interfaces/data.intfs';
export const LOAD_BUILDS_START = 'LOAD_BUILDS_START';
export const LOAD_BUILDS_END = 'LOAD_BUILDS_END';
export const SET_BUILDS = 'SET_BUILDS';
export const ADD_MORE_BUILDS = 'ADD_MORE_BUILDS';
export const DELETE_BUILDS_HISTORY = 'DELETE_BUILDS_HISTORY';
export const RUN_BUILD = 'RUN_BUILD';

interface IDeleteBuildsHistoryAction {
  type: typeof DELETE_BUILDS_HISTORY;
}

interface ISetBuildsAction {
  type: typeof SET_BUILDS;
  builds: Array<IBuildInfo>;
}

interface IAddMoreBuildsAction {
  type: typeof ADD_MORE_BUILDS;
  builds: Array<IBuildInfo>;
  offset: number;
}

export type BuildHistoryAction =
  | IDeleteBuildsHistoryAction
  | ISetBuildsAction
  | IAddMoreBuildsAction;
