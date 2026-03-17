import {type ReactElement, type ReactNode} from 'react';
import {Outlet} from 'react-router-dom';
import useAutoScrollOnNavigation from '@/hooks/use-auto-scroll-on-navigation';
import Header from '@/layouts/main/header';
import Footer from '@/layouts/main/footer';
import Notifications from '@/components/notifications';

import classes from './main.module.scss';

interface Props {
  children?: ReactNode
}

const MainLayout = ({children}: Props): ReactElement => {
  useAutoScrollOnNavigation();

  return (
    <>
      <Header />
      <main className={classes.main}>
        {children ?? <Outlet />}
      </main>
      <Footer />
      <Notifications />
    </>
  );
};

export default MainLayout;
