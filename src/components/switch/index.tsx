import {type ReactElement, type ReactNode, type KeyboardEvent, useCallback, useMemo} from 'react';
import {clsx as cs} from 'clsx';
import {genericMemo} from '@/utils/typescript';

import classes from './switch.module.scss';

interface Props<T> {
  className?: string
  label?: string
  labelToggled?: string
  disabled?: boolean
  isLoading?: boolean
  inline?: boolean
  toggled: boolean
  name: T
  onToggle: (toggled: boolean, name: T) => void
}

const Switch = <NameT extends string>({
  className,
  label,
  labelToggled,
  disabled,
  isLoading,
  inline,
  toggled,
  name,
  onToggle,
}: Props<NameT>): ReactElement => {
  const onClick = useCallback(() => {
    if (isLoading || disabled) return;
    onToggle(!toggled, name);
  }, [disabled, isLoading, name, onToggle, toggled]);

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    if (isLoading || disabled) return;
    onToggle(!toggled, name);
  }, [disabled, isLoading, name, onToggle, toggled]);

  const labelNode = useMemo((): ReactNode => {
    const val = labelToggled && toggled ? labelToggled : label;
    return val ? <div className={classes.label}>{val}</div> : null;
  }, [toggled, label, labelToggled]);

  return (
    <div
      className={cs(
        classes.root,
        {[classes.inline]: inline},
        {[classes.disabled]: disabled},
        {[classes.isLoading]: isLoading},
        className,
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="switch"
      tabIndex={disabled === true || isLoading === true ? -1 : 0}
      aria-checked={toggled}
      aria-disabled={disabled ?? false}
      aria-busy={isLoading ?? false}
    >
      <div className={classes.switch}>
        <div className={cs(classes.control, {[classes.checked]: toggled})} />
      </div>
      {labelNode}
    </div>
  );
};

Switch.displayName = 'Switch';

export default genericMemo(Switch);
