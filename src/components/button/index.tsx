import {clsx as cs} from 'clsx';
import {type ButtonHTMLAttributes, type ReactElement} from 'react';

import classes from './button.module.scss';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isPrimary?: boolean
};

const Button = ({
  isPrimary,
  children,
  className,
  ...props
}: Props): ReactElement => (
  <button
    className={cs(
      classes.button,
      {[classes.primary]: isPrimary},
      className,
    )}
    type="button"
    {...props}
  >
    {children}
  </button>
);

export default Button;
