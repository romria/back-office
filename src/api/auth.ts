import {API_BASE_URL} from '@/config';
import {type RequestResult} from '@/controllers/request';
import {type EmptyObject} from '@/types';
import {requestWithNotify} from '@/utils/request';

export const login = (params?: {username: string; password: string}): Promise<RequestResult<EmptyObject>> =>
  requestWithNotify<EmptyObject>({
    url: `${API_BASE_URL}/login`,
    method: 'POST',
    params,
  });
