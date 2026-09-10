import type { DatabaseControlAction, DatabaseQueryRequest } from '../contracts/database-control';
import type { DatabaseAdapter } from './database-adapter';
import type { DatabaseTargetRegistry } from './database-target-registry';
import type { AsyncApprovalStore } from './approval-store';
import { createApproval } from './approval-api';
import { canExecuteApproval } from './approval-service-async';

const PRIVILEGED_ACTIONS = new Set<DatabaseControlAction>(['backup','restore','checkpoint','vacuum','reload','rotate','replication-sync']);

export class DatabaseControlService {
  constructor(private readonly adapter: DatabaseAdapter, private readonly targets: DatabaseTargetRegistry, private readonly approvals: AsyncApprovalStore) {}
  listTargets() { return this.targets.list(); }
  async summary(id: string) { return this.adapter.summary(id); }
  async objects(id: string, kind?: Parameters<DatabaseAdapter['objects']>[1]) { return this.adapter.objects(id, kind); }
  async query(request: DatabaseQueryRequest) { return this.adapter.query(request); }
  requiresApproval(action: string) { return PRIVILEGED_ACTIONS.has(action as DatabaseControlAction); }
  async requestAction(action: string, target: string, requestedBy: string) {
    if (!this.requiresApproval(action)) throw new Error('unsupported_database_action');
    return createApproval(this.approvals, `database.${action}`, target, requestedBy);
  }
  async checkApproval(id: string) { return canExecuteApproval(this.approvals, id); }
}
