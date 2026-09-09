export interface AdapterStatus { configured: boolean; name: string; reason?: string; }
export interface CertificateRecord { domain: string; issuer: string; serialNumber: string; validFrom: string; validTo: string; sans: string[]; }
export interface CertificateAdapter { status(): Promise<AdapterStatus>; listCertificates(): Promise<CertificateRecord[]>; }
export interface ProviderAdapter { status(): Promise<AdapterStatus>; health(provider: string): Promise<{ health: number | null; latencyMs: number | null; source: string }>; }
