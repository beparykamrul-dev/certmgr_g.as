export interface SnapshotPayload { timestamp: string; environment: string; modules: string[]; activeProviders: string[]; deviceContext: string; }

export function buildSnapshot(input: Omit<SnapshotPayload, 'timestamp'>): SnapshotPayload {
  return { ...input, timestamp: new Date().toISOString() };
}
