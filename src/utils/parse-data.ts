import type {
  User, UserParsed, UserFormatted,
  UserExtended, UserExtendedParsed, UserExtendedFormatted,
} from '../types/user';
import {parseStringDate, format, DateFormat} from './date';

export const parseUser = (data: User): UserParsed => ({
  ...data,
  id: `${data.id}`,
  birthDate: parseStringDate(data.birthDate),
  // lastLoginDate: parseStringDate(data.lastLoginDate),
  // creationDate: parseStringDate(data.creationDate),
});

export const formatUser = (data: UserParsed): UserFormatted => ({
  ...data,
  birthDate: format(data.birthDate, DateFormat.Full),
  // lastLoginDate: format(data.lastLoginDate, DateFormat.Full),
  // creationDate: format(data.creationDate, DateFormat.Full),
});

export const parseAndFormatUser = (data: User): UserFormatted => formatUser(parseUser(data));

export const parseUserExtended = (data: UserExtended): UserExtendedParsed => ({
  ...data,
  id: `${data.id}`,
  birthDate: parseStringDate(data.birthDate),
  lastLoginDate: parseStringDate(data.lastLoginDate),
  creationDate: parseStringDate(data.creationDate),
});

export const formatUserExtended = (data: UserExtendedParsed): UserExtendedFormatted => ({
  ...data,
  birthDate: format(data.birthDate, DateFormat.Full),
  lastLoginDate: format(data.lastLoginDate, DateFormat.Full),
  creationDate: format(data.creationDate, DateFormat.Full),
});

export const parseAndFormatUserExtended = (data: UserExtended): UserExtendedFormatted => formatUserExtended(parseUserExtended(data));
