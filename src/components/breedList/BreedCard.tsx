import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Breed } from '../../types/breed';
import { useBreedStore } from '../../store/useBreedStore';
import { useTheme } from '../../theme/ThemeContext';
import { getOptimizedImageUrl } from '../../utils/imageCacheManager';
import { getSizeBandLabel } from '../../utils/sizeBuckets';

interface Props {
  breed: Breed;
  onPress: () => void;
}

export const BreedCard: React.FC<Props> = React.memo(
  ({ breed, onPress }) => {
    const { colors, borderRadius, shadows } = useTheme();
    const isFavorite = useBreedStore((s) => s.favorites.includes(breed.id));
    const toggleFavorite = useBreedStore((s) => s.toggleFavorite);

    // List view strictly uses the 'thumb' tier for 60fps performance and low memory
    const thumbUrl = getOptimizedImageUrl(breed.primaryImage, 'thumb');

    return (
      <TouchableOpacity
        style={[
          styles.container,
          shadows.subtle,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.imageWrap}>
          {thumbUrl ? (
            <ExpoImage
              source={{ uri: thumbUrl }}
              style={[styles.image, { borderRadius: borderRadius.md }]}
              contentFit="cover"
              transition={150}
              cachePolicy="disk"
            />
          ) : (
            <View
              style={[
                styles.imageFallback,
                { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md },
              ]}
            >
              <Ionicons name="paw" size={32} color={colors.textMuted} />
            </View>
          )}

          {breed.hypoallergenic && (
            <View
              style={[
                styles.hypoBadge,
                { backgroundColor: colors.accent, borderRadius: borderRadius.round },
              ]}
            >
              <Ionicons name="leaf" size={10} color="#FFFFFF" />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {breed.name}
            </Text>
            <TouchableOpacity
              onPress={() => toggleFavorite(breed.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? colors.danger : colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={[styles.groupName, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {breed.groupName}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.pill, { backgroundColor: colors.badgeBg }]}>
              <Text style={[styles.pillText, { color: colors.badgeText }]}>
                {getSizeBandLabel(breed.sizeBand).split(' ')[0]}
              </Text>
            </View>

            <View style={[styles.pill, { backgroundColor: colors.badgeBg }]}>
              <Text style={[styles.pillText, { color: colors.badgeText }]}>
                {breed.coat.length}
              </Text>
            </View>

            <View style={styles.traitPreview}>
              <Ionicons name="flash" size={12} color={colors.primary} />
              <Text style={[styles.traitValue, { color: colors.textSecondary }]}>
                {breed.traits.energy}/5
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
  (prev, next) => {
    // Custom memo comparator for high-frequency list rendering
    return (
      prev.breed.id === next.breed.id &&
      prev.breed.updatedAt === next.breed.updatedAt
    );
  }
);

BreedCard.displayName = 'BreedCard';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    alignItems: 'center',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: 76,
    height: 76,
  },
  imageFallback: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hypoBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    padding: 3,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  groupName: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  traitPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 2,
  },
  traitValue: {
    fontSize: 11,
    fontWeight: '600',
  },
});
