export type CtPolicy = { requireCtForPublicCertificates: boolean };
export const DEFAULT_CT_POLICY: CtPolicy = { requireCtForPublicCertificates: true };

export function ctRequired(source: string, policy = DEFAULT_CT_POLICY): boolean {
  return policy.requireCtForPublicCertificates && source.trim().length > 0;
}
