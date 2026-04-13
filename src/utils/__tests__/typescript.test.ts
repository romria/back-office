import { describe, expect, test } from '@jest/globals';
import { objectKeys } from '@/utils/typescript';

describe('objectKeys', () => {
  test.each([
    [{}, []],
    [[], []],
    [{ a: 1, b: 2, c: 3 }, ['a', 'b', 'c']],
    [new Date(0), []],
    [
      [1, 2, 3, 4, 5],
      ['0', '1', '2', '3', '4'],
    ],
    [() => {}, []],
  ])('arg: %p; returns %p', (arg1, expectedResult) => {
    expect(objectKeys(arg1)).toEqual(expectedResult);
  });
});
