import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Breed } from '../types/breed';
import { FavoritesScreenProps } from '../types/navigation';
import { useBreedStore } from '../store/useBreedStore';
import { useTheme } from '../theme/ThemeContext';
import { BreedCard } from '../components/breedList/BreedCard';
import { OfflineBanner } from '../components/common/OfflineBanner';

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const favorites = useBreedStore((s) => s.favorites);
  const breedsById = useBreedStore((s) => s.breedsById);

  const favoriteBreeds = useMemo(() => {
    return favorites
      .map((id) => breedsById[id])
      .filter((breed): breed is Breed => Boolean(breed));
  }, [favorites, breedsById]);

  const handleBreedPress = useCallback(
    (breedId: string) => {
      navigation.navigate('BreedDetail', { breedId });
    },
    [navigation]
  );

  const renderBreedItem = useCallback(
    ({ item }: { item: Breed }) => (
      <BreedCard breed={item} onPress={() => handleBreedPress(item.id)} />
    ),
    [handleBreedPress]
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={56} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Favorite Breeds Yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Tap the heart icon on any breed card in the Explore tab to save your favorite dogs here for fast access.
      </Text>
      <TouchableOpacity
        style={[styles.exploreBtn, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={styles.exploreBtnText}>Browse Breeds</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <OfflineBanner />

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={24} color={colors.danger} />
          <Text style={[styles.title, { color: colors.text }]}>Favorite Breeds</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.countText, { color: colors.primaryDark }]}>
            {favoriteBreeds.length} saved
          </Text>
        </View>
      </View>

      <FlatList
        data={favoriteBreeds}
        keyExtractor={(item) => item.id}
        renderItem={renderBreedItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
