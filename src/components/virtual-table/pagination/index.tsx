import {type ChangeEvent, type ReactElement} from 'react';
import Button from '@/components/button';
import SVGChevronLeft from '@/assets/svg/chevron-left.svg';
import SVGChevronDoubleLeft from '@/assets/svg/chevron-double-left.svg';
import SVGChevronRight from '@/assets/svg/chevron-right.svg';
import SVGChevronDoubleRight from '@/assets/svg/chevron-double-right.svg';

import classes from './pagination.module.scss';

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

interface Props {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number, pageSize: number) => void;
}

const Pagination = ({page, pageSize, total, totalPages, rangeStart, rangeEnd, onPageChange}: Props): ReactElement => (
  <div className={classes.pagination}>
    <span className={classes.pageInfo}>
      {total > 0 ? `Showing ${rangeStart}-${rangeEnd} of ${total}` : 'No results'}
    </span>

    <div className={classes.pageControls}>
      <label htmlFor="page-size-select" className={classes.pageSizeLabel}>Rows:</label>
      <select
        id="page-size-select"
        className={classes.pageSizeSelect}
        value={pageSize}
        onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
          onPageChange(1, Number(e.target.value));
        }}
      >
        {PAGE_SIZE_OPTIONS.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      <Button
        aria-label="First page"
        className={classes.pageBtn}
        disabled={page <= 1}
        onClick={(): void => { onPageChange(1, pageSize); }}
      >
        <SVGChevronDoubleLeft className={classes.pageIcon} />
      </Button>
      <Button
        aria-label="Previous page"
        className={classes.pageBtn}
        disabled={page <= 1}
        onClick={(): void => { onPageChange(page - 1, pageSize); }}
      >
        <SVGChevronLeft className={classes.pageIcon} />
      </Button>

      <span className={classes.pageCurrent}>{page} / {totalPages}</span>

      <Button
        aria-label="Next page"
        className={classes.pageBtn}
        disabled={page >= totalPages}
        onClick={(): void => { onPageChange(page + 1, pageSize); }}
      >
        <SVGChevronRight className={classes.pageIcon} />
      </Button>
      <Button
        aria-label="Last page"
        className={classes.pageBtn}
        disabled={page >= totalPages}
        onClick={(): void => { onPageChange(totalPages, pageSize); }}
      >
        <SVGChevronDoubleRight className={classes.pageIcon} />
      </Button>
    </div>
  </div>
);

export default Pagination;
