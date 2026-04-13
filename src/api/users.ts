import {API_BASE_URL} from '@/config';
import {type RequestResult} from '@/controllers/request';
import type {User} from '@/types/user';
import {requestWithNotify} from '@/utils/request';

export interface GetUsersParams extends Record<string, unknown> {
  sortBy?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  skip?: number;
}

export type UsersResponse = {users: User[]; total: number; skip: number; limit: number};

export const getUsers = (params?: GetUsersParams): Promise<RequestResult<UsersResponse>> =>
  requestWithNotify<UsersResponse>({
    url: `${API_BASE_URL}/users`,
    params,
  });

export const getUser = (id: string): Promise<RequestResult<User>> =>
  requestWithNotify<User>({
    url: `${API_BASE_URL}/users/${id}`,
    method: 'GET',
  });
