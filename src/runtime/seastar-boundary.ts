export type SeastarNode = { id: string; endpoint: string; healthy: boolean; latencyMs?: number };
export type SeastarAdapter = { nodes(): Promise<SeastarNode[]>; metrics(): Promise<Record<string, number>> };
export class UnconfiguredSeastarAdapter implements SeastarAdapter { async nodes() { return []; } async metrics() { return {}; } }
