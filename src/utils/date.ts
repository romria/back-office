import {MS_PER_DAY} from '@/constants';

enum WEEKDAYS {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

export const isDate = (val: unknown): val is Date => Object.prototype.toString.call(val) === '[object Date]';
export const isValid = (val: Date): boolean => !Number.isNaN((val).getTime());
export const isValidDate = (val: unknown): val is Date => isDate(val) && isValid(val);

const DATE_FORMAT_SHORT = new Intl.DateTimeFormat('en-GB', {month: 'short', day: 'numeric', year: 'numeric'});
const DATE_FORMAT_FULL = new Intl.DateTimeFormat('en-GB', {month: 'short', day: 'numeric', year: 'numeric', hourCycle: 'h23', hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short'});
const TIME_FORMAT_SHORT = new Intl.DateTimeFormat('en-US', {hourCycle: 'h23', hour: '2-digit', minute: '2-digit'});
const DATE_FORMAT_API = new Intl.DateTimeFormat('fr-CA', {year: 'numeric', month: '2-digit', day: '2-digit'});
const DATE_FORMAT_TABLE = new Intl.DateTimeFormat('en-US', {month: 'long', day: '2-digit', year: 'numeric'});
const DATE_FORMAT_TABLE_SHORT = new Intl.DateTimeFormat('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
const DATE_FORMAT_DOT = new Intl.DateTimeFormat('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'});
const DATE_FORMAT_SLASH = new Intl.DateTimeFormat('en-GB');

export enum DateFormat {
  API = 'moment("YYYY-MM-DD")',
  Short = 'moment("MMM D YYYY")',
  Full = 'moment("MMM D YYYY, HH:mm z")',
  Table = 'moment("MMMM DD, YYYY")',
  TableWithTime = 'moment("MMM D, YYYY HH:mm")',
  Dot = 'moment("DD.MM.YYYY")',
  Slash = 'moment("DD/MM/YYYY")',
}

const formatDate = (date: Date, format: DateFormat | string): string => {
  if (!isValid(date)) return '';

  switch (format) {
    case DateFormat.API:
      return DATE_FORMAT_API.format(date);
    case DateFormat.Short:
      return DATE_FORMAT_SHORT.format(date);
    case DateFormat.Full:
      return DATE_FORMAT_FULL.format(date);
    case DateFormat.Table:
      return DATE_FORMAT_TABLE.format(date);
    case DateFormat.TableWithTime:
      return `${DATE_FORMAT_TABLE_SHORT.format(date)} ${TIME_FORMAT_SHORT.format(date)}`;
    case DateFormat.Dot:
      return DATE_FORMAT_DOT.format(date);
    case DateFormat.Slash:
      return DATE_FORMAT_SLASH.format(date);
    default:
      return new Intl.DateTimeFormat(format).format(date);
  }
};

/**
   * Validate and format a date into it's string representation
   *
   * @param date - The {Date} object, a date {string} or a timestamp {number} be formatted
   * @param fmt - {DateFormat} enum value or a {string} which represents selected Locale
   * @returns The formatted string
   */
export const format = (date: Date | string | number | undefined, fmt: DateFormat | string): string => {
  if (date == null) return '';

  return formatDate(
    isDate(date) ? date : new Date(date),
    fmt,
  );
}

export const parseStringDate = (d: string): Date | undefined => {
  if (typeof d !== 'string') return undefined;
  const parsed = Date.parse(d);
  if (Number.isNaN(parsed)) return undefined;
  const isTimePresent = d.includes('T');
  const raw = isTimePresent ? `${d}Z` : d; // back-end fix required to include zero UTC offset symbol

  const date = new Date(raw);

  if (!isTimePresent) {
    date.setHours(0, 0, 0, 0);
  }
  return date;
};

export const isSameDate = (a: Date | undefined, b: Date | undefined): boolean => {
  if (!isValidDate(a) || !isValidDate(b)) return false;

  return (
    a?.getDate() === b?.getDate()
    && a?.getMonth() === b?.getMonth()
    && a?.getFullYear() === b?.getFullYear()
  );
};

export const isEqualDates = (a: Date | undefined, b: Date | undefined): boolean => {
  if (a !== undefined && b !== undefined) {
    return a.valueOf() === b.valueOf();
  }
  return a === b;
};

export const getMonthStart = (date: Date): Date => {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  return new Date(base.getFullYear(), base.getMonth(), 1);
};

export const getMonthEnd = (date: Date): Date => {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  return new Date(base.getFullYear(), base.getMonth() + 1, 0);
};

export const getTomorrowDate = (): Date => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 1);

  return date;
};

export const isFutureDate = (date: Date): boolean => date >= getTomorrowDate();

export const getDateDiffInDays = (a: Date, b: Date): number => {
  if (!isValidDate(a) || !isValidDate(b)) return 0;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / MS_PER_DAY);
};

export const getMonthAgo = (date: Date): Date => {
  const thisMonth = date.getMonth();
  const monthAgo = new Date(date);
  monthAgo.setHours(0, 0, 0, 0);
  monthAgo.setMonth(thisMonth - 1);

  // If still in same month, set date to the last day of previous month
  if (monthAgo.getMonth() === thisMonth) {
    monthAgo.setDate(0);
  }

  return monthAgo;
};

export const getMonthAhead = (date: Date): Date => {
  const thisMonth = date.getMonth();
  const monthAhead = new Date(date);
  monthAhead.setHours(0, 0, 0, 0);
  monthAhead.setMonth(thisMonth + 1);

  // If jumped two months ahead, set date to last day of previous month
  if (monthAhead.getMonth() - thisMonth > 1) {
    monthAhead.setDate(0);
  }

  return monthAhead;
};

export const subYears = (date: Date, years: number): Date => {
  // if (!isValidDate(date)) return null;
  const result = new Date(date);
  // result.setHours(0, 0, 0, 0);

  result.setFullYear(result.getFullYear() + years);

  if (date.getMonth() !== result.getMonth()) { // Feb 29th case
    result.setDate(0);
  }

  return result;
};

export const subMonths = (date: Date, months: number): Date => {
  // if (!isValidDate(date)) return null;
  const thisMonth = date.getMonth();
  const result = new Date(date);
  // result.setHours(0, 0, 0, 0);
  result.setMonth(thisMonth + months);

  if (
    months > 0 && result.getMonth() - thisMonth > 1 // If jumped two months ahead
    || months < 0 && result.getMonth() === thisMonth // If jumped two months before
  ) {
    result.setDate(0); // set date to last day of previous month
  }

  return result;
}

export const getYearAgo = (date: Date): Date => subYears(date, -1);
export const getYearAhead = (date: Date): Date => subYears(date, 1);

// returns 42 days (6 weeks) to be rendered in the calendar widget
export const getCalendarDatesByDate = (date: Date): Date[] => {
  const base = new Date(date);
  base.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(base.getFullYear(), base.getMonth(), WEEKDAYS.MONDAY);
  // const lastDayOfMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0);

  const firstDayOfWeek = firstDayOfMonth.getDay();
  const diffBeforePrevMonday = firstDayOfMonth.getDate() - firstDayOfWeek + (firstDayOfWeek === 0 ? -6 : 1);
  firstDayOfMonth.setDate(diffBeforePrevMonday);

  // const lastDayOfWeek = lastDayOfMonth.getDay();
  // const diffToNextSunday = lastDayOfMonth.getDate() + (WEEKDAYS.SUNDAY + (7 - lastDayOfWeek)) % 7;
  // lastDayOfMonth.setDate(diffToNextSunday);

  const result: Date[] = [];
  // for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth; d.setDate(d.getDate() + 1)) {
  for (let d = new Date(firstDayOfMonth), i = 0; i < 42; d.setDate(d.getDate() + 1), ++i) {
    result.push(new Date(d));
  }

  return result;
};

export enum DateRangePreset {
  TODAY = 'Today',
  YESTERDAY = 'Yesterday',
  LAST_7_DAYS = 'Last 7 days',
  LAST_30_DAYS = 'Last 30 days',
}

export interface DateRange {
  dateFrom?: Date | undefined
  dateTo?: Date | undefined
  datePreset?: DateRangePreset | undefined
}

export const DateRangePresetValues = Object.values(DateRangePreset);

export const getDatesByPreset = (preset: DateRangePreset): {dateFrom: Date, dateTo: Date} => {
  const dateTo = new Date();
  const dateFrom = new Date(dateTo);

  switch (preset) {
    case DateRangePreset.YESTERDAY:
      dateTo.setDate(dateTo.getDate() - 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      break;
    case DateRangePreset.LAST_7_DAYS:
      dateFrom.setDate(dateTo.getDate() - 7);
      break;
    case DateRangePreset.LAST_30_DAYS:
      dateFrom.setDate(dateTo.getDate() - 30);
      break;
    case DateRangePreset.TODAY:
    default:
      break;
  }

  dateTo.setHours(0, 0, 0, 0);
  dateFrom.setHours(0, 0, 0, 0);

  return {dateFrom, dateTo};
};

export const getPresetByDates = ({dateFrom, dateTo}: {dateFrom?: Date, dateTo?: Date}): DateRangePreset | undefined => {
  if (dateFrom === undefined || dateTo === undefined) return undefined;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const daysDiff = getDateDiffInDays(dateFrom, dateTo);
  const dateToIsYesterday = getDateDiffInDays(dateTo, yesterday) === 0;
  const dateToIsToday = getDateDiffInDays(dateTo, today) === 0;

  if (dateToIsYesterday && daysDiff === 0) {
    return DateRangePreset.YESTERDAY;
  }
  if (dateToIsToday) {
    if (daysDiff === 0) {
      return DateRangePreset.TODAY;
    }
    if (daysDiff === 7) {
      return DateRangePreset.LAST_7_DAYS;
    }
    if (daysDiff === 30) {
      return DateRangePreset.LAST_30_DAYS;
    }
  }

  return undefined;
};
