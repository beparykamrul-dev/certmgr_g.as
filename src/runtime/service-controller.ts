import crypto from 'node:crypto';
import type { ServiceAction, ServiceCommand, ServiceResult } from '../contracts/service-controller';

export type ServiceControllerAdapter = {
  execute(command: ServiceCommand): Promise<ServiceResult>;
};

export function buildServiceCommand(service: string, action: ServiceAction, requestedBy: string, approvalId: string): ServiceCommand {
  return { id: crypto.randomUUID(), service, action, requestedBy, approvalId };
}

export async function executeApprovedServiceCommand(adapter: ServiceControllerAdapter, command: ServiceCommand): Promise<ServiceResult> {
  if (!command.approvalId.trim()) return { commandId: command.id, accepted: false, executed: false, reason: 'approval_id_required' };
  return adapter.execute(command);
}
