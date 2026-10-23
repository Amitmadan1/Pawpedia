import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  label: string;
  value: number;
  maxValue?: number;
  icon?: string;
  unit?: string;
  isCustomScale?: boolean; // For exercise_minutes
}

export const VisualScoreBar: React.FC<Props> = ({
  label,
  value,
  maxValue = 5,
  icon,
  unit,
  isCustomScale = false,
}) => {
  const { colors, spacing, borderRadius } = useTheme();

  // For exercise_minutes, display the number and gauge relative to 120 mins
  if (isCustomScale) {
    const percentage = Math.min(100, Math.max(10, (value / 90) * 100));
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.label, { color: colors.text }]}>
            {icon ? `${icon} ` : ''}{label}
          </Text>
          <View style={[styles.valueBadge, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.valueText, { color: colors.primaryDark }]}>
              {value} {unit || 'mins/day'}
            </Text>
          </View>
        </View>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.continuousFill,
              {
                width: `${percentage}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  // Get semantic rating text
  const getDescriptor = (score: number): string => {
    switch (score) {
      case 1:
        return 'Low';
      case 2:
        return 'Mild';
      case 3:
        return 'Moderate';
      case 4:
        return 'High';
      case 5:
        return 'Very High';
      default:
        return `${score}/${maxValue}`;
    }
  };

  const segments = Array.from({ length: maxValue }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.text }]}>
          {icon ? `${icon} ` : ''}{label}
        </Text>
        <View style={styles.headerRight}>
          <Text style={[styles.descriptor, { color: colors.textSecondary }]}>
            {getDescriptor(value)}
          </Text>
          <View style={[styles.valueBadge, { backgroundColor: colors.badgeBg }]}>
            <Text style={[styles.valueText, { color: colors.badgeText }]}>
              {value}/{maxValue}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.segmentsRow}>
        {segments.map((seg) => {
          const isFilled = seg <= value;
          let segmentColor = colors.border;
          if (isFilled) {
            if (value <= 2) segmentColor = colors.scoreLow;
            else if (value === 3) segmentColor = colors.scoreMid;
            else segmentColor = colors.scoreHigh;
          }

          return (
            <View
              key={seg}
              style={[
                styles.segment,
                {
                  backgroundColor: segmentColor,
                  borderRadius: borderRadius.xs,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  descriptor: {
    fontSize: 12,
    fontWeight: '500',
  },
  valueBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '700',
  },
  segmentsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 8,
  },
  segment: {
    flex: 1,
    height: '100%',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  continuousFill: {
    height: '100%',
    borderRadius: 4,
  },
});
