import {type ReactElement, type ChangeEvent, type InputHTMLAttributes, type Ref, useCallback, useMemo} from 'react';
import {clsx as cs} from 'clsx';

import classes from './input.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  ref?: Ref<HTMLInputElement>
  isLoading?: boolean
  fullWidth?: boolean
  onChange?: (value: string) => void
};

const Input = ({
  ref,
  className,
  onChange,
  disabled,
  isLoading,
  fullWidth,
  ...props
}: Props): ReactElement => {
  const onChangeVal = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    if (onChange != null) onChange(e.target.value);
  }, [onChange]);
  const isDisabled = useMemo(() => (disabled ?? false) || (isLoading ?? false), [disabled, isLoading]);

  return (
    <input
      ref={ref}
      className={cs(
        classes.input,
        {[classes.loading]: isLoading},
        {[classes.fullWidth]: fullWidth},
        className,
      )}
      onChange={onChangeVal}
      autoComplete="off"
      disabled={isDisabled}
      {...props}
    />
  );
};

Input.displayName = 'Input';

export default Input;
