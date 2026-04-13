import {type ReactElement, useMemo, memo} from 'react';
import Button from '../button';

import classes from './pagination.module.scss';

interface Props {
  recordsVisible: number
  recordsTotal: number
  pageSelected: number
  pagesTotal: number
  skip: number
  limit: number
  onSelectPrevPage: () => void
  onSelectNextPage: () => void
  // isLoading?: boolean
}

const Pagination = memo(({
  recordsVisible,
  recordsTotal,
  pageSelected,
  pagesTotal,
  skip,
  limit,
  onSelectPrevPage,
  onSelectNextPage,
  // isLoading,
}: Props): ReactElement => {
  const showingRecords = useMemo((): string => {
    if (recordsVisible === 0) return '0';
    return `${skip + 1} - ${Math.min(skip + limit, recordsTotal)}`;
  }, [recordsVisible, skip, limit, recordsTotal]);

  return (
    <div className={classes.root}>
      <div className={classes.results}>
        Showing {showingRecords} of <span className={classes.bold}>{recordsTotal}</span>&nbsp;records
      </div>
      <div className={classes.pagination}>
        <Button
          onClick={onSelectPrevPage}
          disabled={pageSelected === 1}
          // isLoading={isLoading}
        >
          Previous
        </Button>
        <Button
          onClick={onSelectNextPage}
          disabled={pageSelected === pagesTotal}
          // isLoading={isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
