import {type ReactElement, memo} from 'react';
import {clsx as cs} from 'clsx';

import classes from './loading.module.scss';

interface Props {
  className?: string
}

const Loading = memo(({className}: Props): ReactElement => (
  <div className={cs(classes.root, className)}>
    <div className={classes.loading} />
  </div>
));

Loading.displayName = 'Loading';

export default Loading;
