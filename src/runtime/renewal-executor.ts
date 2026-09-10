import type { CertificateRecord } from './certificate-contract';
import type { AcmeAdapter, CertificateRecordLike } from '../contracts/acme';
import { buildRenewalPlan, type RenewalPlan } from './certificate-renewal-plan';

export type RenewalResult = {
  subject: string;
  action: 'renew' | 'hold';
  executed: boolean;
  approvalRequired: boolean;
  reason: string;
  certificate?: CertificateRecordLike;
};

export async function executeRenewalPlan(
  records: CertificateRecord[],
  adapter: AcmeAdapter | undefined,
  now = Date.now(),
): Promise<RenewalResult[]> {
  const plans: RenewalPlan[] = buildRenewalPlan(records, now);
  return Promise.all(plans.map(async plan => {
    if (plan.action !== 'renew') return { ...plan, executed: false };
    if (!adapter) return { ...plan, executed: false, reason: 'acme_adapter_not_configured' };
    return {
      ...plan,
      executed: false,
      reason: 'renewal_requires_approved_acme_execution',
    };
  }));
}
