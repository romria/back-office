import {type ReactElement, type KeyboardEvent, Fragment, memo, useCallback, useMemo} from 'react';
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

const ARIA_LABELS: Record<Props['type'], string> = {
  edit: 'Edit',
  delete: 'Delete',
};

const ActionIcon = memo(({
  className,
  type,
  id,
  onClick,
}: Props): ReactElement => {
  const onIconClick = useCallback(() => { onClick(id); }, [id, onClick]);

  const onKeyDown = useCallback((e: KeyboardEvent<SVGSVGElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(id);
    }
  }, [id, onClick]);

  const Component = useMemo(() => {
    switch (type) {
      case 'edit': return SVGPencilSquare;
      case 'delete': return SVGTrash;
      default: return Fragment;
    }
  }, [type]);

  return (
    <Component
      role="button"
      tabIndex={0}
      aria-label={ARIA_LABELS[type]}
      className={cs(
        classes.root,
        classes[type],
        className,
      )}
      onClick={onIconClick}
      onKeyDown={onKeyDown}
    />
  );
});

ActionIcon.displayName = 'ActionIcon';

export default ActionIcon;
