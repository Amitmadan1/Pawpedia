import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Breed } from '../../types/breed';
import { useTheme } from '../../theme/ThemeContext';
import { Chip } from '../common/Chip';
import { VisualScoreBar } from '../common/VisualScoreBar';

interface Props {
  breed: Breed;
}

export const TraitsTab: React.FC<Props> = ({ breed }) => {
  const { colors, borderRadius, shadows } = useTheme();
  const { traits } = breed;

  return (
    <View style={styles.container}>
      {/* Temperament Tags Card */}
      {traits.temperament.length > 0 && (
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
            Temperament & Personality
          </Text>
          <View style={styles.temperamentRow}>
            {traits.temperament.map((trait, idx) => (
              <Chip key={idx} label={trait} variant="primary" />
            ))}
          </View>
        </View>
      )}

      {/* 1. Social & Family Compatibility */}
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
          Social & Family Compatibility
        </Text>
        <VisualScoreBar
          label="Good with Children"
          value={traits.goodWithChildren}
          icon="👶"
        />
        <VisualScoreBar
          label="Good with Other Dogs"
          value={traits.goodWithDogs}
          icon="🐕"
        />
        <VisualScoreBar
          label="Good with Strangers"
          value={traits.goodWithStrangers}
          icon="🤝"
        />
        <VisualScoreBar
          label="Apartment Friendly"
          value={traits.apartmentFriendly}
          icon="🏢"
        />
      </View>

      {/* 2. Energy & Exercise */}
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
          Energy & Exercise Requirements
        </Text>
        <VisualScoreBar
          label="Energy Level"
          value={traits.energy}
          icon="⚡"
        />
        <VisualScoreBar
          label="Daily Exercise Target"
          value={traits.exerciseMinutes}
          unit="mins/day"
          icon="🏃"
          isCustomScale
        />
      </View>

      {/* 3. Training & Demeanor */}
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
          Training & Demeanor
        </Text>
        <VisualScoreBar
          label="Trainability & Intelligence"
          value={traits.trainability}
          icon="🎓"
        />
        <VisualScoreBar
          label="Barking Frequency"
          value={traits.barking}
          icon="📢"
        />
      </View>

      {/* 4. Grooming & Physical Needs */}
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
          Grooming & Coat Care
        </Text>
        <VisualScoreBar
          label="Grooming Needs"
          value={traits.grooming}
          icon="✂️"
        />
        <VisualScoreBar
          label="Shedding Level"
          value={traits.shedding}
          icon="🐾"
        />
        <VisualScoreBar
          label="Drooling Propensity"
          value={traits.drooling}
          icon="💧"
        />
      </View>
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
  temperamentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
