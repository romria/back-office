/**
 * ThemeContext — an example of when React Context is the right tool.
 *
 * Use Context (not Zustand) when ALL of these hold:
 *  - The value is configuration / dependency injection, not business state.
 *  - Updates are infrequent (user toggles theme rarely, vs. form fields on every keypress).
 *  - Every consumer needs the full value — no partial selector benefit from Zustand.
 *  - No async operations or cross-store interactions are needed.
 *
 * Theme fits perfectly: it is a global preference read by many components,
 * changes at most once per user action, and never interacts with the API layer.
 *
 * Counter-examples — use Zustand instead when:
 *  - Multiple unrelated components subscribe and each cares about a different slice.
 *  - State changes frequently (real-time data, form inputs, pagination).
 *  - You need persistence, devtools, or middleware.
 *  - Actions involve async logic or side-effects beyond React.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type FC,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider: FC<{children: ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect((): void => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback((): void => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (context == null) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
