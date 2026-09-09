import type { ApprovalRequest } from './approval-contract';

export type ApprovalStore = {
  put(request: ApprovalRequest): void;
  get(id: string): ApprovalRequest | undefined;
  list(): ApprovalRequest[];
};

export type AsyncApprovalStore = {
  put(request: ApprovalRequest): Promise<void>;
  get(id: string): Promise<ApprovalRequest | undefined>;
  list(): Promise<ApprovalRequest[]>;
};

export function createMemoryApprovalStore(): ApprovalStore {
  const records = new Map<string, ApprovalRequest>();
  return {
    put: request => records.set(request.id, request),
    get: id => records.get(id),
    list: () => [...records.values()],
  };
}
