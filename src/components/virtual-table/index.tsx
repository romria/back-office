import {useCallback, useReducer, type ReactElement, type ReactNode, type KeyboardEvent} from 'react';
import {clsx as cs} from 'clsx';
import {TableVirtuoso} from 'react-virtuoso';

import {type KeysOfType} from '@/utils/typescript';
import Pagination from './pagination';
import classes from './table.module.scss';

export type SortDir = 'asc' | 'desc';

// When render is absent, key MUST map to a string|number field so row[key] is a valid ReactNode
interface DataColumn<T> {
  key: KeysOfType<T, string | number>;
  label: string;
  minWidth?: number;
  isSortable?: boolean;
  isCentered?: boolean;
  render?: (row: T) => ReactNode;
}

// Synthetic keys (edit, delete, switch) — render is required
interface CustomColumn<T> {
  key: string;
  label: string;
  minWidth?: number;
  isSortable?: boolean;
  isCentered?: boolean;
  render: (row: T) => ReactNode;
}

export type Column<T> = DataColumn<T> | CustomColumn<T>;

export interface TableParams extends Record<string, unknown> {
  sortBy?: string;
  order?: SortDir;
  limit: number;
  skip: number;
}

interface Props<T> {
  columns: Array<Column<T>>;
  data: T[];
  total: number;
  isPending?: boolean;
  onParamsChange: (params: TableParams) => void;
  onRowClick?: (row: T) => void;
}

interface TableState {
  sortKey: string | undefined;
  sortDir: SortDir;
  page: number;
  pageSize: number;
}

type TableAction =
  | {type: 'sort'; key: string; dir: SortDir}
  | {type: 'page'; page: number; pageSize: number};

const reducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'sort': return {...state, sortKey: action.key, sortDir: action.dir, page: 1};
    case 'page': return {...state, page: action.page, pageSize: action.pageSize};
    default: return state;
  }
};

const getInitialState = (): TableState => ({sortKey: undefined, sortDir: 'asc', page: 1, pageSize: 20});

const getAriaSort = (isActive: boolean, dir: SortDir): 'ascending' | 'descending' | 'none' => {
  if (!isActive) return 'none';
  return dir === 'asc' ? 'ascending' : 'descending';
};

const VirtualTable = <T,>({columns, data, total, isPending = false, onParamsChange, onRowClick}: Props<T>): ReactElement => {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const {sortKey, sortDir, page, pageSize} = state;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total > 0 ? (page - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(page * pageSize, total);

  const onSortChange = useCallback((key: string, dir: SortDir): void => {
    dispatch({type: 'sort', key, dir});
    onParamsChange({limit: pageSize, skip: 0, sortBy: key, order: dir});
  }, [onParamsChange, pageSize]);

  const onPageChange = useCallback((newPage: number, newPageSize: number): void => {
    dispatch({type: 'page', page: newPage, pageSize: newPageSize});
    onParamsChange({
      limit: newPageSize,
      skip: (newPage - 1) * newPageSize,
      sortBy: sortKey ?? undefined,
      order: sortKey != null ? sortDir : undefined,
    });
  }, [onParamsChange, sortKey, sortDir]);

  return (
    <div className={cs(classes.root, isPending && classes.pending)}>
      <TableVirtuoso
        className={classes.container}
        data={data}
        components={{
          Table: (props): ReactElement => (
            <table {...props} className={classes.table} />
          ),
          TableRow: (props): ReactElement => {
            const row = data[props['data-index']];
            const onClick = row != null && onRowClick != null ? (): void => { onRowClick(row); } : undefined;
            return (
              <tr
                {...props}
                className={cs(classes.row, {[classes.clickable]: onRowClick != null})}
                onClick={onClick}
              />
            );
          },
        }}
        fixedHeaderContent={(): ReactElement => (
          <tr>
            {columns.map(({key, label, minWidth, isSortable, isCentered}) => {
              const isActive = sortKey === key;
              const nextDir: SortDir = isActive && sortDir === 'asc' ? 'desc' : 'asc';
              const onSort = isSortable ? (): void => { onSortChange(key, nextDir); } : undefined;
              const onKeyDown = isSortable ? (e: KeyboardEvent<HTMLTableCellElement>): void => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSortChange(key, nextDir); }
              } : undefined;

              return (
                <th
                  key={key}
                  className={cs(classes.th, {[classes.thSortable]: isSortable, [classes.thSorted]: isActive, [classes.centered]: isCentered})}
                  style={{minWidth}}
                  tabIndex={isSortable ? 0 : undefined}
                  aria-sort={isSortable ? getAriaSort(isActive, sortDir) : undefined}
                  onClick={onSort}
                  onKeyDown={onKeyDown}
                >
                  <span className={classes.thInner}>
                    {label}
                    {isSortable && (
                      <span className={cs(classes.sortIcon, isActive && classes.sortIconActive)}>
                        {isActive ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        )}
        itemContent={(_index, row): ReactElement[] =>
          columns.map((col) => (
            <td key={col.key} className={cs(classes.td, {[classes.centered]: col.isCentered})} style={{minWidth: col.minWidth}}>
              {col.render != null ? col.render(row) : (row as Record<string, string | number>)[col.key]}
            </td>
          ))
        }
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default VirtualTable;
