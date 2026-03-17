import {useEffect, type ReactElement} from 'react';
import {useAppStore} from '@/state';
import {useShallow} from 'zustand/react/shallow';
import type {Notification} from '@/types/notification';

import classes from './notifications.module.scss';

const ICONS: Record<Notification['type'], string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

interface ItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const NotificationItem = ({notification, onDismiss}: ItemProps): ReactElement => {
  const {id, type, message, duration} = notification;

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(() => { onDismiss(id); }, duration);
    return (): void => { clearTimeout(timer); };
  }, [id, duration, onDismiss]);

  return (
    <div className={`${classes.item} ${classes[type]}`}>
      <span className={classes.icon}>{ICONS[type]}</span>
      <p className={classes.message}>{message}</p>
      <button
        type="button"
        aria-label="Dismiss notification"
        className={classes.close}
        onClick={() => { onDismiss(id); }}
      >✕</button>
    </div>
  );
};

const Notifications = (): ReactElement => {
  const {notifications, onDismissNotification} = useAppStore(
    useShallow(({notifications, onDismissNotification}) => ({notifications, onDismissNotification})),
  );

  return (
    <div className={classes.container}>
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} onDismiss={onDismissNotification} />
      ))}
    </div>
  );
};

export default Notifications;
