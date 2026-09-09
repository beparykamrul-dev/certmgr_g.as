export type GitHubIntegrationStatus = { configured: boolean; source: string };
export function githubStatus(env: NodeJS.ProcessEnv = process.env): GitHubIntegrationStatus { return { configured: Boolean(env.GITHUB_TOKEN?.trim()), source: 'runtime-config' }; }
