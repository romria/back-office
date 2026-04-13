import {describe, expect, test} from '@jest/globals';
import {parseStringDate, isDate, isValidDate, format, DateFormat, isSameDate, isEqualDates, addYears, addMonths} from '@/utils/date';

describe('parseStringDate', () => {
  test.each([
    ['1977-01-16T00:23:42.222', new Date(222222222222)],
    ['1979-02-31T00:01:42.222', new Date(289267302222)],
    ['1979-13-31T00:00:00.000', undefined],
    ['', undefined],
    ['0', new Date(946677600000)],
    ['42', new Date(2272140000000)],
    ['420', new Date(-48913293724000)],
    ['-1', new Date(978300000000)],
  ])('args: %p; returns %p', (arg1, expectedResult) => {
    expect(parseStringDate(arg1)).toEqual(expectedResult);
  });
});

describe('isDate', () => {
  test.each([
    [undefined, false],
    [null, false],
    [NaN, false],
    [true, false],
    [false, false],
    [1, false],
    ['', false],
    ['1', false],
    [{}, false],
    [[], false],
    [new Date(), true],
    [new Date(42), true],
    [new Date(NaN), true],
  ])('args: %p; returns %p', (arg1, expectedResult) => {
    expect(isDate(arg1)).toEqual(expectedResult);
  });
});

describe('isValidDate', () => {
  test.each([
    [undefined, false],
    [null, false],
    [NaN, false],
    [true, false],
    [false, false],
    [1, false],
    ['', false],
    ['1', false],
    [{}, false],
    [[], false],
    [new Date(), true],
    [new Date(42), true],
    [new Date(NaN), false],
  ])('args: %p; returns %p', (arg1, expectedResult) => {
    expect(isValidDate(arg1)).toEqual(expectedResult);
  });
});

describe('format', () => {
  test.each([
    [new Date(''), DateFormat.API, ''],
    [new Date(NaN), DateFormat.API, ''],
    [new Date('2000-02-29T00:00:00.000'), DateFormat.API, '2000-02-29'],
    [new Date('2018-01-01T00:00:00.000'), DateFormat.Table, 'January 01, 2018'],
    [new Date('2018-01-01T22:17:37.129'), DateFormat.TableWithTime, 'Jan 1, 2018 22:17'],
    [new Date('2021-09-13'), DateFormat.Dot, '13.09.2021'],
    [new Date('2021-09-13'), DateFormat.Slash, '13/09/2021'],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(format(arg1, arg2)).toEqual(expectedResult);
  });
  test.each([
    ['', DateFormat.API, ''],
    [NaN, DateFormat.API, ''],
    ['2000-02-29T00:00:00.000', DateFormat.API, '2000-02-29'],
    ['2018-01-01T00:00:00.000', DateFormat.Table, 'January 01, 2018'],
    ['2018-01-01T22:17:37.129', DateFormat.TableWithTime, 'Jan 1, 2018 22:17'],
    ['2021-09-13', DateFormat.Dot, '13.09.2021'],
    ['2021-09-13', DateFormat.Slash, '13/09/2021'],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(format(arg1, arg2)).toEqual(expectedResult);
  });
  test.each([
    [new Date('2021-09-13'), 'en', '9/13/2021'],
    [new Date('2021-09-13'), 'uk-UA', '13.09.2021'],
    [new Date('2021-09-13'), 'th-TH', '13/9/2564'],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(format(arg1, arg2)).toEqual(expectedResult);
  });
});

describe('addYears', () => {
  test.each([
    [new Date('2018-01-01T00:00:00.000'), 42, new Date('2060-01-01T00:00:00.000')],
    [new Date('2018-01-01T22:17:37.129'), 42, new Date('2060-01-01T22:17:37.129')],
    [new Date('2018-01-01T00:00:00.000'), -8, new Date('2010-01-01T00:00:00.000')],
    [new Date('2000-02-29T00:00:00.000'), 2, new Date('2002-02-28T00:00:00.000')],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(addYears(arg1, arg2)).toEqual(expectedResult);
  });
});

describe('addMonths', () => {
  test.each([
    [new Date('2018-01-01T00:00:00.000'), 2, new Date('2018-03-01T00:00:00.000')],
    [new Date('2018-01-01T22:17:37.129'), -2, new Date('2017-11-01T22:17:37.129')],
  ])('args: %p, %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(addMonths(arg1, arg2)).toEqual(expectedResult);
  });
});

describe('isSameDate', () => {
  test.each([
    [new Date('2021-09-13'), new Date('2021-09-13'), true],
    [new Date('2021-09-13T09:07:19.421Z'), new Date('2021-09-13T09:07:19.421Z'), true],
    [new Date('2021-09-13T09:07:19.421Z'), new Date('2021-09-13T11:12:12.421Z'), true],
    [new Date(NaN), new Date(NaN), false],
  ])('args: %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(isSameDate(arg1, arg2)).toEqual(expectedResult);
  });
});

describe('isEqualDates', () => {
  test.each([
    [new Date('2021-09-13'), new Date('2021-09-13'), true],
    [new Date('2021-09-13T09:07:19.421Z'), new Date('2021-09-13T09:07:19.421Z'), true],
    [new Date('2021-09-13T09:07:19.421Z'), new Date('2021-09-13T11:12:12.421Z'), false],
    [new Date(NaN), new Date(NaN), false],
  ])('args: %p; returns %p', (arg1, arg2, expectedResult) => {
    expect(isEqualDates(arg1, arg2)).toEqual(expectedResult);
  });
});

// describe('getMonthStart', () => {
//   test.each([
//     [new Date('2021-09-13'), new Date('2021-09-01')],
//     [new Date('2021-09-13T09:07:19.421Z'), new Date('2021-09-01')],
//     [new Date(NaN), new Date(NaN)],
//   ])('args: %p; returns %p', (arg1, expectedResult) => {
//     expect(getMonthStart(arg1)).toEqual(expectedResult);
//   });
// });
