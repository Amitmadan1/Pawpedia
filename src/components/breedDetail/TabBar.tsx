import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

export type DetailTab = 'overview' | 'traits' | 'gallery';

interface Props {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  galleryCount: number;
}

export const TabBar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  galleryCount,
}) => {
  const { colors, borderRadius } = useTheme();

  const tabs: Array<{ id: DetailTab; label: string; icon: keyof typeof Ionicons.glyphMap; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: 'information-circle-outline' },
    { id: 'traits', label: 'Traits', icon: 'stats-chart-outline' },
    { id: 'gallery', label: 'Gallery', icon: 'images-outline', badge: galleryCount },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              isActive && { borderBottomColor: colors.primary, borderBottomWidth: 3 },
            ]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={tab.icon}
                size={18}
                color={isActive ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : colors.textSecondary },
                  isActive && styles.activeTabLabel,
                ]}
              >
                {tab.label}
              </Text>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isActive ? colors.primaryLight : colors.badgeBg,
                      borderRadius: borderRadius.round,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      { color: isActive ? colors.primaryDark : colors.badgeText },
                    ]}
                  >
                    {tab.badge}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
