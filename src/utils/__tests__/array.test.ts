import { describe, expect, test } from '@jest/globals';
import { deleteByIndex, updateArrayRecord, isArrayIncludes } from '@/utils/array';

describe('deleteByIndex', () => {
  test.each([
    [[1], 1, [1]],
    [[], 0, []],
    [[], 1, []],
    [[], -1, []],
    [[1, 2, 3], 0, [2, 3]],
    [[1, 2, 3], 1, [1, 3]],
    [[1, 2, 3], 2, [1, 2]],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(deleteByIndex(arg1, arg2)).toEqual(expectedResult);
  });
});

describe('updateArrayRecord', () => {
  test.each([
    [[{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}], 1, {b: 42}, [{a: 1, b: 1}, {a: 2, b: 42}, {a: 3, b: 3}]],
    [[{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}], 0, {a: 42}, [{a: 42, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}]],
    [[{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}], 2, {a: 42, b: 42}, [{a: 1, b: 1}, {a: 2, b: 2}, {a: 42, b: 42}]],
    [[{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}], -1, {b: 42}, [{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}]],
  ])('args: %p, %p, %p; returns %p', (arg1, arg2, arg3, expectedResult) => {
    expect(updateArrayRecord(arg1, arg2, arg3)).toEqual(expectedResult);
  });
});

describe('isArrayIncludes', () => {
  test.each([
    [[1, 2, 3], 2, true],
    [[1, 2, 3], 4, false],
    [[], 42, false],
    [[], undefined, false],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(isArrayIncludes(arg1, arg2)).toEqual(expectedResult);
  });
  test.each([
    [[{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}], {a: 2, b: 2}, true],
    [[{a: 1, b: 1}, {a: 2, b: 2}, {a: 3, b: 3}], {a: 2}, false],
    [[{a: 1, b: 1, c: {d: {e: 1}}}, {a: 2, b: 2, c: {d: {e: 2}}}, {a: 3, b: 3, c: {d: {e: 3}}}], {a: 3, b: 3, c: {d: {e: 3}}}, true],
    [[{a: 1, b: 1, c: {d: {e: 1}}}, {a: 2, b: 2, c: {d: {e: 2}}}, {a: 3, b: 3, c: {d: {e: 3}}}], {a: 3, b: 3, c: {d: {e: 4}}}, false],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(isArrayIncludes(arg1, arg2)).toEqual(expectedResult);
  });
  test.each([
    [[{a: new Date('2000-1-1')}, {a: new Date('2000-1-2')}], {a: new Date('2000-1-2')}, true],
    [[{a: new Date('2000-1-1')}, {a: new Date('2000-1-2')}], {a: new Date('2000-1-3')}, false],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(isArrayIncludes(arg1, arg2)).toEqual(expectedResult);
  });
});
