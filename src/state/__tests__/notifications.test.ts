import {useAppStore} from '@/state/store';

const {onShowNotification, onDismissNotification} = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState({notifications: []});
});

describe('onShowNotification', () => {
  it('adds a notification with the given type and message', () => {
    onShowNotification('info', 'Hello');
    const {notifications} = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('info');
    expect(notifications[0].message).toBe('Hello');
    expect(notifications[0].id).toBeTruthy();
  });

  it('uses the default duration (5000) when not specified', () => {
    onShowNotification('success', 'Done');
    const {notifications} = useAppStore.getState();
    expect(notifications[0].duration).toBe(5000);
  });

  it('accepts a custom duration', () => {
    onShowNotification('warning', 'Careful', 0);
    const {notifications} = useAppStore.getState();
    expect(notifications[0].duration).toBe(0);
  });

  it('assigns a unique id to each notification', () => {
    onShowNotification('info', 'First');
    onShowNotification('info', 'Second');
    const {notifications} = useAppStore.getState();
    const ids = notifications.map((n) => n.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('caps notifications at 5 (MAX_NOTIFICATIONS)', () => {
    for (let i = 0; i < 6; i++) {
      onShowNotification('info', `Notification ${i}`);
    }
    expect(useAppStore.getState().notifications).toHaveLength(5);
  });

  it('drops the oldest notification when cap is exceeded', () => {
    for (let i = 0; i < 5; i++) {
      onShowNotification('info', `Notification ${i}`);
    }
    const firstId = useAppStore.getState().notifications[0].id;

    onShowNotification('error', 'Overflow');

    const {notifications} = useAppStore.getState();
    expect(notifications.find((n) => n.id === firstId)).toBeUndefined();
    expect(notifications[notifications.length - 1].message).toBe('Overflow');
  });

  it('supports all notification types', () => {
    const types = ['info', 'success', 'warning', 'error'] as const;
    types.forEach((type) => {
      useAppStore.setState({notifications: []});
      onShowNotification(type, 'msg');
      expect(useAppStore.getState().notifications[0].type).toBe(type);
    });
  });
});

describe('onDismissNotification', () => {
  it('removes the notification with the given id', () => {
    onShowNotification('info', 'One');
    onShowNotification('info', 'Two');
    const {notifications} = useAppStore.getState();
    const firstId = notifications[0].id;

    onDismissNotification(firstId);

    const remaining = useAppStore.getState().notifications;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].message).toBe('Two');
  });

  it('is a no-op for an unknown id', () => {
    onShowNotification('info', 'Keep me');
    onDismissNotification('non-existent-id');
    expect(useAppStore.getState().notifications).toHaveLength(1);
  });

  it('leaves the list empty when the only notification is dismissed', () => {
    onShowNotification('error', 'Dismiss me');
    const {notifications} = useAppStore.getState();
    onDismissNotification(notifications[0].id);
    expect(useAppStore.getState().notifications).toHaveLength(0);
  });
});
