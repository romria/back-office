import {type ReactElement, type FC} from 'react';
import {clsx as cs} from 'clsx';
import {useLocation} from 'react-router-dom';
import {useShallow} from 'zustand/react/shallow';
import Link from '@/components/link';
import SVGHome from '@/assets/svg/home.svg';
import SVGPeople from '@/assets/svg/people.svg';
import {useAppStore} from '@/state';

import classes from './navigation.module.scss';

const NAVI_ELEMENTS: Array<{ type: string, route?: string, label: string, Icon?: FC<{ fill?: string, className?: string, width?: string, height?: string }> }> = [
  {
    type: 'link',
    route: '/dashboard',
    label: 'Home',
    Icon: SVGHome,
  },
  {
    type: 'head',
    label: 'DATA',
  },
  {
    type: 'link',
    route: '/dashboard/users',
    label: 'Users',
    Icon: SVGPeople,
  },
];

const Navigation = (): ReactElement => {
  const {pathname} = useLocation();

  const {username, role} = useAppStore(
    useShallow((s) => ({username: s.username, role: s.role})),
  );

  return (
    <div className={classes.navigation}>
      {NAVI_ELEMENTS.map(({type, route, Icon, label}) => {
        if (type === 'link' && Icon !== undefined && route !== undefined) {
          const isIndexRoute = route === '/dashboard';
          const isActive = isIndexRoute ? pathname === route : pathname.includes(route);

          return (
            <Link
              key={label}
              className={classes.naviLink}
              activeClassName={classes.active}
              to={route}
              end={isIndexRoute}
            >
              <Icon className={cs(classes.linkIcon, {[classes.active]: isActive})} width="20" height="20" />
              <div className={classes.linkLabel}>{label}</div>
            </Link>
          );
        }

        return (
          <div key={label} className={classes.naviHead}>{label}</div>
        );
      })}

      <div className={classes.userInfo}>
        <div className={classes.userName}>{username}</div>
        <div className={classes.userRole}>{role}</div>
      </div>
    </div>
  );
};

export default Navigation;
