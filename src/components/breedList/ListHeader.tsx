import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterState } from '../../types/filters';
import { useBreedStore } from '../../store/useBreedStore';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onOpenFilterModal: () => void;
  totalResults: number;
  totalAllBreeds: number;
}

export const ListHeader: React.FC<Props> = ({
  filters,
  onFilterChange,
  onOpenFilterModal,
  totalResults,
  totalAllBreeds,
}) => {
  const { colors, isDark, toggleTheme, borderRadius } = useTheme();
  const groupsById = useBreedStore((s) => s.groupsById);

  const activeFiltersCount =
    (filters.selectedGroups.length > 0 ? 1 : 0) +
    (filters.selectedSizes.length > 0 ? 1 : 0) +
    (filters.selectedCoats.length > 0 ? 1 : 0) +
    (filters.hypoallergenic !== 'all' ? 1 : 0) +
    (Object.keys(filters.traitThresholds).length > 0 ? 1 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <View style={styles.titleRow}>
          <Text style={styles.logoEmoji}>🐾</Text>
          <View>
            <Text style={[styles.appTitle, { color: colors.text }]}>Pawpedia</Text>
            <Text style={[styles.appSubtitle, { color: colors.textSecondary }]}>
              Dog Breed Explorer
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {/* Group View Toggle */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: filters.groupByGroup
                  ? colors.primaryLight
                  : colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() =>
              onFilterChange({ ...filters, groupByGroup: !filters.groupByGroup })
            }
          >
            <Ionicons
              name={filters.groupByGroup ? 'layers' : 'list'}
              size={18}
              color={filters.groupByGroup ? colors.primaryDark : colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[
              styles.iconBtn,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
            onPress={toggleTheme}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchRow}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search by breed or alias..."
            placeholderTextColor={colors.textMuted}
            value={filters.searchQuery}
            onChangeText={(text) =>
              onFilterChange({ ...filters, searchQuery: text })
            }
            autoCapitalize="none"
            autoCorrect={false}
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onFilterChange({ ...filters, searchQuery: '' })}
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Modal Trigger */}
        <TouchableOpacity
          style={[
            styles.filterBtn,
            {
              backgroundColor: activeFiltersCount > 0 ? colors.primary : colors.card,
              borderColor: activeFiltersCount > 0 ? colors.primary : colors.cardBorder,
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={onOpenFilterModal}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFiltersCount > 0 ? '#FFFFFF' : colors.text}
          />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Count & View Indicator */}
      <View style={styles.subBar}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          Showing {totalResults} of {totalAllBreeds} breeds
        </Text>
        <Text style={[styles.groupIndicator, { color: colors.textMuted }]}>
          {filters.groupByGroup ? 'Grouped by category' : 'Alphabetical list'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 28,
    marginRight: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  subBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 2,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  groupIndicator: {
    fontSize: 11,
    fontWeight: '500',
  },
});
