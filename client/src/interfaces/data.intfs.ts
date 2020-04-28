export enum BuildStatus {
  Waiting = 'Waiting',
  InProgress = 'InProgress',
  Success = 'Success',
  Fail = 'Fail',
  Canceled = 'Canceled',
}

export interface IRepoSettings {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}

export interface ICommitInfo {
  commitHash: string;
  commitMessage: string;
  branchName: string;
  authorName: string;
}

export interface IBuildInfo {
  id: string;
  buildNumber: number;
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
  status: BuildStatus;
  start: string;
  duration: number;
}

export interface IDataWrapper<T> {
  data: T;
}
