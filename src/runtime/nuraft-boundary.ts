export type RaftNode = { id: string; address: string; role: 'leader' | 'follower' | 'candidate' | 'unknown'; term?: number; healthy: boolean };
export type NuRaftAdapter = { nodes(): Promise<RaftNode[]>; health(): Promise<{ healthy: boolean; leaderId?: string; term?: number }> };
export class UnconfiguredNuRaftAdapter implements NuRaftAdapter { async nodes() { return []; } async health() { return { healthy: false }; } }
