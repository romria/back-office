import {create} from 'zustand';
import {devtools, persist, createJSONStorage} from 'zustand/middleware';
import {type AuthState, type AuthSlice, createAuthSlice} from '@/state/slices/auth';
import {type UsersSlice, createUsersSlice} from '@/state/slices/users';
import {type NotificationsSlice, createNotificationsSlice} from '@/state/slices/notifications';

export type AppStore = AuthSlice & UsersSlice & NotificationsSlice;

// Wraps sessionStorage so that any access error (private browsing, quota,
// security restrictions) is swallowed rather than crashing the app.
const safeSessionStorage = {
  getItem: (name: string): string | null => {
    try { return sessionStorage.getItem(name); } catch { return null; }
  },
  setItem: (name: string, value: string): void => {
    try { sessionStorage.setItem(name, value); } catch { /* storage unavailable */ }
  },
  removeItem: (name: string): void => {
    try { sessionStorage.removeItem(name); } catch { /* storage unavailable */ }
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        ...createAuthSlice(set),
        ...createUsersSlice(set),
        ...createNotificationsSlice(set),
      }),
      {
        name: 'app',
        version: 0,
        storage: createJSONStorage(() => safeSessionStorage),
        partialize: ({isLogged, username, role}: AppStore): AuthState => ({
          isLogged,
          username,
          role,
        }),
      },
    ),
    {name: 'App'},
  ),
);
