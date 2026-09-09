export type TrafficMapPoint = { id: string; name: string; city?: string; country?: string; lng: number; lat: number; latencyMs?: number; throughputGbps?: number; health?: number; observedAt: string };
export type TrafficMapData = { points: TrafficMapPoint[]; observedAt: string };
