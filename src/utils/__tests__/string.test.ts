import {getRandomId} from '@/utils/string';

describe('getRandomId', () => {
  it('returns a valid v4 UUID', () => {
    expect(getRandomId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('returns a unique value on each call', () => {
    const ids = Array.from({length: 50}, getRandomId);
    expect(new Set(ids).size).toBe(50);
  });
});
