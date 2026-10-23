import { capitalize, formatRange, formatTimeAgo } from '../utils/formatters';

describe('formatters', () => {
  it('formats range correctly', () => {
    expect(formatRange({ min: 10, max: 15 }, 'years')).toBe('10–15 years');
    expect(formatRange({ min: 12, max: 12 }, 'kg')).toBe('12 kg');
    expect(formatRange(undefined)).toBe('N/A');
  });

  it('formats time ago correctly', () => {
    expect(formatTimeAgo(null)).toBe('Never synced');

    const now = Date.now();
    expect(formatTimeAgo(now - 10 * 1000)).toBe('Last synced just now');
    expect(formatTimeAgo(now - 5 * 60 * 1000)).toBe('Last synced 5 mins ago');
    expect(formatTimeAgo(now - 2 * 3600 * 1000)).toBe('Last synced 2 hours ago');
  });

  it('capitalizes strings', () => {
    expect(capitalize('short')).toBe('Short');
    expect(capitalize('')).toBe('');
  });
});
