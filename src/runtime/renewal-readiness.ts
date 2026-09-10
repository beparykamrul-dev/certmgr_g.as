import type { ServiceHealth } from './service-health-verifier';
export function renewalReady(input: { approval: boolean; adapter: boolean; health?: ServiceHealth }): boolean { return input.approval && input.adapter && (input.health ? input.health.healthy : true); }
