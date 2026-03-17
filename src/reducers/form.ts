import {useCallback, useMemo, useReducer} from 'react';

// type Nullable<T> = T | {};
// type Nullable<T> = T | null | undefined;

export enum ActionType {
  CHANGE_VALUE = 'CHANGE_VALUE',
  CHANGE_VALUES = 'CHANGE_VALUES',
  CLEAR_FORM = 'CLEAR_FORM',
}

type Action<T> =
  | {type: ActionType.CHANGE_VALUE, payload: {key: keyof T, value: T[keyof T]}}
  | {type: ActionType.CHANGE_VALUES, payload: Partial<T>}
  | {type: ActionType.CLEAR_FORM};

interface ReducerState<T> {
  state: T
  onChangeValue: (value: T[keyof T], key: keyof T) => void
  onChangeValues: (payload: Partial<T>) => void
  onClearForm: () => void
}

export const useFormReducer = <T>(initialState: T): ReducerState<T> => {
  // const initialState = initialData;

  const reducer = (
    state: T,
    action: Action<T>,
  ): T => {
    switch (action.type) {
      case ActionType.CHANGE_VALUE:
        return {
          ...state,
          [action.payload.key]: action.payload.value,
        };
      case ActionType.CHANGE_VALUES:
        return {
          ...state,
          ...action.payload,
        };
      case ActionType.CLEAR_FORM:
        return {
          ...initialState,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const onChangeValue = useCallback((value: T[keyof T], key: keyof T) => { dispatch({type: ActionType.CHANGE_VALUE, payload: {key, value}}); }, [dispatch]);
  const onChangeValues = useCallback((payload: Partial<T>) => { dispatch({type: ActionType.CHANGE_VALUES, payload}); }, [dispatch]);
  const onClearForm = useCallback(() => { dispatch(({type: ActionType.CLEAR_FORM})); }, [dispatch]);

  return useMemo(() => ({
    state,
    onChangeValue,
    onChangeValues,
    onClearForm,
  }), [
    state,
    onChangeValue,
    onChangeValues,
    onClearForm,
  ]);
};
