import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { BreedImage } from '../../types/breed';
import { useTheme } from '../../theme/ThemeContext';
import { getOptimizedImageUrl } from '../../utils/imageCacheManager';

interface Props {
  images: BreedImage[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32;

export const GalleryTab: React.FC<Props> = ({ images }) => {
  const { colors, borderRadius, shadows } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<BreedImage | null>(null);
  const flatListRef = useRef<FlatList>(null);

  if (!images || images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No gallery images available for this breed.
        </Text>
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / CAROUSEL_WIDTH
    );
    if (slide !== activeIndex && slide >= 0 && slide < images.length) {
      setActiveIndex(slide);
    }
  };

  const handleSelectThumbnail = (index: number) => {
    setActiveIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.warn('Cannot open url:', err)
      );
    }
  };

  const currentImage = images[activeIndex] || images[0];
  const { attribution } = currentImage;

  return (
    <View style={styles.container}>
      {/* Main Swipeable Carousel */}
      <View style={[styles.carouselCard, shadows.card, { backgroundColor: colors.card, borderRadius: borderRadius.lg }]}>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            // Upgrade to medium tier for detail gallery
            const imageUrl = getOptimizedImageUrl(item, 'medium') || item.url;
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setFullscreenImage(item)}
                style={{ width: CAROUSEL_WIDTH, height: 260 }}
              >
                <ExpoImage
                  source={{ uri: imageUrl }}
                  style={[styles.carouselImage, { borderRadius: borderRadius.md }]}
                  contentFit="cover"
                  transition={200}
                  cachePolicy="disk"
                />
                <View style={styles.zoomHint}>
                  <Ionicons name="expand" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Counter Badge */}
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      </View>

      {/* Thumbnail Navigation Strip */}
      <View style={styles.thumbnailStrip}>
        {images.map((img, idx) => {
          const isSelected = idx === activeIndex;
          const thumbUrl = getOptimizedImageUrl(img, 'thumb') || img.url;
          return (
            <TouchableOpacity
              key={img.id}
              onPress={() => handleSelectThumbnail(idx)}
              style={[
                styles.thumbButton,
                {
                  borderColor: isSelected ? colors.primary : 'transparent',
                  borderRadius: borderRadius.sm,
                },
              ]}
              activeOpacity={0.7}
            >
              <ExpoImage
                source={{ uri: thumbUrl }}
                style={[styles.stripThumbnail, { borderRadius: borderRadius.xs }]}
                contentFit="cover"
                cachePolicy="disk"
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Photo Attribution Card */}
      <View
        style={[
          styles.attributionCard,
          shadows.subtle,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <View style={styles.attributionHeader}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.attributionTitle, { color: colors.text }]}>
            Photo Attribution
          </Text>
        </View>

        <View style={styles.attrRow}>
          <Text style={[styles.attrLabel, { color: colors.textMuted }]}>Author:</Text>
          <Text style={[styles.attrValue, { color: colors.text }]}>
            {attribution.author || 'Unknown'}
          </Text>
        </View>

        <View style={styles.attrRow}>
          <Text style={[styles.attrLabel, { color: colors.textMuted }]}>License:</Text>
          {attribution.licenseUrl ? (
            <TouchableOpacity
              onPress={() => openUrl(attribution.licenseUrl)}
              style={styles.linkWrap}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                {attribution.license || 'View License'}
              </Text>
              <Ionicons name="open-outline" size={13} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.attrValue, { color: colors.text }]}>
              {attribution.license || 'Public Domain'}
            </Text>
          )}
        </View>

        <View style={styles.attrRow}>
          <Text style={[styles.attrLabel, { color: colors.textMuted }]}>Source:</Text>
          {attribution.sourceUrl ? (
            <TouchableOpacity
              onPress={() => openUrl(attribution.sourceUrl)}
              style={styles.linkWrap}
            >
              <Text
                style={[styles.linkText, { color: colors.primary }]}
                numberOfLines={1}
              >
                {attribution.source || 'Original Source'}
              </Text>
              <Ionicons name="open-outline" size={13} color={colors.primary} />
            </TouchableOpacity>
          ) : (
            <Text style={[styles.attrValue, { color: colors.text }]}>
              {attribution.source || 'dogapi.dog'}
            </Text>
          )}
        </View>
      </View>

      {/* Fullscreen Lightbox Modal */}
      <Modal
        visible={!!fullscreenImage}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreenImage(null)}
      >
        <View style={styles.fullscreenOverlay}>
          <TouchableOpacity
            style={styles.closeFullscreenBtn}
            onPress={() => setFullscreenImage(null)}
          >
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {fullscreenImage && (
            <ExpoImage
              // Upgrade to large tier for full-screen inspection
              source={{
                uri:
                  getOptimizedImageUrl(fullscreenImage, 'large') ||
                  fullscreenImage.url,
              }}
              style={styles.fullscreenImage}
              contentFit="contain"
              cachePolicy="disk"
            />
          )}

          {fullscreenImage && (
            <View style={styles.fullscreenCaption}>
              <Text style={styles.fullscreenAuthor}>
                © {fullscreenImage.attribution.author} • {fullscreenImage.attribution.license}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  carouselCard: {
    overflow: 'hidden',
    position: 'relative',
    height: 260,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  zoomHint: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 6,
  },
  counterBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  thumbnailStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  thumbButton: {
    borderWidth: 2,
    padding: 1,
  },
  stripThumbnail: {
    width: 48,
    height: 48,
  },
  attributionCard: {
    padding: 16,
    borderWidth: 1,
  },
  attributionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  attributionTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  attrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  attrLabel: {
    width: 70,
    fontSize: 13,
    fontWeight: '500',
  },
  attrValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  linkWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeFullscreenBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  fullscreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.1,
  },
  fullscreenCaption: {
    position: 'absolute',
    bottom: 32,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    borderRadius: 8,
  },
  fullscreenAuthor: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
