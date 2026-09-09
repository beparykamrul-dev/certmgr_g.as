import { env } from './env';
import { unavailable, configured, AdapterResult } from './result';

export function githubConfig(): AdapterResult<{ api: string; tokenConfigured: boolean }> {
  const tokenConfigured = Boolean(env('GITHUB_TOKEN'));
  const api = env('GITHUB_API_URL') || 'https://api.github.com';
  return tokenConfigured ? configured('github', { api, tokenConfigured }) : unavailable('github', 'GITHUB_TOKEN is not configured');
}
