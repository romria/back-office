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
