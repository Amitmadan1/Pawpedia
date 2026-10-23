import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Breed } from '../../types/breed';
import { useTheme } from '../../theme/ThemeContext';
import { formatRange } from '../../utils/formatters';
import { getSizeBandLabel } from '../../utils/sizeBuckets';
import { Chip } from '../common/Chip';

interface Props {
  breed: Breed;
}

export const OverviewTab: React.FC<Props> = ({ breed }) => {
  const { colors, borderRadius, shadows } = useTheme();

  const handleOpenSource = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) =>
        console.warn('Could not open external URL:', err)
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Description Card */}
      <View
        style={[
          styles.card,
          shadows.subtle,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          About the Breed
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {breed.description}
        </Text>
      </View>

      {/* Vital Statistics Grid */}
      <View
        style={[
          styles.card,
          shadows.subtle,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Vital Statistics
        </Text>

        <View style={styles.statsGrid}>
          {/* Life Span */}
          <View style={[styles.statBox, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
            <Ionicons name="heart-circle" size={20} color={colors.primary} />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Life Span</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatRange(breed.lifeSpan, 'yrs')}
            </Text>
          </View>

          {/* Size Band */}
          <View style={[styles.statBox, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
            <Ionicons name="barbell-outline" size={20} color={colors.primary} />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Size Class</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {getSizeBandLabel(breed.sizeBand).split(' ')[0]}
            </Text>
          </View>

          {/* Male Weight */}
          <View style={[styles.statBox, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
            <Ionicons name="male" size={18} color="#3B82F6" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Male Weight</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatRange(breed.maleWeight, 'kg')}
            </Text>
          </View>

          {/* Female Weight */}
          <View style={[styles.statBox, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
            <Ionicons name="female" size={18} color="#EC4899" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Female Weight</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatRange(breed.femaleWeight, 'kg')}
            </Text>
          </View>

          {/* Male Height */}
          <View style={[styles.statBox, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
            <Ionicons name="resize-outline" size={18} color="#3B82F6" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Male Height</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatRange(breed.maleHeight, 'cm')}
            </Text>
          </View>

          {/* Female Height */}
          <View style={[styles.statBox, { backgroundColor: colors.badgeBg, borderRadius: borderRadius.md }]}>
            <Ionicons name="resize-outline" size={18} color="#EC4899" />
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Female Height</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatRange(breed.femaleHeight, 'cm')}
            </Text>
          </View>
        </View>
      </View>

      {/* Origin & History Card */}
      <View
        style={[
          styles.card,
          shadows.subtle,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Origin & Heritage
        </Text>

        <View style={styles.originRow}>
          <Ionicons name="earth" size={18} color={colors.accent} />
          <Text style={[styles.originLabel, { color: colors.textMuted }]}>Country:</Text>
          <Text style={[styles.originValue, { color: colors.text }]}>
            {breed.origin.country || 'Global'}
          </Text>
        </View>

        <View style={styles.originRow}>
          <Ionicons name="map-outline" size={18} color={colors.accent} />
          <Text style={[styles.originLabel, { color: colors.textMuted }]}>Region:</Text>
          <Text style={[styles.originValue, { color: colors.text }]}>
            {breed.origin.region || 'Worldwide'}
          </Text>
        </View>

        <View style={styles.originRow}>
          <Ionicons name="hourglass-outline" size={18} color={colors.accent} />
          <Text style={[styles.originLabel, { color: colors.textMuted }]}>Era:</Text>
          <Text style={[styles.originValue, { color: colors.text }]}>
            {breed.origin.era || 'Historic'}
          </Text>
        </View>
      </View>

      {/* Coat & Grooming Card */}
      <View
        style={[
          styles.card,
          shadows.subtle,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Coat & Colors
        </Text>

        <View style={styles.coatStatsRow}>
          <View style={styles.coatStat}>
            <Text style={[styles.coatStatLabel, { color: colors.textMuted }]}>Type</Text>
            <Text style={[styles.coatStatVal, { color: colors.text }]}>{breed.coat.type}</Text>
          </View>
          <View style={styles.coatStat}>
            <Text style={[styles.coatStatLabel, { color: colors.textMuted }]}>Length</Text>
            <Text style={[styles.coatStatVal, { color: colors.text }]}>{breed.coat.length}</Text>
          </View>
          <View style={styles.coatStat}>
            <Text style={[styles.coatStatLabel, { color: colors.textMuted }]}>Hypoallergenic</Text>
            <Text
              style={[
                styles.coatStatVal,
                { color: breed.hypoallergenic ? colors.success : colors.textSecondary },
              ]}
            >
              {breed.hypoallergenic ? 'Yes ✓' : 'No'}
            </Text>
          </View>
        </View>

        {breed.coat.colors.length > 0 && (
          <View style={styles.colorsWrap}>
            <Text style={[styles.subHeading, { color: colors.textSecondary }]}>
              Recognized Colors:
            </Text>
            <View style={styles.chipsRow}>
              {breed.coat.colors.map((color, idx) => (
                <Chip key={idx} label={color} />
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Other Names / Aliases */}
      {breed.otherNames.length > 0 && (
        <View
          style={[
            styles.card,
            shadows.subtle,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Also Known As
          </Text>
          <View style={styles.chipsRow}>
            {breed.otherNames.map((name, idx) => (
              <Chip key={idx} label={name} variant="outline" />
            ))}
          </View>
        </View>
      )}

      {/* Recognized Kennel Clubs */}
      {breed.recognizedBy.length > 0 && (
        <View
          style={[
            styles.card,
            shadows.subtle,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recognizing Kennel Clubs
          </Text>
          <View style={styles.chipsRow}>
            {breed.recognizedBy.map((club, idx) => (
              <Chip key={idx} label={club} variant="primary" />
            ))}
          </View>
        </View>
      )}

      {/* Official Sources & Standards */}
      {breed.sources.length > 0 && (
        <View
          style={[
            styles.card,
            shadows.subtle,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Official Standards & References
          </Text>
          {breed.sources.map((source, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.sourceItem}
              onPress={() => handleOpenSource(source.url)}
              activeOpacity={0.7}
            >
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text
                style={[styles.sourceTitle, { color: colors.primary }]}
                numberOfLines={1}
              >
                {source.title}
              </Text>
              <Ionicons name="open-outline" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 14,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    width: '48%',
    padding: 12,
    alignItems: 'flex-start',
    gap: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  originRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 8,
  },
  originLabel: {
    fontSize: 13,
    fontWeight: '500',
    width: 60,
  },
  originValue: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  coatStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  coatStat: {
    flex: 1,
  },
  coatStatLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  coatStatVal: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  colorsWrap: {
    marginTop: 8,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  sourceTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
});
