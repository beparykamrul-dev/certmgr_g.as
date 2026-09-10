import type { CertificateRecord } from './certificate-contract';
import { buildRenewalPlan, type RenewalPlan } from './certificate-renewal-plan';

export function dueRenewals(records: CertificateRecord[], now = Date.now()): RenewalPlan[] {
  return buildRenewalPlan(records, now).filter(plan => plan.action === 'renew');
}
