export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  username: string;
  email: string;
  ip: string;
  role: string;
  birthDate: string;
  image: string;
  age: number;
  gender: string;
  phone: string;
  macAddress: string;
};

export interface UserParsed extends Omit<User, 'id' | 'birthDate'> {
  id: string
  birthDate: Date | undefined
}
export interface UserFormatted extends Omit<UserParsed, 'birthDate'> {
  birthDate: string
}

export interface UserExtended extends User {
  lastLoginDate: string
  creationDate: string
}
export interface UserExtendedParsed extends Omit<UserExtended, 'id' | 'birthDate' | 'lastLoginDate' | 'creationDate'> {
  id: string
  birthDate: Date | undefined
  lastLoginDate: Date | undefined
  creationDate: Date | undefined
}
export interface UserExtendedFormatted extends Omit<UserExtendedParsed, 'birthDate' | 'lastLoginDate' | 'creationDate'> {
  birthDate: string
  lastLoginDate: string
  creationDate: string
}

export type UserEditorState = Pick<UserExtendedParsed, 'email' | 'firstName' | 'lastName' | 'phone' | 'birthDate'>;
export interface CreateUserRequestParams {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  birthDate?: string
}
export interface UpdateUserRequestParams {
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  birthDate?: string
}
export interface SetUserPasswordRequestParams {
  password: string
}

// export const USER_STATUS_VALUES = [
//   {label: 'Enabled', value: 'true'},
//   {label: 'Disabled', value: 'false'},
// ];
