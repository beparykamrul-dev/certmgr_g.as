export type TelemetryState = { configured: boolean; live: boolean; observedAt?: string; reason?: string };
export const NOT_CONFIGURED: TelemetryState = { configured: false, live: false, reason: 'No live telemetry source configured' };
