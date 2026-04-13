import {type ReactElement, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import Button from '@/components/button';
import Link from '@/components/link';
import {useAppStore} from '@/state';
import FakeLogo from '@/assets/images/fake-logo.webp';
import SVGNotification from '@/assets/svg/notification.svg';
import SVGSettings from '@/assets/svg/settings.svg';

import classes from './header.module.scss';

const Header = (): ReactElement => {
  const isLogged = useAppStore((s) => s.isLogged);
  const logout = useAppStore((s) => s.logout);
  const navigate = useNavigate();

  const onLogout = useCallback((): void => {
    logout();
    void navigate('/');
  }, [logout, navigate]);

  const onSignIn = useCallback((): void => {
    void navigate('/login');
  }, [navigate]);

  return (
    <header className={classes.header}>
      <div className={classes.le}>
        <Link to="/">
          <img className={classes.logo} src={FakeLogo} alt="logo" />
        </Link>
      </div>

      <div className={classes.ri}>
        {isLogged && (
          <div className={classes.icons}>
            <SVGNotification className={classes.icon} width="20" height="20" aria-label="notification" />
            <SVGSettings className={classes.icon} width="20" height="20" aria-label="settings" />
          </div>
        )}
        <div className={classes.userMenu}>
          {isLogged ? (
            <Button onClick={onLogout}>Log Out</Button>
          ) : (
            <Button isPrimary onClick={onSignIn}>Sign In</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
