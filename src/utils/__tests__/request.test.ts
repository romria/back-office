import {requestWithNotify} from '@/utils/request';
import {useAppStore} from '@/state/store';
import {request} from '@/controllers/request';
import type {RequestError} from '@/controllers/request';

jest.mock('@/controllers/request', () => ({
  request: jest.fn(),
}));

const mockedRequest = request as jest.MockedFunction<typeof request>;

const triggerError = async (error: RequestError): Promise<void> => {
  mockedRequest.mockImplementation(({onError}) => {
    onError?.(error);
    return Promise.resolve({ok: false, error});
  });
  await requestWithNotify({url: '/test'});
};

beforeEach(() => {
  useAppStore.setState({notifications: []});
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('requestWithNotify — notifications on error', () => {
  it('adds a notification for network errors', async () => {
    await triggerError({type: 'network', message: 'Failed to fetch'});
    const {notifications} = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].message).toBe('Network error: Failed to fetch');
  });

  it('adds a notification for timeout errors', async () => {
    await triggerError({type: 'timeout'});
    const {notifications} = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Request timed out');
  });

  it('adds a notification for HTTP errors', async () => {
    await triggerError({type: 'http', status: 404, statusText: 'Not Found', body: undefined});
    const {notifications} = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('HTTP 404: Not Found');
  });

  it('adds a notification for parse errors', async () => {
    await triggerError({type: 'parse', message: 'Unexpected token'});
    const {notifications} = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Failed to parse response: Unexpected token');
  });

  it('adds a notification for unexpected_content_type errors', async () => {
    await triggerError({type: 'unexpected_content_type', contentType: 'application/xml'});
    const {notifications} = useAppStore.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].message).toBe('Unexpected response type: application/xml');
  });

  it('does not add a notification on success', async () => {
    mockedRequest.mockResolvedValue({ok: true, data: {id: 1}});
    await requestWithNotify({url: '/test'});
    expect(useAppStore.getState().notifications).toHaveLength(0);
  });
});

describe('requestWithNotify — params.onError composition', () => {
  it('calls params.onError in addition to showing a notification', async () => {
    const callerOnError = jest.fn();
    const error: RequestError = {type: 'timeout'};
    mockedRequest.mockImplementation(({onError}) => {
      onError?.(error);
      return Promise.resolve({ok: false, error});
    });

    await requestWithNotify({url: '/test', onError: callerOnError});

    expect(callerOnError).toHaveBeenCalledWith(error);
    expect(useAppStore.getState().notifications).toHaveLength(1);
  });

  it('still shows notification even without params.onError', async () => {
    const error: RequestError = {type: 'network', message: 'err'};
    mockedRequest.mockImplementation(({onError}) => {
      onError?.(error);
      return Promise.resolve({ok: false, error});
    });

    await requestWithNotify({url: '/test'});

    expect(useAppStore.getState().notifications).toHaveLength(1);
  });
});
