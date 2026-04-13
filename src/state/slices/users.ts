import type {User} from '@/types/user';

export interface UsersState {
  isLoaded: boolean;
  users: User[];
}

interface UsersActions {
  setUsersList: (users: User[]) => void;
}

export type UsersSlice = UsersState & UsersActions;

type Set = (partial: Partial<UsersSlice>, replace?: false, name?: string) => void;

const initialState: UsersState = {
  isLoaded: false,
  users: [],
};

export const createUsersSlice = (set: Set): UsersSlice => ({
  ...initialState,

  setUsersList: (users: User[]): void => {
    set({isLoaded: true, users}, false, 'users/setUsersList');
  },
});
