export type ServiceAction = 'reload' | 'restart' | 'stop' | 'start';
export interface ServiceCommand { id: string; service: string; action: ServiceAction; requestedBy: string; approvalId: string; }
export interface ServiceResult { commandId: string; accepted: boolean; executed: boolean; reason: string; }
