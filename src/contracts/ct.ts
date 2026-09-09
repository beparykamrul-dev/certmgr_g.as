export interface CtLog { id: string; operator?: string; url: string; state: 'enabled' | 'disabled' | 'unknown'; source: string; }
export interface CtCertificate { fingerprint: string; subject: string; issuer?: string; loggedAt: string; logId: string; source: string; }
