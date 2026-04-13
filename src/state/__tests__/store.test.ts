import {useAppStore} from '@/state';

beforeEach(() => {
  sessionStorage.clear();
  useAppStore.getState().logout();
});

describe('useAppStore — initial state', () => {
  it('has isLogged: false initially', () => {
    expect(useAppStore.getState().isLogged).toBe(false);
  });

  it('has empty username and role initially', () => {
    const {username, role} = useAppStore.getState();
    expect(username).toBe('');
    expect(role).toBe('');
  });
});

describe('useAppStore — setLoggedUser', () => {
  it('sets isLogged, username, and role', () => {
    useAppStore.getState().setLoggedUser('alice', 'admin');

    const {isLogged, username, role} = useAppStore.getState();
    expect(isLogged).toBe(true);
    expect(username).toBe('alice');
    expect(role).toBe('admin');
  });
});

describe('useAppStore — logout', () => {
  it('resets auth state to initial values', () => {
    useAppStore.getState().setLoggedUser('alice', 'admin');
    useAppStore.getState().logout();
    const {isLogged, username, role} = useAppStore.getState();
    expect(isLogged).toBe(false);
    expect(username).toBe('');
    expect(role).toBe('');
  });
});

describe('useAppStore — persist', () => {
  it('serializes auth state to sessionStorage after setLoggedUser', () => {
    useAppStore.getState().setLoggedUser('bob', 'user');
    const stored = sessionStorage.getItem('app');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.isLogged).toBe(true);
    expect(parsed.state.username).toBe('bob');
    expect(parsed.state.role).toBe('user');
  });

  it('does not persist action methods to sessionStorage', () => {
    useAppStore.getState().setLoggedUser('bob', 'user');
    const stored = sessionStorage.getItem('app');
    const parsed = JSON.parse(stored!);
    expect(typeof parsed.state.setLoggedUser).toBe('undefined');
    expect(typeof parsed.state.logout).toBe('undefined');
  });
});
