// import type {LoginRequestParams, RefreshTokenRequestParams, ForgotPasswordRequestParams} from './auth';
import type {CreateUserRequestParams, UpdateUserRequestParams, SetUserPasswordRequestParams} from './user';

/* Table requests */
export interface Query extends Record<string, unknown> {
  limit?: number
  skip?: number
  sortBy?: string;
  order?: 'asc' | 'desc';
  // filter?: Record<string, undefined | null | string | string[] | number | boolean | {from: Date | undefined, to: Date | undefined}>
}

// export interface QueryParsed extends Omit<Query, 'filter'> {
//   filter?: Record<string, string | string[] | number | boolean | {from?: string, to?: string}>
// }

export type RequestObjectData = (
  // LoginRequestParams | RefreshTokenRequestParams | ForgotPasswordRequestParams
  | CreateUserRequestParams | UpdateUserRequestParams | SetUserPasswordRequestParams
);

export type RequestData = RequestObjectData | FormData;
