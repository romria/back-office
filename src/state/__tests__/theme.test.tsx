import {renderHook, render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {type ReactElement, type ReactNode} from 'react';
import {ThemeProvider, useTheme} from '@/state/theme';

// jsdom does not implement matchMedia — provide a controllable stub
const setupMatchMedia = (prefersDark: boolean): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)' && prefersDark,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

// Small component for integration-style tests
const ThemeDisplay = (): ReactElement => {
  const {theme, toggleTheme} = useTheme();
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </>
  );
};

const wrapper = ({children}: {children: ReactNode}): ReactElement => (
  <ThemeProvider>{children}</ThemeProvider>
);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  setupMatchMedia(false);
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
describe('ThemeProvider — initial theme from localStorage', () => {
  it('initialises with "dark" when localStorage contains "dark"', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('initialises with "light" when localStorage contains "light"', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('ignores an invalid localStorage value and falls back to matchMedia', () => {
    localStorage.setItem('theme', 'sepia');
    setupMatchMedia(true);
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });
});

// ---------------------------------------------------------------------------
describe('ThemeProvider — initial theme from matchMedia (no localStorage)', () => {
  it('uses "dark" when prefers-color-scheme is dark', () => {
    setupMatchMedia(true);
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('defaults to "light" when prefers-color-scheme is not dark', () => {
    setupMatchMedia(false);
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});

// ---------------------------------------------------------------------------
describe('ThemeProvider — side effects on mount', () => {
  it('sets data-theme attribute on document.documentElement', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('writes the current theme to localStorage', () => {
    setupMatchMedia(true); // initialises to dark via matchMedia
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});

// ---------------------------------------------------------------------------
describe('ThemeProvider — toggleTheme', () => {
  it('switches the theme from light to dark', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    await user.click(screen.getByRole('button', {name: 'Toggle'}));
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
  });

  it('switches the theme from dark to light', async () => {
    localStorage.setItem('theme', 'dark');
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    await user.click(screen.getByRole('button', {name: 'Toggle'}));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('updates document.documentElement data-theme after toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    await user.click(screen.getByRole('button', {name: 'Toggle'}));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('updates localStorage after toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    await user.click(screen.getByRole('button', {name: 'Toggle'}));
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles back to the original theme on double-toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    await user.click(screen.getByRole('button', {name: 'Toggle'}));
    await user.click(screen.getByRole('button', {name: 'Toggle'}));
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});

// ---------------------------------------------------------------------------
describe('ThemeProvider — children', () => {
  it('renders children', () => {
    render(<ThemeProvider><p>Hello</p></ThemeProvider>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
describe('useTheme', () => {
  it('returns theme and toggleTheme within ThemeProvider', () => {
    const {result} = renderHook(() => useTheme(), {wrapper});
    expect(result.current.theme).toMatch(/^(light|dark)$/);
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('toggleTheme switches theme via hook', () => {
    const {result} = renderHook(() => useTheme(), {wrapper});
    const before = result.current.theme;
    act(() => { result.current.toggleTheme(); });
    expect(result.current.theme).toBe(before === 'light' ? 'dark' : 'light');
  });

  it('throws when used outside ThemeProvider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within a ThemeProvider');
  });
});
