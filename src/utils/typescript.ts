import { type ComponentProps, type ComponentType, type MemoExoticComponent, memo } from 'react';

// Alternative to "keyofStringsOnly" deprecated TS compiler option
export type KeyOf<T extends object> = Extract<keyof T, string>;
// Possible values by the object keys
export type ValueOf<T extends object> = T[KeyOf<T>];
// Possible key/value pairs from the object
export type KeyValueType<T extends Record<string, unknown>> = ValueOf<{
  [K in KeyOf<T>]: {
    key: K;
    value: T[K];
  };
}>;

export type KeysOfUnion<T> = T extends T ? keyof T : never;

// Keys of T whose value extends V
export type KeysOfType<T, V> = {[K in keyof T & string]: T[K] extends V ? K : never}[keyof T & string];

// This function returns a strongly-typed array of the keys of the given object
export const objectKeys = Object.keys as <T extends object>(value: T) => Array<KeyOf<T>>;

/**
 * genericMemo — React.memo wrapper that preserves generic component types.
 * By default, React.memo loses generic type parameters. This re-types it
 * so that memoized generic components retain their generics.
 *
 * Usage:
 *   const MyList = <T,>({ items }: { items: T[] }) => <>{items.length}</>;
 *   const MemoizedList = genericMemo(MyList);
 *   <MemoizedList items={[1, 2, 3]} />  // T is inferred as number
 */
export const genericMemo: <T extends ComponentType<ComponentProps<T>>>(
  component: T,
  propsAreEqual?: (prevProps: Readonly<ComponentProps<T>>, nextProps: Readonly<ComponentProps<T>>) => boolean,
) => MemoExoticComponent<T> = memo;
