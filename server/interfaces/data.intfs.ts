export interface IRepoSettings {
  repoName: string;
  buildCommand: string;
  mainBranch: string;
  period: number;
}

export interface IBuildInfo {
  commitHash: string;
  commitMessage: string;
  branchName: string;
  authorName: string;
}
