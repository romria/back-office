import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {RouterProvider} from 'react-router-dom';
import '@/assets/fonts/Inter/inter.scss';
import 'modern-normalize/modern-normalize.css';
import '@/styles/main.scss';
import {AppContextProvider} from '@/state';
import ErrorBoundary from '@/components/error-boundary';
import SuspenseLoader from '@/components/loader';
import {router} from '@/router';

const rootElement = document.getElementById('root');
if (rootElement === null) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <AppContextProvider>
        <SuspenseLoader fallback={null}>
          <RouterProvider router={router} />
        </SuspenseLoader>
      </AppContextProvider>
    </ErrorBoundary>
  </StrictMode>,
);
