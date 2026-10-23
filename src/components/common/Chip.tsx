import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface Props {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'accent' | 'outline';
}

export const Chip: React.FC<Props> = ({
  label,
  selected = false,
  onPress,
  count,
  icon,
  variant = 'default',
}) => {
  const { colors, borderRadius } = useTheme();

  let bg = colors.badgeBg;
  let textCol = colors.textSecondary;
  let borderCol = 'transparent';

  if (selected) {
    bg = colors.primary;
    textCol = '#FFFFFF';
  } else if (variant === 'primary') {
    bg = colors.primaryLight;
    textCol = colors.primaryDark;
  } else if (variant === 'accent') {
    bg = colors.accent + '22';
    textCol = colors.accent;
  } else if (variant === 'outline') {
    bg = 'transparent';
    borderCol = colors.border;
  }

  const Content = (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: borderCol,
          borderWidth: borderCol !== 'transparent' ? 1 : 0,
          borderRadius: borderRadius.round,
        },
      ]}
    >
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={[styles.label, { color: textCol }]}>{label}</Text>
      {typeof count === 'number' && (
        <View
          style={[
            styles.countBadge,
            { backgroundColor: selected ? 'rgba(255,255,255,0.25)' : colors.cardBorder },
          ]}
        >
          <Text style={[styles.countText, { color: textCol }]}>{count}</Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Content}
      </TouchableOpacity>
    );
  }

  return Content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  iconWrap: {
    marginRight: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
