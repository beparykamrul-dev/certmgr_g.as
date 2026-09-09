export interface ApiError { code: string; message: string; requestId?: string; details?: unknown; }
export interface ApiEnvelope<T> { ok: boolean; data?: T; error?: ApiError; requestId?: string; }
