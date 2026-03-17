import {type ReactElement, Fragment, memo, useCallback, useMemo} from 'react';
import {clsx as cs} from 'clsx';
import SVGPencilSquare from '@/assets/svg/pencil-square.svg';
import SVGTrash from '@/assets/svg/trash.svg';

import classes from './action-icon.module.scss';

interface Props {
  className?: string
  type: 'edit' | 'delete'
  id: string
  onClick: (id: string) => void
}

const ActionIcon = memo(({
  className,
  type,
  id,
  onClick,
}: Props): ReactElement => {
  const onIconClick = useCallback(() => { onClick(id); }, [id, onClick]);

  const Component = useMemo(() => {
    switch (type) {
      case 'edit': return SVGPencilSquare;
      case 'delete': return SVGTrash;
      default: return Fragment;
    }
  }, [type]);

  return (
    <Component
      className={cs(
        classes.root,
        classes[type],
        className,
      )}
      onClick={onIconClick}
    />
  );
});

ActionIcon.displayName = 'ActionIcon';

export default ActionIcon;
