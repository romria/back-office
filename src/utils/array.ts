import {isEqual} from '@/utils/object';

export const deleteByIndex = <T>(arr: T[], index: number): T[] => {
  if (index < 0 || index >= arr.length) return arr;

  return arr.toSpliced(index, 1);
};

export const updateArrayRecord = <T extends object>(arr: T[], index: number, updValues: Partial<T>): T[] => {
  if (arr[index] == null) return arr;

  return [
    ...arr.slice(0, index),
    {...arr[index], ...updValues},
    ...arr.slice(index + 1),
  ];
};

export const isArrayIncludes = <T>(arr: T[], val: T): boolean => arr.some((v) => isEqual(v, val));
