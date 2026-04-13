import {lazy} from 'react';
import {createBrowserRouter, redirect} from 'react-router-dom';
import {useAppStore} from '@/state';
import MainLayout from '@/layouts/main';
import Index from '@/routes/index';
import RouteError from '@/routes/route-error';

// Page routes are lazy-loaded so webpack emits a separate chunk per route.
// The initial bundle only carries the shell (MainLayout, Index, RouteError).
const Login = lazy(() => import(/* webpackChunkName: "login" */ '@/routes/login'));
const DashboardLayout = lazy(() => import(/* webpackChunkName: "dashboard" */ '@/routes/dashboard/layout'));
const DashboardHome = lazy(() => import(/* webpackChunkName: "dashboard-index" */ '@/routes/dashboard/index'));
const DashboardUsers = lazy(() => import(/* webpackChunkName: "dashboard-users" */ '@/routes/dashboard/users'));
const DashboardUser = lazy(() => import(/* webpackChunkName: "dashboard-user" */ '@/routes/dashboard/user'));

// Runs before rendering /login — redirects already-authenticated users away.
export const publicOnlyLoader = (): Response | null => {
  const {isLogged} = useAppStore.getState();
  return isLogged ? redirect('/dashboard') : null;
};

// Runs before rendering protected routes — redirects unauthenticated users to login.
export const protectedLoader = (): Response | null => {
  const {isLogged} = useAppStore.getState();
  return isLogged ? null : redirect('/login');
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    // Last-resort error boundary — fires only when MainLayout itself throws.
    // Child-route errors are caught by their own errorElement below.
    errorElement: <RouteError />,
    children: [
      {index: true, element: <Index />},
      {
        path: 'login',
        loader: publicOnlyLoader,
        element: <Login />,
        errorElement: <RouteError />,
      },
      {
        path: 'dashboard',
        loader: protectedLoader,
        element: <DashboardLayout />,
        errorElement: <RouteError />,
        children: [
          {index: true, element: <DashboardHome />},
          {path: 'users', element: <DashboardUsers />},
          {path: 'users/:id', element: <DashboardUser />},
        ],
      },
    ],
  },
]);
