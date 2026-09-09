export type NotificationChannel = 'alertmanager' | 'webhook' | 'email';
export interface Notification { id: string; channel: NotificationChannel; severity: 'info' | 'warning' | 'critical'; title: string; message: string; createdAt: string; source: string; }
