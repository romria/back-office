import {useCallback, useMemo, useReducer} from 'react';
import {TABLE_ROWS_LIMIT_DEFAULT} from '@/config';
import {getPagesLimit} from '@/utils/number';
import {deleteByIndex, updateArrayRecord} from '@/utils/array';

export enum ActionType {
  SET_DATA = 'SET_DATA',
  UPDATE_RECORD = 'UPDATE_RECORD',
  DELETE_RECORD = 'DELETE_RECORD',
  SORT_DATA = 'SORT_DATA',
  // UPDATE_FILTERS = 'UPDATE_FILTERS',
  SELECT_PAGE = 'SELECT_PAGE',
  SELECT_NEXT_PAGE = 'SELECT_NEXT_PAGE',
  SELECT_PREVIOUS_PAGE = 'SELECT_PREVIOUS_PAGE',
}

type Action<
DataT
// FilterT
> =
  | {type: ActionType.SET_DATA, payload: {list: DataT[], total: number}}
  | {type: ActionType.UPDATE_RECORD, payload: DataT}
  | {type: ActionType.DELETE_RECORD, payload: {id: string}}
  | {type: ActionType.SORT_DATA, payload: {sortedBy: string, order: 'asc' | 'desc'}}
  // | {type: ActionType.UPDATE_FILTERS, payload: Partial<FilterT>}
  | {type: ActionType.SELECT_PAGE, payload: {pageSelected: number}}
  | {type: ActionType.SELECT_NEXT_PAGE}
  | {type: ActionType.SELECT_PREVIOUS_PAGE};

interface State<
DataT,
// FilterT,
> {
  list: DataT[]
  recordsTotal: number
  sortedBy: string
  order: 'asc' | 'desc'
  // filters: FilterT
  pageSelected: number
  pagesTotal: number
  limit: number
  skip: number
}

interface ReducerState<
DataT,
 // FilterT
> {
  state: State<
    DataT
    // FilterT
  >
  onSetData: (payload: {list: DataT[], total: number}) => void
  onUpdateRecord: (payload: DataT) => void
  onDeleteRecord: (id: string) => void
  onSortData: (key: string, order: 'asc' | 'desc') => void
  // onFilterData: (payload: Partial<FilterT>) => void
  onSelectNextPage: () => void
  onSelectPrevPage: () => void
}

export const useListReducer = <
DataT extends {id: string}
// FilterT extends object
>(/* initialFilters: FilterT */): ReducerState<
  DataT
  // FilterT
> => {
  const initialState: State<
    DataT
    // FilterT
  > = {
    list: [],
    recordsTotal: 0,
    sortedBy: '',
    order: 'asc',
    // filters: initialFilters,
    pageSelected: 1,
    pagesTotal: 1,
    limit: TABLE_ROWS_LIMIT_DEFAULT,
    skip: 0,
  };

  const reducer = (
    state: State<
    DataT
    // FilterT
    >,
    action: Action<
    DataT
    // FilterT,
    >,
  ): State<
  DataT
  //  FilterT,
   > => {
    switch (action.type) {
      case ActionType.SET_DATA:
        return {
          ...state,
          list: action.payload.list,
          recordsTotal: action.payload.total,
          pagesTotal: getPagesLimit({dataLength: action.payload.total, perPage: TABLE_ROWS_LIMIT_DEFAULT}),
        };
      case ActionType.UPDATE_RECORD: {
        const index = state.list.findIndex(({id}) => id === action.payload.id);
        if (index === -1) return state;

        return {
          ...state,
          list: updateArrayRecord(state.list, index, action.payload),
        };
      }
      case ActionType.DELETE_RECORD: {
        const index = state.list.findIndex(({id}) => id === action.payload.id);
        if (index === -1) return state;

        return {
          ...state,
          list: deleteByIndex(state.list, index),
          recordsTotal: state.recordsTotal - 1,
        };
      }
      case ActionType.SORT_DATA:
        return {
          ...state,
          sortedBy: action.payload.sortedBy,
          order: action.payload.order,
          pageSelected: 1,
          skip: 0,
        };
      // case ActionType.UPDATE_FILTERS:
      //   return {
      //     ...state,
      //     filters: {
      //       ...state.filters,
      //       ...action.payload,
      //     },
      //     pageSelected: 1,
      //     skip: 0,
      //   };
      case ActionType.SELECT_PAGE:
        return {
          ...state,
          pageSelected: action.payload.pageSelected,
          skip: (action.payload.pageSelected - 1) * state.limit,
        };
      case ActionType.SELECT_NEXT_PAGE: {
        const pageSelected = Math.min(state.pageSelected + 1, state.pagesTotal);

        return {
          ...state,
          pageSelected,
          skip: (pageSelected - 1) * state.limit,
        };
      }
      case ActionType.SELECT_PREVIOUS_PAGE: {
        const pageSelected = Math.max(state.pageSelected - 1, 1);

        return {
          ...state,
          pageSelected,
          skip: (pageSelected - 1) * state.limit,
        };
      }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const onSetData = useCallback((payload: {list: DataT[], total: number}) => { dispatch({type: ActionType.SET_DATA, payload}); }, [dispatch]);
  const onUpdateRecord = useCallback((payload: DataT) => { dispatch({type: ActionType.UPDATE_RECORD, payload}); }, [dispatch]);
  const onDeleteRecord = useCallback((id: string) => { dispatch({type: ActionType.DELETE_RECORD, payload: {id}}); }, [dispatch]);
  const onSortData = useCallback((sortedBy: string, order: 'asc' | 'desc') => { dispatch({type: ActionType.SORT_DATA, payload: {sortedBy, order}}); }, [dispatch]);
  // const onFilterData = useCallback((payload: Partial<FilterT>) => { dispatch({type: ActionType.UPDATE_FILTERS, payload}); }, [dispatch]);
  const onSelectNextPage = useCallback(() => { dispatch({type: ActionType.SELECT_NEXT_PAGE}); }, [dispatch]);
  const onSelectPrevPage = useCallback(() => { dispatch({type: ActionType.SELECT_PREVIOUS_PAGE}); }, [dispatch]);

  return useMemo(() => ({
    state,
    onSetData,
    onUpdateRecord,
    onDeleteRecord,
    onSortData,
    // onFilterData,
    onSelectNextPage,
    onSelectPrevPage,
  }), [
    state,
    onSetData,
    onUpdateRecord,
    onDeleteRecord,
    onSortData,
    // onFilterData,
    onSelectNextPage,
    onSelectPrevPage,
  ]);
};
