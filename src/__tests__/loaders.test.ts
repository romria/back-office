// Mock react-router-dom without spreading requireActual to avoid module-level TextEncoder issues
jest.mock('react-router-dom', () => ({
  createBrowserRouter: jest.fn(() => ({})),
  redirect: jest.fn(),
}));

jest.mock('@/layouts/main', () => ({__esModule: true, default: () => null}));
jest.mock('@/routes/index', () => ({__esModule: true, default: () => null}));
jest.mock('@/routes/route-error', () => ({__esModule: true, default: () => null}));

jest.mock('@/state', () => ({
  useAppStore: {getState: jest.fn()},
}));

import {redirect} from 'react-router-dom';
import {useAppStore} from '@/state';
import {publicOnlyLoader, protectedLoader} from '@/router';

const mockGetState = useAppStore.getState as jest.Mock;
const mockRedirect = redirect as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('publicOnlyLoader', () => {
  it('returns null when user is not logged in', () => {
    mockGetState.mockReturnValue({isLogged: false});
    const result = publicOnlyLoader();
    expect(result).toBeNull();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('calls redirect to /dashboard when user is already logged in', () => {
    mockGetState.mockReturnValue({isLogged: true});
    publicOnlyLoader();
    expect(mockRedirect).toHaveBeenCalledWith('/dashboard');
  });
});

describe('protectedLoader', () => {
  it('returns null when user is logged in', () => {
    mockGetState.mockReturnValue({isLogged: true});
    const result = protectedLoader();
    expect(result).toBeNull();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('calls redirect to /login when user is not logged in', () => {
    mockGetState.mockReturnValue({isLogged: false});
    protectedLoader();
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });
});
