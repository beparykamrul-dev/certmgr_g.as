export type AnomalyStatus = 'spike' | 'drop' | 'normal';
export type AnomalyPoint = { provider: string; time: string; deviationPct: number; baselineGbps: number; currentGbps: number; status: AnomalyStatus };
export type AnomalyGrid = { providers: string[]; timeSlots: string[]; data: AnomalyPoint[]; lastUpdated: string };
