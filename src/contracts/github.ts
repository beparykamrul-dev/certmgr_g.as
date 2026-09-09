export interface GitHubRepositoryRef { owner: string; repository: string; ref?: string; }
export interface GitHubChangeRequest { repository: GitHubRepositoryRef; path: string; reason: string; approvalId?: string; }
