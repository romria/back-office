// import {isDate} from './date';
import { objectKeys } from './typescript';

// Expected to return true only if a value is the Javascript Object but not null, Array, or Date.
// export const isObject = (val: unknown): boolean => val != null && typeof val === 'object' && !Array.isArray(val) && !isDate(val);
export const isEmpty = (val: object): boolean => Object.keys(val).length === 0;

export const isEqual = <T>(a: T, b: T): boolean => {
  if (a === b) return true;

  if (typeof a === 'object' && typeof b === 'object' && a != null && b != null) {
    if (a.constructor !== b.constructor) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; ++i) {
        if (!isEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    const keys = objectKeys(a);
    if (keys.length !== objectKeys(b).length) return false;
    for (let i = 0; i < keys.length; ++i) {
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
    }

    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (!isEqual(a[key], b[key])) return false;
    }

    return true;
  }

  if (Number.isNaN(a) && Number.isNaN(b)) return true; // NaN !== NaN

  return false;
};

// export const cloneObject = <T extends ObjectRecord>(obj: T): T => {
//   const clonedObjects = new WeakMap();

//   const clone = (o: ObjectRecord | ObjectValue): ObjectRecord | ObjectValue => {
//     if (typeof o !== 'object' || o === null) {
//       return o;
//     }
//     if (o instanceof Date) {
//       return new Date(o);
//     }

//     if (clonedObjects.has(o)) {
//       return clonedObjects.get(o);
//     }

//     const result: ObjectRecord = {};
//     clonedObjects.set(o, result);

//     Object.entries(o).forEach(([key, value]) => {
//       result[key] = clone(value);
//     });
//     return result;
//   };

//   return clone(obj) as T;
// };
