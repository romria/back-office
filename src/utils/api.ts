import { RequestError } from "@/controllers/request/types";

export const attachQueryParams = (url: string, params: unknown): string => {
  if (
    params == null
    || typeof params !== 'object'
    || Array.isArray(params)
    || params instanceof FormData
    || params instanceof File
  ) return url;

  const parsed = new URL(url, window.location.href);

  Object.entries(params)
    .filter(([, v]) => v != null)
    .forEach(([k, v]) => { parsed.searchParams.append(k, String(v)); });

  return parsed.toString();
};

export const formatRequestError = (error: RequestError): string => {
  switch (error.type) {
    case 'network': return `Network error: ${error.message}`;
    case 'timeout': return 'Request timed out';
    case 'http':    return `HTTP ${error.status}: ${error.statusText}`;
    case 'parse':   return `Failed to parse response: ${error.message}`;
    case 'unexpected_content_type': return `Unexpected response type: ${error.contentType}`;
    default: return 'Unexpected request error';
  }
};
