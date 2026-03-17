import {renderHook} from '@testing-library/react';
import {useLocation} from 'react-router-dom';
import useAutoScrollOnNavigation from '@/hooks/use-auto-scroll-on-navigation';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.Mock;

beforeEach(() => {
  mockUseLocation.mockReturnValue({pathname: '/'});
  jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useAutoScrollOnNavigation', () => {
  it('calls window.scrollTo(0, 0) on initial render', () => {
    renderHook(() => useAutoScrollOnNavigation());
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('calls window.scrollTo(0, 0) when pathname changes', () => {
    const {rerender} = renderHook(() => useAutoScrollOnNavigation());
    (window.scrollTo as jest.Mock).mockClear();

    mockUseLocation.mockReturnValue({pathname: '/new-path'});
    rerender();

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it('does not re-call scrollTo when re-rendered with the same pathname', () => {
    const {rerender} = renderHook(() => useAutoScrollOnNavigation());
    (window.scrollTo as jest.Mock).mockClear();

    rerender();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
