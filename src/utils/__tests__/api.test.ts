import {attachQueryParams} from '@/utils/api';

describe('attachQueryParams', () => {
  it('returns url unchanged for null', () => {
    expect(attachQueryParams('http://localhost/api', null)).toBe('http://localhost/api');
  });

  it('returns url unchanged for an array', () => {
    expect(attachQueryParams('http://localhost/api', [1, 2])).toBe('http://localhost/api');
  });

  it('returns url unchanged for FormData', () => {
    expect(attachQueryParams('http://localhost/api', new FormData())).toBe('http://localhost/api');
  });

  it('returns url unchanged for File', () => {
    const file = new File([''], 'test.txt');
    expect(attachQueryParams('http://localhost/api', file)).toBe('http://localhost/api');
  });

  it('returns url unchanged for a non-object primitive', () => {
    expect(attachQueryParams('http://localhost/api', 'string')).toBe('http://localhost/api');
    expect(attachQueryParams('http://localhost/api', 42)).toBe('http://localhost/api');
  });

  it('appends params to a clean URL', () => {
    const result = attachQueryParams('http://localhost/api', {foo: 'bar', baz: 'qux'});
    const url = new URL(result);
    expect(url.searchParams.get('foo')).toBe('bar');
    expect(url.searchParams.get('baz')).toBe('qux');
  });

  it('merges into URL that already has existing query params', () => {
    const result = attachQueryParams('http://localhost/api?existing=1', {added: '2'});
    const url = new URL(result);
    expect(url.searchParams.get('existing')).toBe('1');
    expect(url.searchParams.get('added')).toBe('2');
  });

  it('preserves #fragment', () => {
    const result = attachQueryParams('http://localhost/api#section', {q: 'test'});
    expect(result).toContain('#section');
    expect(result).toContain('q=test');
  });

  it('filters out null and undefined values', () => {
    const result = attachQueryParams('http://localhost/api', {keep: 'yes', skip: null, also: undefined});
    const url = new URL(result);
    expect(url.searchParams.get('keep')).toBe('yes');
    expect(url.searchParams.has('skip')).toBe(false);
    expect(url.searchParams.has('also')).toBe(false);
  });

  it('coerces numbers to strings', () => {
    const result = attachQueryParams('http://localhost/api', {page: 2, size: 10});
    const url = new URL(result);
    expect(url.searchParams.get('page')).toBe('2');
    expect(url.searchParams.get('size')).toBe('10');
  });

  it('coerces booleans to strings', () => {
    const result = attachQueryParams('http://localhost/api', {active: true, deleted: false});
    const url = new URL(result);
    expect(url.searchParams.get('active')).toBe('true');
    expect(url.searchParams.get('deleted')).toBe('false');
  });
});
