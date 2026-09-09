export type ApiUnavailable = { status: 'unavailable'; configured: false; feature: string; reason: string };
export function unavailable(feature: string, reason = 'No live collector/provider connector is configured'): ApiUnavailable { return { status: 'unavailable', configured: false, feature, reason }; }
