export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  result: 'success' | 'denied' | 'failed' | 'approval_required';
  requestId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}
