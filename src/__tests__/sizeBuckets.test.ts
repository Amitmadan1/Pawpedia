import { deriveSizeBand, getSizeBandLabel } from '../utils/sizeBuckets';

describe('sizeBuckets utility', () => {
  it('classifies small dogs (<= 10kg)', () => {
    const size = deriveSizeBand({ min: 4, max: 6 }, { min: 4, max: 6 });
    expect(size).toBe('small');
    expect(getSizeBandLabel(size)).toContain('Small');
  });

  it('classifies medium dogs (11 - 25kg)', () => {
    const size = deriveSizeBand({ min: 14, max: 20 }, { min: 12, max: 18 });
    expect(size).toBe('medium');
    expect(getSizeBandLabel(size)).toContain('Medium');
  });

  it('classifies large dogs (26 - 45kg)', () => {
    const size = deriveSizeBand({ min: 30, max: 40 }, { min: 28, max: 35 });
    expect(size).toBe('large');
    expect(getSizeBandLabel(size)).toContain('Large');
  });

  it('classifies giant dogs (> 45kg)', () => {
    const size = deriveSizeBand({ min: 50, max: 70 }, { min: 45, max: 60 });
    expect(size).toBe('giant');
    expect(getSizeBandLabel(size)).toContain('Giant');
  });

  it('falls back to height if weight is missing', () => {
    const smallByHeight = deriveSizeBand(undefined, undefined, { min: 20, max: 30 });
    expect(smallByHeight).toBe('small');

    const giantByHeight = deriveSizeBand(undefined, undefined, { min: 75, max: 85 });
    expect(giantByHeight).toBe('giant');
  });

  it('defaults to medium when no data is provided', () => {
    expect(deriveSizeBand()).toBe('medium');
  });
});
