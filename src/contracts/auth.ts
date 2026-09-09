export const ROLES = ['viewer', 'operator', 'admin'] as const;
export type Role = typeof ROLES[number];

export interface Principal { id: string; role: Role; authenticated: boolean; }
export interface AuthorizationResult { allowed: boolean; reason: string; requiredRole?: Role; }
