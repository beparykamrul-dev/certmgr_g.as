import crypto from 'node:crypto';
import type { ApprovalRequest } from './approval-contract';
import type { ApprovalStore } from './approval-store';

export function requestApproval(store: ApprovalStore, action: string, target: string, requestedBy: string, ttlMs = 15 * 60 * 1000): ApprovalRequest {
  const now = Date.now();
  const request: ApprovalRequest = { id: crypto.randomUUID(), action, target, requestedBy, state: 'pending', createdAt: new Date(now).toISOString(), expiresAt: new Date(now + ttlMs).toISOString() };
  store.put(request);
  return request;
}

export function approveRequest(store: ApprovalStore, id: string): ApprovalRequest | undefined {
  const request = store.get(id);
  if (!request || request.state !== 'pending') return undefined;
  if (request.expiresAt && Date.parse(request.expiresAt) <= Date.now()) return { ...request, state: 'expired' };
  const approved = { ...request, state: 'approved' as const };
  store.put(approved);
  return approved;
}
