import { env } from './env';

export type EndpointConfig = { name: string; url?: string; tokenEnv?: string };

export function endpoint(name: string, urlEnv: string, tokenEnv?: string): EndpointConfig {
  return { name, url: env(urlEnv), tokenEnv };
}
