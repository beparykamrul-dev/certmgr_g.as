export type PrivilegedAction = 'issue_certificate' | 'renew_certificate' | 'reload_service' | 'provider_control';

export function evaluatePrivilegedAction(action: PrivilegedAction) {
  return { action, allowed: false, requiresApproval: true, reason: 'Explicit operator approval is required before privileged execution.' };
}
