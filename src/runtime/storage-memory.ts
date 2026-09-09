import type { StorageBackend, StorageRecord } from './storage-records';

export function createMemoryStorage(): StorageBackend {
  const records: StorageRecord[] = [];
  return {
    append: record => { records.push(record); },
    list: kind => kind ? records.filter(record => record.kind === kind) : [...records],
  };
}
