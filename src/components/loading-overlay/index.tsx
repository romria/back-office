import {type ReactElement, memo} from 'react';
import {clsx as cs} from 'clsx';
import Loading from '../loading';

import classes from './loading-overlay.module.scss';

interface Props {
  isVisible?: boolean
}

const LoadingOverlay = memo(({isVisible}: Props): ReactElement => (
  <div className={cs(classes.root, {[classes.visible]: isVisible})}>
    <Loading />
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;
