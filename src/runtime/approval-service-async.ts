import crypto from 'node:crypto';
import type { ApprovalRequest } from './approval-contract';
import type { AsyncApprovalStore } from './approval-store';
import { isApprovalUsable } from './approval-expiry';
export async function requestApprovalAsync(store: AsyncApprovalStore, action: string, target: string, requestedBy: string, ttlMs = 15 * 60 * 1000): Promise<ApprovalRequest> { const now = Date.now(); const request: ApprovalRequest = { id: crypto.randomUUID(), action, target, requestedBy, state: 'pending', createdAt: new Date(now).toISOString(), expiresAt: new Date(now + ttlMs).toISOString() }; await store.put(request); return request; }
export async function approveRequestAsync(store: AsyncApprovalStore, id: string): Promise<ApprovalRequest | undefined> { const request = await store.get(id); if (!request || request.state !== 'pending') return undefined; if (request.expiresAt && Date.parse(request.expiresAt) <= Date.now()) { const expired = { ...request, state: 'expired' as const }; await store.put(expired); return expired; } const approved = { ...request, state: 'approved' as const }; await store.put(approved); return approved; }
export async function canExecuteApproval(store: AsyncApprovalStore, id: string): Promise<boolean> { return isApprovalUsable(await store.get(id)); }
