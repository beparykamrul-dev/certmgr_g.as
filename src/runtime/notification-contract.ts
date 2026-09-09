export type NotificationChannel = 'email' | 'webhook' | 'chat';
export type Notification = { channel: NotificationChannel; subject: string; message: string; severity: 'info' | 'warning' | 'critical'; createdAt: string };
