export type RenewalTarget = { subject: string; service?: string; profile?: string };
export function normalizeRenewalTarget(input: RenewalTarget): RenewalTarget {
  const subject = input.subject.trim();
  if (!subject) throw new Error('renewal_subject_required');
  return { subject, ...(input.service?.trim() ? { service: input.service.trim() } : {}), ...(input.profile?.trim() ? { profile: input.profile.trim() } : {}) };
}
