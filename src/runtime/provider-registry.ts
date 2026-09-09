import type { ProviderStatus } from './provider-status';

export const PROVIDERS = ['Meta','Google','Netflix','Akamai','Cloudflare','EdgeNext','AWS','TikTok','Fastly','Bunny','Tencent Cloud','Alibaba Cloud','Oracle Cloud','DigitalOcean','Linode','Vultr','Hetzner','OVHcloud','IBM Cloud','Microsoft Azure'] as const;
export type ProviderName = typeof PROVIDERS[number];
export type ProviderRegistry = Record<ProviderName, ProviderStatus>;
