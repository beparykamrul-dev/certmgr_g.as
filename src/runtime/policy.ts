export type PolicyDecision = { allowed: boolean; approvalRequired: boolean; reason: string };

export function evaluatePrivilegedAction(): PolicyDecision {
  return { allowed: false, approvalRequired: true, reason: 'Privileged actions require explicit operator approval' };
}
