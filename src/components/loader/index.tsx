import {Suspense, type ReactElement, type ReactNode} from 'react';

import classes from './loader.module.scss';

export const Loader = (): ReactElement => (
  <div className={classes.container}>
    <div className={classes.spinner} />
  </div>
);

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const SuspenseLoader = ({children, fallback = <Loader />}: Props): ReactElement => (
  <Suspense fallback={fallback}>{children}</Suspense>
);

export default SuspenseLoader;
