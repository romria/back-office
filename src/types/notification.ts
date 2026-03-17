export type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number; // ms — 0 disables auto-close
}
