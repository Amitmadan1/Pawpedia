import { NumericRange, SizeBand } from '../types/breed';

/**
 * Derives a size band category (small, medium, large, giant)
 * based on canine weight and height ranges.
 */
export function deriveSizeBand(
  maleWeight?: Partial<NumericRange>,
  femaleWeight?: Partial<NumericRange>,
  maleHeight?: Partial<NumericRange>,
  femaleHeight?: Partial<NumericRange>
): SizeBand {
  // Use average or max representative weight (kg)
  const weights: number[] = [];
  if (maleWeight?.max) weights.push(maleWeight.max);
  if (maleWeight?.min) weights.push(maleWeight.min);
  if (femaleWeight?.max) weights.push(femaleWeight.max);
  if (femaleWeight?.min) weights.push(femaleWeight.min);

  if (weights.length > 0) {
    const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
    if (avgWeight <= 10) return 'small';
    if (avgWeight <= 25) return 'medium';
    if (avgWeight <= 45) return 'large';
    return 'giant';
  }

  // Fallback to height (cm)
  const heights: number[] = [];
  if (maleHeight?.max) heights.push(maleHeight.max);
  if (maleHeight?.min) heights.push(maleHeight.min);
  if (femaleHeight?.max) heights.push(femaleHeight.max);
  if (femaleHeight?.min) heights.push(femaleHeight.min);

  if (heights.length > 0) {
    const avgHeight = heights.reduce((a, b) => a + b, 0) / heights.length;
    if (avgHeight <= 35) return 'small';
    if (avgHeight <= 55) return 'medium';
    if (avgHeight <= 70) return 'large';
    return 'giant';
  }

  return 'medium';
}

export function getSizeBandLabel(size: SizeBand): string {
  switch (size) {
    case 'small':
      return 'Small (≤10kg)';
    case 'medium':
      return 'Medium (11–25kg)';
    case 'large':
      return 'Large (26–45kg)';
    case 'giant':
      return 'Giant (>45kg)';
  }
}
