import {type ReactElement, useEffect} from 'react';
import {Outlet, useNavigate} from 'react-router-dom';
import Navigation from '@/routes/dashboard/navigation';
import {useAppStore} from '@/state';
import SuspenseLoader from '@/components/loader';

import classes from './layout.module.scss';

const DashboardLayout = (): ReactElement => {
  const isLogged = useAppStore((s) => s.isLogged);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) void navigate('/login', {replace: true});
  }, [isLogged, navigate]);

  return (
    <div className={classes.dashboard}>
      <Navigation />
      <div className={classes.section}>
        <SuspenseLoader>
          <Outlet />
        </SuspenseLoader>
      </div>
    </div>
  );
};

export default DashboardLayout;
