export type TrafficTelemetryStatus = { configured: boolean; source: string };
export function trafficTelemetryStatus(env: NodeJS.ProcessEnv = process.env): TrafficTelemetryStatus { return { configured: Boolean(env.TRAFFIC_COLLECTOR_URL?.trim()), source: env.TRAFFIC_COLLECTOR_URL ? 'traffic-collector-config' : 'not-configured' }; }
