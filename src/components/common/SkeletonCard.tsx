import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

export const SkeletonCard: React.FC = () => {
  const { colors, borderRadius, shadows } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View
      style={[
        styles.card,
        shadows.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          borderRadius: borderRadius.lg,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.thumbnail,
          {
            backgroundColor: colors.cardBorder,
            opacity,
            borderRadius: borderRadius.md,
          },
        ]}
      />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.titleLine,
            {
              backgroundColor: colors.cardBorder,
              opacity,
              borderRadius: borderRadius.xs,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.subtitleLine,
            {
              backgroundColor: colors.cardBorder,
              opacity,
              borderRadius: borderRadius.xs,
            },
          ]}
        />
        <View style={styles.badgeRow}>
          <Animated.View
            style={[
              styles.badge,
              {
                backgroundColor: colors.cardBorder,
                opacity,
                borderRadius: borderRadius.round,
              },
            ]}
          />
          <Animated.View
            style={[
              styles.badge,
              {
                backgroundColor: colors.cardBorder,
                opacity,
                borderRadius: borderRadius.round,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    height: 104,
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleLine: {
    width: '60%',
    height: 16,
    marginBottom: 8,
  },
  subtitleLine: {
    width: '40%',
    height: 12,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    width: 60,
    height: 18,
  },
});
