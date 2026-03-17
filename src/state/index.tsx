import {type FC, type ReactElement, type ReactNode} from 'react';
import {ThemeProvider} from '@/state/theme';

export {useAppStore} from '@/state/store';
export {ThemeProvider, useTheme} from '@/state/theme';

type ProviderFC = FC<{children: ReactNode}>;

/**
 * Composes multiple React Context providers into a single wrapper component.
 *
 * Order matters: the first element becomes the outermost provider.
 *
 * Uses reduceRight so that providers[0] wraps providers[1] wraps ... wraps children.
 * The reduceRight callback produces JSX, not component definitions, so React's
 * component-definition linting rules do not apply to it.
 */
export const combineProviders = (providers: ProviderFC[]): ProviderFC =>
  ({children}: {children: ReactNode}): ReactElement =>
    providers.reduceRight<ReactElement>(
      (child, Provider) => <Provider>{child}</Provider>,
      <>{children}</>,
    );

const providers: ProviderFC[] = [
  ThemeProvider,
  // Add new Context providers here.
];

export const AppContextProvider = combineProviders(providers);
