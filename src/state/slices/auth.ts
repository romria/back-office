export interface AuthState {
  isLogged: boolean;
  username: string;
  role: string;
}

interface AuthActions {
  setLoggedUser: (username: string, role: string) => void;
  logout: () => void;
}

export type AuthSlice = AuthState & AuthActions;

type Set = (partial: Partial<AuthSlice>, replace?: false, name?: string) => void;

const initialState: AuthState = {
  isLogged: false,
  username: '',
  role: '',
};

export const createAuthSlice = (set: Set): AuthSlice => ({
  ...initialState,

  setLoggedUser: (username: string, role: string): void => {
    set({isLogged: true, username, role}, false, 'auth/setLoggedUser');
  },

  logout: (): void => {
    set(initialState, false, 'auth/logout');
  },
});
