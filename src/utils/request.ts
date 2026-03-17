import {request, type RequestParams, type RequestResult} from '@/controllers/request';
import {useAppStore} from '@/state/store';
import { formatRequestError } from '@/utils/api';

export const requestWithNotify = <T>(params: RequestParams): Promise<RequestResult<T>> =>
  request<T>({
    ...params,
    onError: (error) => {
      params.onError?.(error);
      useAppStore.getState().onShowNotification('error', formatRequestError(error));
    },
  });
