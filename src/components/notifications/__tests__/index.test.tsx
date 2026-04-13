import {act, render, screen, fireEvent} from '@testing-library/react';
import Notifications from '@/components/notifications';
import {useAppStore} from '@/state/store';
import type {Notification} from '@/types/notification';

const addNotification = (overrides: Partial<Notification> = {}): void => {
  const base: Notification = {
    id: `test-${Math.random()}`,
    type: 'info',
    message: 'Test notification',
    duration: 5000,
    ...overrides,
  };
  useAppStore.setState((s) => ({notifications: [...s.notifications, base]}));
};

beforeEach(() => {
  jest.useFakeTimers();
  useAppStore.setState({notifications: []});
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Notifications — rendering', () => {
  it('renders nothing when there are no notifications', () => {
    render(<Notifications />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders all notifications from the store', () => {
    addNotification({message: 'First'});
    addNotification({message: 'Second'});
    render(<Notifications />);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('shows the correct icon for each notification type', () => {
    const types = [
      {type: 'info', icon: 'ℹ'},
      {type: 'success', icon: '✓'},
      {type: 'warning', icon: '⚠'},
      {type: 'error', icon: '✕'},
    ] as const;

    types.forEach(({type, icon}) => {
      useAppStore.setState({notifications: []});
      addNotification({type, message: `${type} msg`});
      const {unmount} = render(<Notifications />);
      // The dismiss button also contains ✕ so query by the message text's sibling
      const msg = screen.getByText(`${type} msg`);
      const item = msg.closest('div');
      expect(item?.textContent).toContain(icon);
      unmount();
    });
  });
});

describe('Notifications — auto-dismiss', () => {
  it('removes a notification after its duration elapses', () => {
    addNotification({id: 'auto', message: 'Auto dismiss', duration: 3000});
    render(<Notifications />);
    expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

    act(() => { jest.advanceTimersByTime(3001); });

    expect(useAppStore.getState().notifications.find((n) => n.id === 'auto')).toBeUndefined();
  });

  it('does not remove a notification when duration is 0', () => {
    addNotification({id: 'persistent', message: 'Persistent', duration: 0});
    render(<Notifications />);

    act(() => { jest.advanceTimersByTime(60_000); });

    expect(useAppStore.getState().notifications.find((n) => n.id === 'persistent')).toBeDefined();
  });

  it('clears the timer when the component unmounts', () => {
    addNotification({id: 'unmount', message: 'Unmount test', duration: 5000});
    const {unmount} = render(<Notifications />);
    unmount();

    // Timer fires after unmount — should not throw or cause state updates
    expect(() => { act(() => { jest.advanceTimersByTime(6000); }); }).not.toThrow();
  });
});

describe('Notifications — manual dismiss', () => {
  it('removes the notification from the store when close button is clicked', () => {
    addNotification({id: 'manual', message: 'Manual dismiss'});
    render(<Notifications />);

    fireEvent.click(screen.getByRole('button', {name: /dismiss notification/i}));

    expect(useAppStore.getState().notifications.find((n) => n.id === 'manual')).toBeUndefined();
  });

  it('only removes the clicked notification when multiple are present', () => {
    addNotification({id: 'a', message: 'Keep me', duration: 0});
    addNotification({id: 'b', message: 'Dismiss me', duration: 0});
    render(<Notifications />);

    const buttons = screen.getAllByRole('button', {name: /dismiss notification/i});
    fireEvent.click(buttons[1]);

    const remaining = useAppStore.getState().notifications;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('a');
  });
});
