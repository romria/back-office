import {useCallback, useMemo, useReducer} from 'react';

export enum ActionType {
  SET_RECORD = 'SET_RECORD',
  UPDATE_RECORD = 'UPDATE_RECORD',
  CLEAR = 'CLEAR',
}

type Action<T> =
  | {type: ActionType.SET_RECORD, payload: T}
  | {type: ActionType.UPDATE_RECORD, payload: Partial<T>}
  | {type: ActionType.CLEAR};

interface ReducerState<T> {
  record: T
  onSetRecord: (payload: T) => void
  onUpdateRecord: (payload: Partial<T>) => void
  onClear: () => void
}

export const useRecordReducer = <T extends {id: string}>(initialState: T): ReducerState<T> => {
  const reducer = (
    state: T,
    action: Action<T>,
  ): T => {
    switch (action.type) {
      case ActionType.SET_RECORD:
      case ActionType.UPDATE_RECORD:
        return {
          ...state,
          ...action.payload,
        };
      case ActionType.CLEAR:
        return {
          ...initialState,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const onSetRecord = useCallback((payload: T) => { dispatch({type: ActionType.SET_RECORD, payload}); }, [dispatch]);
  const onUpdateRecord = useCallback((payload: Partial<T>) => { dispatch({type: ActionType.UPDATE_RECORD, payload}); }, [dispatch]);
  const onClear = useCallback(() => { dispatch(({type: ActionType.CLEAR})); }, [dispatch]);

  return useMemo(() => ({
    record: state,
    onSetRecord,
    onUpdateRecord,
    onClear,
  }), [
    state,
    onSetRecord,
    onUpdateRecord,
    onClear,
  ]);
};
