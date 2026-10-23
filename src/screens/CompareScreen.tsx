import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Breed } from '../types/breed';
import { CompareScreenProps } from '../types/navigation';
import { useBreedStore } from '../store/useBreedStore';
import { useTheme } from '../theme/ThemeContext';
import { formatRange } from '../utils/formatters';
import { getOptimizedImageUrl } from '../utils/imageCacheManager';
import { getSizeBandLabel } from '../utils/sizeBuckets';
import { OfflineBanner } from '../components/common/OfflineBanner';

export const CompareScreen: React.FC<CompareScreenProps> = ({ navigation }) => {
  const { colors, borderRadius, shadows } = useTheme();
  const breedsById = useBreedStore((s) => s.breedsById);
  const breedIds = useBreedStore((s) => s.breedIds);

  const allBreeds = useMemo(
    () => breedIds.map((id) => breedsById[id]).filter(Boolean),
    [breedIds, breedsById]
  );

  const [breedAId, setBreedAId] = useState<string | null>(
    breedIds[0] || null
  );
  const [breedBId, setBreedBId] = useState<string | null>(
    breedIds[1] || null
  );

  const [pickerTarget, setPickerTarget] = useState<'A' | 'B' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const breedA = breedAId ? breedsById[breedAId] : null;
  const breedB = breedBId ? breedsById[breedBId] : null;

  const filteredPickerBreeds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allBreeds;
    return allBreeds.filter((b) => b.name.toLowerCase().includes(q));
  }, [allBreeds, searchQuery]);

  const selectBreed = (breed: Breed) => {
    if (pickerTarget === 'A') setBreedAId(breed.id);
    if (pickerTarget === 'B') setBreedBId(breed.id);
    setPickerTarget(null);
    setSearchQuery('');
  };

  const renderComparisonRow = (
    label: string,
    valA: string | number,
    valB: string | number,
    icon?: string,
    isScore = false
  ) => {
    let highlightA = false;
    let highlightB = false;

    if (isScore && typeof valA === 'number' && typeof valB === 'number') {
      if (valA > valB) highlightA = true;
      else if (valB > valA) highlightB = true;
    }

    return (
      <View style={[styles.compareRow, { borderBottomColor: colors.border }]}>
        <View style={styles.sideValueWrap}>
          <Text
            style={[
              styles.sideValue,
              { color: highlightA ? colors.primary : colors.text },
              highlightA && styles.boldValue,
            ]}
          >
            {valA} {isScore ? '★' : ''}
          </Text>
        </View>

        <View style={styles.metricLabelWrap}>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
            {icon ? `${icon} ` : ''}{label}
          </Text>
        </View>

        <View style={styles.sideValueWrap}>
          <Text
            style={[
              styles.sideValue,
              { color: highlightB ? colors.primary : colors.text },
              highlightB && styles.boldValue,
            ]}
          >
            {valB} {isScore ? '★' : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <OfflineBanner />

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Compare Breeds</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Side-by-side canine traits & vital metrics
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Selector Cards Row */}
        <View style={styles.selectorsRow}>
          {/* Card A */}
          <TouchableOpacity
            style={[
              styles.breedSelectorCard,
              shadows.subtle,
              { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg },
            ]}
            onPress={() => setPickerTarget('A')}
            activeOpacity={0.8}
          >
            {breedA?.primaryImage ? (
              <ExpoImage
                source={{ uri: getOptimizedImageUrl(breedA.primaryImage, 'thumb') || '' }}
                style={[styles.selectorImage, { borderRadius: borderRadius.md }]}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.selectorImageFallback, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
                <Ionicons name="paw" size={32} color={colors.textMuted} />
              </View>
            )}
            <Text style={[styles.selectorName, { color: colors.text }]} numberOfLines={1}>
              {breedA?.name || 'Select Breed A'}
            </Text>
            <Text style={[styles.changeLabel, { color: colors.primary }]}>Tap to change</Text>
          </TouchableOpacity>

          <View style={styles.vsBadge}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Card B */}
          <TouchableOpacity
            style={[
              styles.breedSelectorCard,
              shadows.subtle,
              { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg },
            ]}
            onPress={() => setPickerTarget('B')}
            activeOpacity={0.8}
          >
            {breedB?.primaryImage ? (
              <ExpoImage
                source={{ uri: getOptimizedImageUrl(breedB.primaryImage, 'thumb') || '' }}
                style={[styles.selectorImage, { borderRadius: borderRadius.md }]}
                contentFit="cover"
              />
            ) : (
              <View style={[styles.selectorImageFallback, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
                <Ionicons name="paw" size={32} color={colors.textMuted} />
              </View>
            )}
            <Text style={[styles.selectorName, { color: colors.text }]} numberOfLines={1}>
              {breedB?.name || 'Select Breed B'}
            </Text>
            <Text style={[styles.changeLabel, { color: colors.primary }]}>Tap to change</Text>
          </TouchableOpacity>
        </View>

        {/* Comparison Tables */}
        {breedA && breedB && (
          <View style={[styles.comparisonCard, shadows.subtle, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg }]}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>General & Physical</Text>
            {renderComparisonRow('Breed Group', breedA.groupName, breedB.groupName)}
            {renderComparisonRow('Size Band', getSizeBandLabel(breedA.sizeBand).split(' ')[0], getSizeBandLabel(breedB.sizeBand).split(' ')[0])}
            {renderComparisonRow('Life Span', formatRange(breedA.lifeSpan, 'yrs'), formatRange(breedB.lifeSpan, 'yrs'))}
            {renderComparisonRow('Male Weight', formatRange(breedA.maleWeight, 'kg'), formatRange(breedB.maleWeight, 'kg'))}
            {renderComparisonRow('Coat Type', breedA.coat.type, breedB.coat.type)}
            {renderComparisonRow('Coat Length', breedA.coat.length, breedB.coat.length)}
            {renderComparisonRow('Hypoallergenic', breedA.hypoallergenic ? 'Yes' : 'No', breedB.hypoallergenic ? 'Yes' : 'No')}

            <Text style={[styles.sectionHeading, { color: colors.text, marginTop: 18 }]}>Behavior & Temperament (1–5)</Text>
            {renderComparisonRow('Good with Kids', breedA.traits.goodWithChildren, breedB.traits.goodWithChildren, '👶', true)}
            {renderComparisonRow('Good with Dogs', breedA.traits.goodWithDogs, breedB.traits.goodWithDogs, '🐕', true)}
            {renderComparisonRow('Good with Strangers', breedA.traits.goodWithStrangers, breedB.traits.goodWithStrangers, '🤝', true)}
            {renderComparisonRow('Apartment Friendly', breedA.traits.apartmentFriendly, breedB.traits.apartmentFriendly, '🏢', true)}
            {renderComparisonRow('Energy Level', breedA.traits.energy, breedB.traits.energy, '⚡', true)}
            {renderComparisonRow('Trainability', breedA.traits.trainability, breedB.traits.trainability, '🎓', true)}
            {renderComparisonRow('Barking Level', breedA.traits.barking, breedB.traits.barking, '📢', true)}
            {renderComparisonRow('Grooming Needs', breedA.traits.grooming, breedB.traits.grooming, '✂️', true)}
            {renderComparisonRow('Shedding Level', breedA.traits.shedding, breedB.traits.shedding, '🐾', true)}
            {renderComparisonRow('Drooling Level', breedA.traits.drooling, breedB.traits.drooling, '💧', true)}
          </View>
        )}
      </ScrollView>

      {/* Breed Picker Modal */}
      <Modal
        visible={!!pickerTarget}
        animationType="slide"
        onRequestClose={() => setPickerTarget(null)}
      >
        <SafeAreaView style={[styles.modalSafeArea, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Breed {pickerTarget}
            </Text>
            <TouchableOpacity onPress={() => setPickerTarget(null)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalSearchBox, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.md }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.modalSearchInput, { color: colors.text }]}
              placeholder="Search breed by name..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>

          <FlatList
            data={filteredPickerBreeds}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.pickerItem, { borderBottomColor: colors.border }]}
                onPress={() => selectBreed(item)}
              >
                <Text style={[styles.pickerItemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.pickerItemGroup, { color: colors.textSecondary }]}>
                  {item.groupName}
                </Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  selectorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  breedSelectorCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectorImage: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  selectorImageFallback: {
    width: 64,
    height: 64,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  changeLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  vsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E07A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  vsText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  comparisonCard: {
    padding: 16,
    borderWidth: 1,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  sideValueWrap: {
    flex: 1,
    alignItems: 'center',
  },
  sideValue: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  boldValue: {
    fontWeight: '800',
  },
  metricLabelWrap: {
    flex: 1.5,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  modalSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerItemName: {
    fontSize: 15,
    fontWeight: '600',
  },
  pickerItemGroup: {
    fontSize: 12,
    fontWeight: '500',
  },
});
