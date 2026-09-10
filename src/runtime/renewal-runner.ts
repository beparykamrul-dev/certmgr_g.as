import type { CertificateRecord } from './certificate-contract';
import { buildRenewalPlan, type RenewalPlan } from './certificate-renewal-plan';

export type RenewalRun = { planned: RenewalPlan[]; approvalRequired: number };

export function planCertificateRenewals(certificates: CertificateRecord[], now = Date.now()): RenewalRun {
  const planned = buildRenewalPlan(certificates, now);
  return { planned, approvalRequired: planned.filter(item => item.approvalRequired).length };
}
