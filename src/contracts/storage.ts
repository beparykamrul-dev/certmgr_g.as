export interface StorageHealth { configured: boolean; reachable: boolean; source: 'postgresql' | 'memory' | 'unknown'; reason?: string; }
export interface StorageAdapter<T> { get(id: string): Promise<T | null>; put(value: T): Promise<void>; delete(id: string): Promise<void>; }
