/**
 * Useful TypeScript patterns for reference.
 * These are not used in production code — copy and adapt as needed.
 */

import { type ComponentProps, type ComponentType, memo } from 'react';
import type { KeyOf } from './typescript';

/**
 * Exactify — Prevents excess properties in generic type constraints.
 * Ensures that X has no extra keys beyond what T defines.
 *
 * Usage:
 *   function update<T extends Config, X extends Exactify<Config, X>>(config: X) { ... }
 *   update({ known: 1 })          // ok
 *   update({ known: 1, extra: 2 }) // error: 'extra' does not exist in Config
 */
export type Exactify<T, X extends T> = T & { [K in keyof X]: K extends keyof T ? X[K] : never };

/**
 * Subset — Compile-time constraint ensuring T is a subset of U.
 * Useful when you want to guarantee a type narrows to its parent.
 *
 * Usage:
 *   type Strict = Subset<{ a: number }, Base>;  // ok if Base has { a: number }
 *   type Fail = Subset<{ z: string }, Base>;     // error if Base lacks 'z'
 */
export type Subset<_T extends U, U> = U;

/**
 * extractValues — Pick specific values from a record by keys.
 * Returns a Partial<T> containing only the specified keys.
 *
 * Usage:
 *   extractValues({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }
 */
export const extractValues = <T extends object>(record: T, keys: Array<KeyOf<T>>): Partial<T> =>
  keys.reduce((acc: Partial<T>, key) => {
    acc[key] = record[key];
    return acc;
  }, {});

/**
 * create — Instantiate a class from its constructor type.
 * Useful when you need to create instances from generic class references.
 *
 * Usage:
 *   class Foo { value = 42; }
 *   const foo = create(Foo); // foo: Foo, foo.value === 42
 */
export function create<T>(ctor: new () => T): T {
  return new ctor();
}

/**
 * isInstanceOf — Type-safe instanceof check with generic constructor.
 * Narrows the type when used as a type guard.
 *
 * Usage:
 *   if (isInstanceOf(Date, value)) { value.getTime(); }
 */
export function isInstanceOf<T>(ctor: new (...args: unknown[]) => T, obj: unknown): obj is T {
  return obj instanceof ctor;
}

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
) => T = memo;

/**
 * nameOf — Get the constructor name of an object at runtime.
 *
 * Usage:
 *   nameOf(new Date())    // "Date"
 *   nameOf({ foo: 'bar' }) // "Object"
 */
export const nameOf = (object: object): string => object?.constructor?.name ?? '';
