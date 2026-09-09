import crypto from 'node:crypto';
import type { ApprovalRequest } from './approval-contract';
import type { ApprovalStore, AsyncApprovalStore } from './approval-store';

export function requestApproval(store: ApprovalStore, action: string, target: string, requestedBy: string, ttlMs = 15 * 60 * 1000): ApprovalRequest {
  const now = Date.now();
  const request: ApprovalRequest = { id: crypto.randomUUID(), action, target, requestedBy, state: 'pending', createdAt: new Date(now).toISOString(), expiresAt: new Date(now + ttlMs).toISOString() };
  store.put(request);
  return request;
}

export async function requestApprovalAsync(store: AsyncApprovalStore, action: string, target: string, requestedBy: string, ttlMs = 15 * 60 * 1000): Promise<ApprovalRequest> {
  const request = requestApproval({ put: value => { void value; }, get: () => undefined, list: () => [] }, action, target, requestedBy, ttlMs);
  await store.put(request);
  return request;
}

export function approveRequest(store: ApprovalStore, id: string): ApprovalRequest | undefined {
  const request = store.get(id);
  if (!request || request.state !== 'pending') return undefined;
  if (request.expiresAt && Date.parse(request.expiresAt) <= Date.now()) {
    const expired = { ...request, state: 'expired' as const };
    store.put(expired);
    return expired;
  }
  const approved = { ...request, state: 'approved' as const };
  store.put(approved);
  return approved;
}

export async function approveRequestAsync(store: AsyncApprovalStore, id: string): Promise<ApprovalRequest | undefined> {
  const request = await store.get(id);
  if (!request || request.state !== 'pending') return undefined;
  if (request.expiresAt && Date.parse(request.expiresAt) <= Date.now()) {
    const expired = { ...request, state: 'expired' as const };
    await store.put(expired);
    return expired;
  }
  const approved = { ...request, state: 'approved' as const };
  await store.put(approved);
  return approved;
}
