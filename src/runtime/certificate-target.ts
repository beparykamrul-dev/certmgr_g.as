export type CertificateTarget = { subject: string; source: string };

export function normalizeCertificateTarget(subject: string, source = 'unknown'): CertificateTarget {
  const normalized = subject.trim().toLowerCase();
  if (!normalized || normalized.length > 253) throw new Error('certificate_subject_invalid');
  return { subject: normalized, source: source.trim() || 'unknown' };
}
