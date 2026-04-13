import {type ReactElement} from 'react';

import classes from './index.module.scss';

const DashboardHome = (): ReactElement => (
  <div className={classes.dashboardIndex}>
    <h1>Summary</h1>
  </div>
);

export default DashboardHome;
