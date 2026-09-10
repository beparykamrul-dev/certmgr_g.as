import type { DatabaseObject, DatabaseQueryRequest, DatabaseQueryResult, DatabaseSummary, DatabaseTarget } from '../contracts/database-control';

export type DatabaseAdapter = {
  discover(): Promise<DatabaseTarget[]>;
  summary(targetId: string): Promise<DatabaseSummary>;
  objects(targetId: string, kind?: DatabaseObject['kind']): Promise<DatabaseObject[]>;
  query(request: DatabaseQueryRequest): Promise<DatabaseQueryResult>;
};

export class UnconfiguredDatabaseAdapter implements DatabaseAdapter {
  async discover() { return []; }
  async summary(_targetId: string): Promise<DatabaseSummary> { throw new Error('database_adapter_not_configured'); }
  async objects(_targetId: string): Promise<DatabaseObject[]> { throw new Error('database_adapter_not_configured'); }
  async query(_request: DatabaseQueryRequest): Promise<DatabaseQueryResult> { throw new Error('database_adapter_not_configured'); }
}
