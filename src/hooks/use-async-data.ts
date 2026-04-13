import {useCallback, useReducer, useRef} from 'react';

export type AsyncState<T> = {data: T | undefined; isLoading: boolean; error: boolean};

type AsyncAction<T> =
  | {type: 'loading'}
  | {type: 'resolved'; data: T}
  | {type: 'rejected'};

const reducer = <T,>(s: AsyncState<T>, a: AsyncAction<T>): AsyncState<T> => {
  switch (a.type) {
    case 'loading':  return {...s, isLoading: true, error: false};
    case 'resolved': return {data: a.data, isLoading: false, error: false};
    case 'rejected': return {...s, isLoading: false, error: true};
    default: return s;
  }
};

/**
 * Manages loading/error/data state for async operations.
 *
 * `run(fn)` executes `fn`, sets `isLoading` while it is pending, and commits
 * the result to state when it settles. If `run` is called again before a
 * previous call settles, the earlier result is silently discarded — only the
 * most recent call can update state. This prevents out-of-order responses from
 * overwriting newer data.
 *
 * @param initialLoading - Start in the loading state (useful when the first
 *   `run` call is triggered immediately on mount and you want to avoid a flash
 *   of empty content before the first result arrives).
 */
const useAsyncData = <T,>(initialLoading = false): {
  state: AsyncState<T>;
  run: (fn: () => Promise<T>) => void;
} => {
  const latestCallId = useRef(0);
  const [state, dispatch] = useReducer(
    reducer<T>,
    {data: undefined, isLoading: initialLoading, error: false},
  );

  const run = useCallback((fn: () => Promise<T>): void => {
    const thisCallId = ++latestCallId.current;
    dispatch({type: 'loading'});
    void (async (): Promise<void> => {
      try {
        const data = await fn();
        if (thisCallId === latestCallId.current) dispatch({type: 'resolved', data});
      } catch {
        if (thisCallId === latestCallId.current) dispatch({type: 'rejected'});
      }
    })();
  }, []);

  return {state, run};
};

export default useAsyncData;
