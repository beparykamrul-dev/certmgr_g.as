export type TelemetryState = {
  configured: boolean;
  live: boolean;
  observedAt?: string;
  reason?: string;
};

export const NOT_CONFIGURED: TelemetryState = {
  configured: false,
  live: false,
  reason: 'No live telemetry source configured',
};

export function liveTelemetry(observedAt = new Date().toISOString()): TelemetryState {
  return { configured: true, live: true, observedAt };
}

export function unavailableTelemetry(reason: string): TelemetryState {
  return { configured: false, live: false, reason };
}
