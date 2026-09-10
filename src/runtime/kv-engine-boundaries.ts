export type KvEngine = 'lmdb' | 'lmdbpp' | 'mdbx';
export type KvAdapter = { engine: KvEngine; get(key: Uint8Array): Promise<Uint8Array | undefined>; put(key: Uint8Array, value: Uint8Array): Promise<void>; delete(key: Uint8Array): Promise<void> };
export class UnconfiguredKvAdapter implements KvAdapter { constructor(public readonly engine: KvEngine) {} async get() { throw new Error(`${this.engine}_adapter_not_configured`); } async put() { throw new Error(`${this.engine}_adapter_not_configured`); } async delete() { throw new Error(`${this.engine}_adapter_not_configured`); } }
