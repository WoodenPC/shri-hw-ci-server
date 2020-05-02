export enum BuildStatus {
  Waiting = 'Waiting',
  InProgress = 'InProgress',
  Success = 'Success',
  Fail = 'Fail',
  Canceled = 'Canceled',
}

export type RepoSettings = {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
};

export type CommitInfo = {
  commitHash: string;
  commitMessage: string;
  branchName: string;
  authorName: string;
};

export type BuildInfo = {
  id: string;
  buildNumber: number;
  commitMessage: string;
  commitHash: string;
  branchName: string;
  authorName: string;
  status: BuildStatus;
  start: string;
  duration: number;
};

export type DataWrapper<T> = {
  data: T;
};
