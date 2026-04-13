import {request} from '@/controllers/request';

type MockResponseInit = {
  status?: number;
  statusText?: string;
  contentType?: string | null;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
  blob?: () => Promise<Blob>;
};

function makeMockResponse({
  status = 200,
  statusText = 'OK',
  contentType = 'application/json',
  json = () => Promise.resolve({}),
  text = () => Promise.resolve(''),
  blob = () => Promise.resolve(new Blob()),
}: MockResponseInit = {}): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? (contentType ?? null) : null),
    },
    json,
    text,
    blob,
  } as unknown as Response;
}

beforeEach(() => {
  globalThis.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('request — success paths', () => {
  it('parses JSON response', async () => {
    const data = {id: 1, name: 'Alice'};
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: 'application/json', json: () => Promise.resolve(data)}),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result).toEqual({ok: true, data});
  });

  it('parses text/plain response', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: 'text/plain', text: () => Promise.resolve('hello')}),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result).toEqual({ok: true, data: 'hello'});
  });

  it('parses text/csv response as Blob', async () => {
    const blob = new Blob(['a,b,c'], {type: 'text/csv'});
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: 'text/csv', blob: () => Promise.resolve(blob)}),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeInstanceOf(Blob);
  });

  it('parses text/html response as Document', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({
        contentType: 'text/html',
        text: () => Promise.resolve('<html><head><title>Test</title></head><body></body></html>'),
      }),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data).toBeInstanceOf(Document);
  });

  it('returns undefined data for 204 (empty content-type)', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({status: 204, statusText: 'No Content', contentType: null}),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result).toEqual({ok: true, data: undefined});
  });

  it('returns unexpected_content_type error for unknown content type', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: 'application/octet-stream'}),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result).toEqual({ok: false, error: {type: 'unexpected_content_type', contentType: 'application/octet-stream'}});
  });
});

describe('request — parse error', () => {
  it('returns parse error for malformed JSON', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({
        contentType: 'application/json',
        json: () => Promise.reject(new SyntaxError('Unexpected token')),
      }),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.type).toBe('parse');
      if (result.error.type === 'parse') expect(result.error.message).toBe('Unexpected token');
    }
  });
});

describe('request — HTTP errors', () => {
  it('returns http error with JSON body for non-2xx', async () => {
    const errorBody = {message: 'Not found'};
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({
        status: 404,
        statusText: 'Not Found',
        contentType: 'application/json',
        json: () => Promise.resolve(errorBody),
      }),
    );
    const onError = jest.fn();
    const result = await request({url: 'http://localhost/api', onError});
    expect(result).toEqual({
      ok: false,
      error: {type: 'http', status: 404, statusText: 'Not Found', body: errorBody},
    });
    expect(onError).toHaveBeenCalledWith({type: 'http', status: 404, statusText: 'Not Found', body: errorBody});
  });

  it('returns http error with title extracted from HTML body', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({
        status: 500,
        statusText: 'Internal Server Error',
        contentType: 'text/html',
        text: () => Promise.resolve('<html><head><title>Server Error</title></head></html>'),
      }),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result.ok).toBe(false);
    if (!result.ok && result.error.type === 'http') {
      expect(result.error.body).toEqual({title: 'Server Error'});
    }
  });

  it('returns http error with undefined body for unknown content type', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({
        status: 503,
        statusText: 'Service Unavailable',
        contentType: 'application/xml',
      }),
    );
    const result = await request({url: 'http://localhost/api'});
    expect(result.ok).toBe(false);
    if (!result.ok && result.error.type === 'http') {
      expect(result.error.body).toBeUndefined();
    }
  });
});

describe('request — fetch-level errors', () => {
  it('returns network error for fetch rejection', async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValue(new Error('Network failure'));
    const onError = jest.fn();
    const result = await request({url: 'http://localhost/api', onError});
    expect(result).toEqual({ok: false, error: {type: 'network', message: 'Network failure'}});
    expect(onError).toHaveBeenCalledWith({type: 'network', message: 'Network failure'});
  });

  it('returns timeout error for AbortError', async () => {
    jest.useFakeTimers();
    (globalThis.fetch as jest.Mock).mockImplementation((_url: string, init: RequestInit) =>
      new Promise((_resolve, reject) => {
        init.signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted.', 'AbortError'));
        });
      }),
    );

    const onError = jest.fn();
    const resultPromise = request({url: 'http://localhost/api', onError});
    jest.advanceTimersByTime(15001);
    const result = await resultPromise;

    expect(result).toEqual({ok: false, error: {type: 'timeout'}});
    expect(onError).toHaveBeenCalledWith({type: 'timeout'});
    jest.useRealTimers();
  });
});

describe('request — request building', () => {
  it('GET appends query params to URL', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: null}),
    );
    await request({url: 'http://localhost/api', method: 'GET', params: {q: 'hello', page: 1}});
    const calledUrl = (globalThis.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('q=hello');
    expect(calledUrl).toContain('page=1');
  });

  it('POST sends JSON body with Content-Type header', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: null}),
    );
    const body = {username: 'alice'};
    await request({url: 'http://localhost/api', method: 'POST', params: body});
    const init = (globalThis.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
    expect(init.body).toBe(JSON.stringify(body));
    expect((init.headers as Headers).get('Content-Type')).toBe('application/json; charset=UTF-8');
  });

  it('POST with FormData skips JSON stringify and Content-Type header', async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValue(
      makeMockResponse({contentType: null}),
    );
    const formData = new FormData();
    formData.append('field', 'value');
    await request({url: 'http://localhost/api', method: 'POST', params: formData});
    const init = (globalThis.fetch as jest.Mock).mock.calls[0][1] as RequestInit;
    expect(init.body).toBe(formData);
    expect((init.headers as Headers).get('Content-Type')).toBeNull();
  });
});
