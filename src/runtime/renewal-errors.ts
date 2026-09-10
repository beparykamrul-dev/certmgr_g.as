export type RenewalErrorCode = 'approval_not_usable' | 'adapter_not_configured' | 'issuance_failed' | 'deployment_failed' | 'health_verification_failed';
export class RenewalError extends Error {
  constructor(public readonly code: RenewalErrorCode, message: string, public readonly cause?: unknown) { super(message); this.name = 'RenewalError'; }
}
