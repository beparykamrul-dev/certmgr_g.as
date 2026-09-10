import type { DatabaseObject, DatabaseQueryRequest, DatabaseQueryResult, DatabaseSummary, DatabaseTarget } from '../contracts/database-control';
import type { DatabaseAdapter } from './database-adapter';

export class UnconfiguredDatabaseAdapter implements DatabaseAdapter {
  async discover(): Promise<DatabaseTarget[]> { return []; }
  async summary(_targetId: string): Promise<DatabaseSummary> { throw new Error('database_adapter_not_configured'); }
  async objects(_targetId: string, _kind?: DatabaseObject['kind']): Promise<DatabaseObject[]> { throw new Error('database_adapter_not_configured'); }
  async query(_request: DatabaseQueryRequest): Promise<DatabaseQueryResult> { throw new Error('database_adapter_not_configured'); }
}
