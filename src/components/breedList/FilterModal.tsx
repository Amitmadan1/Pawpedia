import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CoatLength, SizeBand } from '../../types/breed';
import { FilterState, HypoallergenicFilter } from '../../types/filters';
import { useBreedStore } from '../../store/useBreedStore';
import { useTheme } from '../../theme/ThemeContext';
import { getSizeBandLabel } from '../../utils/sizeBuckets';
import { Chip } from '../common/Chip';

interface Props {
  visible: boolean;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
  onReset: () => void;
}

export const FilterModal: React.FC<Props> = ({
  visible,
  filters,
  onApply,
  onClose,
  onReset,
}) => {
  const { colors, borderRadius } = useTheme();
  const groupsById = useBreedStore((s) => s.groupsById);
  const groupsList = Object.values(groupsById);

  const [draft, setDraft] = useState<FilterState>(filters);

  // Sync draft whenever modal becomes visible
  React.useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const toggleGroup = (groupId: string) => {
    setDraft((prev) => {
      const exists = prev.selectedGroups.includes(groupId);
      return {
        ...prev,
        selectedGroups: exists
          ? prev.selectedGroups.filter((id) => id !== groupId)
          : [...prev.selectedGroups, groupId],
      };
    });
  };

  const toggleSize = (size: SizeBand) => {
    setDraft((prev) => {
      const exists = prev.selectedSizes.includes(size);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter((s) => s !== size)
          : [...prev.selectedSizes, size],
      };
    });
  };

  const toggleCoat = (coat: CoatLength) => {
    setDraft((prev) => {
      const exists = prev.selectedCoats.includes(coat);
      return {
        ...prev,
        selectedCoats: exists
          ? prev.selectedCoats.filter((c) => c !== coat)
          : [...prev.selectedCoats, coat],
      };
    });
  };

  const setHypo = (val: HypoallergenicFilter) => {
    setDraft((prev) => ({ ...prev, hypoallergenic: val }));
  };

  const setThreshold = (
    key: keyof FilterState['traitThresholds'],
    value: number | undefined
  ) => {
    setDraft((prev) => ({
      ...prev,
      traitThresholds: {
        ...prev.traitThresholds,
        [key]: value === prev.traitThresholds[key] ? undefined : value,
      },
    }));
  };

  const sizeOptions: SizeBand[] = ['small', 'medium', 'large', 'giant'];
  const coatOptions: CoatLength[] = ['short', 'medium', 'long', 'wire', 'hairless'];

  const renderThresholdSelector = (
    label: string,
    key: keyof FilterState['traitThresholds']
  ) => {
    const currentVal = draft.traitThresholds[key];
    return (
      <View style={styles.thresholdRow}>
        <Text style={[styles.thresholdLabel, { color: colors.text }]}>
          {label}
        </Text>
        <View style={styles.scoreRow}>
          {[3, 4, 5].map((score) => {
            const isSelected = currentVal === score;
            return (
              <TouchableOpacity
                key={score}
                style={[
                  styles.scoreButton,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.badgeBg,
                    borderRadius: borderRadius.sm,
                  },
                ]}
                onPress={() => setThreshold(key, score)}
              >
                <Text
                  style={[
                    styles.scoreButtonText,
                    { color: isSelected ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  ≥ {score}★
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
        <View
          style={[
            styles.modalSheet,
            { backgroundColor: colors.card, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>Filter Breeds</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* 1. Breed Groups */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Breed Groups
            </Text>
            <View style={styles.chipsWrap}>
              {groupsList.map((g) => (
                <Chip
                  key={g.id}
                  label={g.name}
                  selected={draft.selectedGroups.includes(g.id)}
                  onPress={() => toggleGroup(g.id)}
                />
              ))}
            </View>

            {/* 2. Size Bands */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Size Classification
            </Text>
            <View style={styles.chipsWrap}>
              {sizeOptions.map((size) => (
                <Chip
                  key={size}
                  label={getSizeBandLabel(size)}
                  selected={draft.selectedSizes.includes(size)}
                  onPress={() => toggleSize(size)}
                />
              ))}
            </View>

            {/* 3. Coat Length / Type */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Coat Length / Texture
            </Text>
            <View style={styles.chipsWrap}>
              {coatOptions.map((coat) => (
                <Chip
                  key={coat}
                  label={coat.charAt(0).toUpperCase() + coat.slice(1)}
                  selected={draft.selectedCoats.includes(coat)}
                  onPress={() => toggleCoat(coat)}
                />
              ))}
            </View>

            {/* 4. Hypoallergenic */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Hypoallergenic
            </Text>
            <View style={styles.chipsWrap}>
              <Chip
                label="All"
                selected={draft.hypoallergenic === 'all'}
                onPress={() => setHypo('all')}
              />
              <Chip
                label="Hypoallergenic Only"
                selected={draft.hypoallergenic === 'yes'}
                onPress={() => setHypo('yes')}
              />
              <Chip
                label="Non-Hypoallergenic"
                selected={draft.hypoallergenic === 'no'}
                onPress={() => setHypo('no')}
              />
            </View>

            {/* 5. Trait Thresholds */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Trait Minimums
            </Text>
            {renderThresholdSelector('Good with Children', 'goodWithChildren')}
            {renderThresholdSelector('Good with Other Dogs', 'goodWithDogs')}
            {renderThresholdSelector('Good with Strangers', 'goodWithStrangers')}
            {renderThresholdSelector('Apartment Friendly', 'apartmentFriendly')}
            {renderThresholdSelector('Energy Level', 'energyMin')}
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.resetBtn, { borderColor: colors.border }]}
              onPress={() => {
                onReset();
                onClose();
              }}
            >
              <Text style={[styles.resetText, { color: colors.textSecondary }]}>
                Clear All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                onApply(draft);
                onClose();
              }}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    paddingHorizontal: 16,
  },
  bodyContent: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  thresholdLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  scoreButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
