import type { AdapterStatus } from './types';

export class GitHubAdapter {
  async status(): Promise<AdapterStatus> { return { configured: false, name: 'github', reason: 'A GitHub App installation or token is not configured.' }; }
}
