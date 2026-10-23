import { Image as ExpoImage } from 'expo-image';
import { BreedImage } from '../types/breed';

export type ImageQualityTier = 'thumb' | 'medium' | 'large';

export interface ImageCacheConfig {
  maxDiskCacheMB: number;
  maxMemoryCacheMB: number;
}

export const DEFAULT_IMAGE_CACHE_CONFIG: ImageCacheConfig = {
  maxDiskCacheMB: 100,
  maxMemoryCacheMB: 40,
};

/**
 * Chooses the appropriate image variant URL according to the current screen tier.
 * - 'thumb' for high-performance 60fps list item thumbnails.
 * - 'medium' for detail screen hero overview.
 * - 'large' for full-screen gallery view and pinch-to-zoom.
 */
export function getOptimizedImageUrl(
  image: BreedImage | null | undefined,
  tier: ImageQualityTier = 'thumb'
): string | null {
  if (!image) return null;

  switch (tier) {
    case 'thumb':
      return image.thumb || image.url;
    case 'medium':
      return image.medium || image.large || image.url;
    case 'large':
      return image.large || image.medium || image.url;
  }
}

/**
 * Pre-fetches high-resolution images when entering detail view
 * to ensure instant swipe transitions in the gallery.
 */
export async function prefetchGalleryImages(images: BreedImage[]): Promise<void> {
  const urlsToPrefetch = images
    .slice(0, 5) // Prefetch first 5 medium variants to balance memory
    .map((img) => img.medium || img.url)
    .filter(Boolean);

  try {
    await ExpoImage.prefetch(urlsToPrefetch);
  } catch (err) {
    console.warn('Image prefetch warning:', err);
  }
}

/**
 * Clears memory cache if low-memory warning is triggered.
 */
export async function clearImageMemoryCache(): Promise<void> {
  try {
    await ExpoImage.clearMemoryCache();
  } catch (err) {
    console.warn('Failed to clear image memory cache:', err);
  }
}
