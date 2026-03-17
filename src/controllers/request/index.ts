import {APPLICATION_JSON, APPLICATION_JSON_UTF8, CONTENT_TYPE, TEXT_CSV, TEXT_HTML, TEXT_PLAIN} from '@/constants';
import {DEFAULT_REQUEST_HEADERS, REQUEST_TIMEOUT_DURATION} from '@/config';
import {attachQueryParams} from '@/utils/api';
import {type RequestError, type RequestResult} from '@/controllers/request/types';

export type {RequestError, RequestResult} from '@/controllers/request/types';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface RequestParams {
  url: string
  headers?: HeadersInit
  method?: HttpMethod
  params?: Record<string, unknown> | unknown[] | FormData | File
  onError?: (error: RequestError) => void
}

export async function request<T>(r: RequestParams): Promise<RequestResult<T>> {
  const {
    url,
    headers = {},
    method = 'GET',
    params,
    onError,
  } = r;

  const isGETMethod = method === 'GET';
  const controller = new AbortController();
  const init: Omit<RequestInit, 'headers'> & {headers: Headers} = {
    signal: controller.signal,
    method,
    headers: new Headers({...DEFAULT_REQUEST_HEADERS, ...headers}),
  };
  const targetURL = isGETMethod ? attachQueryParams(url, params) : url;

  if (!isGETMethod && (params instanceof FormData || params instanceof File)) {
    init.body = params;
  } else if (params != null && !isGETMethod) {
    init.body = JSON.stringify(params);
    init.headers.set(CONTENT_TYPE, APPLICATION_JSON_UTF8);
  }

  const timeoutId = setTimeout((): void => { controller.abort(); }, REQUEST_TIMEOUT_DURATION);

  try {
    const response = await fetch(targetURL, init);
    const contentType = response.headers.get(CONTENT_TYPE) ?? '';
    if (!response.ok) {
      const result = await parseErrorBody(response, contentType);
      onError?.(result.error);
      return result;
    }
    const result = await parseSuccessBody<T>(response, contentType);
    if (!result.ok) onError?.(result.error);
    return result;
  } catch (error) {
    const requestError = mapFetchError(error);
    onError?.(requestError);
    return {ok: false, error: requestError};
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseSuccessBody<T>(response: Response, contentType: string): Promise<RequestResult<T>> {
  try {
    if (contentType.startsWith(APPLICATION_JSON)) {
      return {ok: true, data: await response.json() as T};
    }
    if (contentType.startsWith(TEXT_PLAIN)) {
      return {ok: true, data: await response.text() as unknown as T};
    }
    if (contentType.startsWith(TEXT_CSV)) {
      return {ok: true, data: await response.blob() as unknown as T};
    }
    if (contentType.startsWith(TEXT_HTML)) {
      const text = await response.text();
      return {ok: true, data: new DOMParser().parseFromString(text, 'text/html') as unknown as T};
    }
    if (contentType === '') {
      return {ok: true, data: undefined as unknown as T};
    }
    const error: RequestError = {type: 'unexpected_content_type', contentType};
    return {ok: false, error};
  } catch (e) {
    const error: RequestError = {type: 'parse', message: e instanceof Error ? e.message : String(e)};
    return {ok: false, error};
  }
}

async function parseErrorBody(response: Response, contentType: string): Promise<{ok: false; error: RequestError}> {
  return {
    ok: false,
    error: {type: 'http', status: response.status, statusText: response.statusText, body: await tryExtractErrorBody(response, contentType)},
  };
}

async function tryExtractErrorBody(response: Response, contentType: string): Promise<unknown> {
  try {
    if (contentType.startsWith(APPLICATION_JSON)) {
      return await response.json() as unknown;
    }
    if (contentType.startsWith(TEXT_HTML)) {
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const title = doc.querySelector('title')?.textContent?.trim();
      return title != null && title !== '' ? {title} : undefined;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function mapFetchError(error: unknown): RequestError {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return {type: 'timeout'};
  }
  if (error instanceof Error) {
    return {type: 'network', message: error.message};
  }
  return {type: 'network', message: String(error)};
}
