import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Breed } from '../types/breed';
import { BreedListScreenProps } from '../types/navigation';
import { useBreedFilters } from '../hooks/useBreedFilters';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useBreedStore } from '../store/useBreedStore';
import { useTheme } from '../theme/ThemeContext';
import { BreedCard } from '../components/breedList/BreedCard';
import { FilterModal } from '../components/breedList/FilterModal';
import { ListHeader } from '../components/breedList/ListHeader';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { SkeletonCard } from '../components/common/SkeletonCard';

const ITEM_HEIGHT = 96; // Fixed height for getItemLayout optimization

export const BreedListScreen: React.FC<BreedListScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  useNetworkStatus();

  const isHydrated = useBreedStore((s) => s.isHydrated);
  const isSyncing = useBreedStore((s) => s.isSyncing);
  const breedsById = useBreedStore((s) => s.breedsById);
  const breedIds = useBreedStore((s) => s.breedIds);
  const syncAllData = useBreedStore((s) => s.syncAllData);

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Derive flat breeds list from normalized store
  const allBreeds = useMemo(
    () => breedIds.map((id) => breedsById[id]).filter(Boolean),
    [breedIds, breedsById]
  );

  const {
    filters,
    setFilters,
    filteredBreeds,
    groupedSections,
    resetFilters,
  } = useBreedFilters(allBreeds);

  const handleRefresh = useCallback(() => {
    syncAllData();
  }, [syncAllData]);

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

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: Breed) => item.id, []);

  // Empty state when filters yield zero results
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color={colors.textMuted} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Breeds Found</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Try adjusting your search query or loosening your filter criteria.
      </Text>
      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: colors.primary }]}
        onPress={resetFilters}
      >
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </TouchableOpacity>
    </View>
  );

  const isInitialLoading = !isHydrated || (allBreeds.length === 0 && isSyncing);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <OfflineBanner />

      <ListHeader
        filters={filters}
        onFilterChange={setFilters}
        onOpenFilterModal={() => setFilterModalVisible(true)}
        totalResults={filteredBreeds.length}
        totalAllBreeds={allBreeds.length}
      />

      {isInitialLoading ? (
        <View style={styles.skeletonList}>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : filters.groupByGroup ? (
        <SectionList
          sections={groupedSections}
          keyExtractor={keyExtractor}
          renderItem={renderBreedItem}
          renderSectionHeader={({ section: { title, data } }) => (
            <View
              style={[
                styles.sectionHeader,
                { backgroundColor: colors.background, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.sectionHeaderText, { color: colors.text }]}>
                {title}
              </Text>
              <View style={[styles.sectionBadge, { backgroundColor: colors.badgeBg }]}>
                <Text style={[styles.sectionBadgeText, { color: colors.badgeText }]}>
                  {data.length}
                </Text>
              </View>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isSyncing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={filteredBreeds}
          keyExtractor={keyExtractor}
          renderItem={renderBreedItem}
          getItemLayout={getItemLayout}
          refreshControl={
            <RefreshControl
              refreshing={isSyncing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          contentContainerStyle={styles.listContent}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onApply={setFilters}
        onClose={() => setFilterModalVisible(false)}
        onReset={resetFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  skeletonList: {
    flex: 1,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
