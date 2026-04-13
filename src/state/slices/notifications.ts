import type {Notification, NotificationType} from '@/types/notification';
import { getRandomId } from '@/utils/string';

const MAX_NOTIFICATIONS = 5;
const DEFAULT_DURATION = 5000;

export interface NotificationsState {
  notifications: Notification[];
}

interface NotificationsActions {
  onShowNotification: (type: NotificationType, message: string, duration?: number) => void;
  onDismissNotification: (id: string) => void;
}

export type NotificationsSlice = NotificationsState & NotificationsActions;

type Set = (
  partial: Partial<NotificationsSlice> | ((s: NotificationsSlice) => Partial<NotificationsSlice>),
  replace?: false,
  name?: string,
) => void;

const initialState: NotificationsState = {
  notifications: [],
};

export const createNotificationsSlice = (set: Set): NotificationsSlice => ({
  ...initialState,

  onShowNotification: (type: NotificationType, message: string, duration = DEFAULT_DURATION): void => {
    set(
      (s) => ({
        notifications: [
          ...s.notifications.slice(-(MAX_NOTIFICATIONS - 1)),
          {id: getRandomId(), type, message, duration},
        ],
      }),
      false,
      'notifications/add',
    );
  },

  onDismissNotification: (id: string): void => {
    set(
      (s) => ({notifications: s.notifications.filter((n) => n.id !== id)}),
      false,
      'notifications/remove',
    );
  },
});
