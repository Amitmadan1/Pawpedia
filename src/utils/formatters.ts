import { NumericRange } from '../types/breed';

export function formatTimeAgo(timestamp: number | null): string {
  if (!timestamp) return 'Never synced';
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) {
    return 'Last synced just now';
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `Last synced ${diffMin} ${diffMin === 1 ? 'min' : 'mins'} ago`;
  }
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) {
    return `Last synced ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `Last synced ${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
}

export function formatRange(range?: NumericRange, unit = ''): string {
  if (!range) return 'N/A';
  if (range.min === range.max) {
    return `${range.min}${unit ? ' ' + unit : ''}`;
  }
  return `${range.min}–${range.max}${unit ? ' ' + unit : ''}`;
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
