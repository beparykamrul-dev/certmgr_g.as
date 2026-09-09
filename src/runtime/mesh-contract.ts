export type MeshNode = { id: string; address: string; role: string; state: 'up' | 'down' | 'unknown'; observedAt: string };
export type MeshSnapshot = { nodes: MeshNode[]; observedAt: string };
