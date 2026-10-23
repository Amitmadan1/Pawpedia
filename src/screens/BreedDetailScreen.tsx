import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { BreedDetailScreenProps } from '../types/navigation';
import { useBreedStore } from '../store/useBreedStore';
import { useTheme } from '../theme/ThemeContext';
import { GalleryTab } from '../components/breedDetail/GalleryTab';
import { OverviewTab } from '../components/breedDetail/OverviewTab';
import { TabBar, DetailTab } from '../components/breedDetail/TabBar';
import { TraitsTab } from '../components/breedDetail/TraitsTab';
import { OfflineBanner } from '../components/common/OfflineBanner';
import {
  getOptimizedImageUrl,
  prefetchGalleryImages,
} from '../utils/imageCacheManager';

export const BreedDetailScreen: React.FC<BreedDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { breedId } = route.params;
  const { colors, borderRadius, shadows } = useTheme();

  const breed = useBreedStore((s) => s.breedsById[breedId]);
  const isFavorite = useBreedStore((s) => s.favorites.includes(breedId));
  const toggleFavorite = useBreedStore((s) => s.toggleFavorite);
  const refreshBreed = useBreedStore((s) => s.refreshBreed);

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pre-fetch gallery images when entering detail view
  useEffect(() => {
    if (breed?.images && breed.images.length > 0) {
      prefetchGalleryImages(breed.images);
    }
  }, [breed?.images]);

  if (!breed) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>Breed Not Found</Text>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Back to Explorer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleRefreshDetail = async () => {
    setIsRefreshing(true);
    await refreshBreed(breedId);
    setIsRefreshing(false);
  };

  // Hero uses medium tier image
  const heroImageUrl =
    getOptimizedImageUrl(breed.primaryImage, 'medium') || breed.primaryImage?.url;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <OfflineBanner />

      {/* Header bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
            {breed.name}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {breed.groupName}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* Refresh / Enrich breed */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={handleRefreshDetail}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="sync-outline" size={22} color={colors.text} />
            )}
          </TouchableOpacity>

          {/* Favorite toggle */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => toggleFavorite(breedId)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.danger : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={styles.heroWrap}>
          {heroImageUrl ? (
            <ExpoImage
              source={{ uri: heroImageUrl }}
              style={styles.heroImage}
              contentFit="cover"
              transition={200}
              cachePolicy="disk"
            />
          ) : (
            <View style={[styles.heroFallback, { backgroundColor: colors.badgeBg }]}>
              <Ionicons name="paw" size={64} color={colors.textMuted} />
            </View>
          )}

          <View style={styles.heroOverlay}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.heroBadgeText}>{breed.groupName}</Text>
            </View>
            {breed.hypoallergenic && (
              <View style={[styles.heroBadge, { backgroundColor: colors.accent }]}>
                <Text style={styles.heroBadgeText}>Hypoallergenic</Text>
              </View>
            )}
          </View>
        </View>

        {/* Tab Switcher */}
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          galleryCount={breed.images.length}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab breed={breed} />}
        {activeTab === 'traits' && <TraitsTab breed={breed} />}
        {activeTab === 'gallery' && <GalleryTab images={breed.images} />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitleWrap: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroWrap: {
    position: 'relative',
    width: '100%',
    height: 240,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 20,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
