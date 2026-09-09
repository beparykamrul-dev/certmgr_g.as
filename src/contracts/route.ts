export interface RouteCandidate { provider: string; nextHop?: string; latencyMs?: number; lossPct?: number; source: string; observedAt: string; }
export interface RoutingRecommendation { id: string; candidates: RouteCandidate[]; confidence?: number; reason: string; approvalRequired: boolean; }
