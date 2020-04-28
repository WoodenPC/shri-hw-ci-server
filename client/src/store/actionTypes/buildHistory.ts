import { IBuildInfo } from 'interfaces/data.intfs';
export const LOAD_BUILDS_START = 'LOAD_BUILDS_START';
export const LOAD_BUILDS_END = 'LOAD_BUILDS_END';
export const SET_BUILDS = 'SET_BUILDS';
export const ADD_MORE_BUILDS = 'ADD_MORE_BUILDS';
export const DELETE_BUILDS_HISTORY = 'DELETE_BUILDS_HISTORY';
export const RUN_BUILD = 'RUN_BUILD';

interface IDeleteBuildsHistoryAction {
  type: string;
}

interface ISetBuildsAction {
  type: string;
  builds: Array<IBuildInfo>;
}

interface IAddMoreBuildsAction {
  type: string;
  builds: Array<IBuildInfo>;
  offset: number;
}

export type BuildHistoryAction =
  | IDeleteBuildsHistoryAction
  | ISetBuildsAction
  | IAddMoreBuildsAction;
