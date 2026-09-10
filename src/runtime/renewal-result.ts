export type RenewalResult = { subject: string; success: boolean; approvalId: string; certificateExpiresAt?: string; serviceHealthy?: boolean; reason: string; };
export function failedRenewal(subject: string, approvalId: string, reason: string): RenewalResult { return { subject, success: false, approvalId, reason }; }
