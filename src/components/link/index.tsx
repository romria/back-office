import {useCallback, type MouseEvent, type ReactElement} from 'react';
import {clsx as cs} from 'clsx';
import {NavLink, type NavLinkProps, useLocation} from 'react-router-dom';

import classes from './link.module.scss';

interface Props extends Omit<NavLinkProps, 'className'> {
  activeClassName?: string
  className?: string
}

const Link = ({children, className, activeClassName, to, onClick, ...props}: Props): ReactElement => {
  const {pathname, search, hash} = useLocation();

  const handleClick = useCallback((e: MouseEvent<HTMLAnchorElement>): void => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
      onClick?.(e);
      return;
    }
    const current = pathname + search + hash;
    const target = typeof to === 'string'
      ? to
      : (to.pathname ?? '') + (to.search ?? '') + (to.hash ?? '');
    if (current === target) { e.preventDefault(); return; }
    onClick?.(e);
  }, [pathname, search, hash, to, onClick]);

  return (
    <NavLink
      to={to}
      className={({isActive}) => cs(classes.link, className, isActive && activeClassName)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </NavLink>
  );
};

export default Link;
