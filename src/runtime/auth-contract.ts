export type Role = 'super_admin' | 'admin' | 'operator' | 'engineer' | 'viewer';
export type Principal = { id: string; role: Role; authenticated: boolean };
export function canOperate(p: Principal): boolean { return p.authenticated && ['super_admin','admin','operator','engineer'].includes(p.role); }
