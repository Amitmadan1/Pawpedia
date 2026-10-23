import React from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SettingsScreenProps } from '../types/navigation';
import { clearAllCache } from '../store/storage';
import { useBreedStore } from '../store/useBreedStore';
import { useTheme } from '../theme/ThemeContext';
import { formatTimeAgo } from '../utils/formatters';
import { OfflineBanner } from '../components/common/OfflineBanner';

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { colors, mode, setThemeMode, borderRadius, shadows } = useTheme();

  const isOffline = useBreedStore((s) => s.isOffline);
  const isSyncing = useBreedStore((s) => s.isSyncing);
  const lastSyncedAt = useBreedStore((s) => s.lastSyncedAt);
  const breedIds = useBreedStore((s) => s.breedIds);
  const groupsById = useBreedStore((s) => s.groupsById);
  const favorites = useBreedStore((s) => s.favorites);
  const syncAllData = useBreedStore((s) => s.syncAllData);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Cache',
      'Are you sure you want to clear locally cached breed data? The app will need network connectivity to re-sync.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            await clearAllCache();
            syncAllData();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <OfflineBanner />

      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings & Sync</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Theme Settings Card */}
        <View style={[styles.card, shadows.subtle, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Appearance</Text>

          <View style={styles.themeOptionsRow}>
            {(['system', 'light', 'dark'] as const).map((t) => {
              const isSelected = mode === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.badgeBg,
                      borderRadius: borderRadius.md,
                    },
                  ]}
                  onPress={() => setThemeMode(t)}
                >
                  <Ionicons
                    name={
                      t === 'light'
                        ? 'sunny'
                        : t === 'dark'
                        ? 'moon'
                        : 'phone-portrait-outline'
                    }
                    size={18}
                    color={isSelected ? '#FFF' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeButtonText,
                      { color: isSelected ? '#FFF' : colors.textSecondary },
                    ]}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sync & Storage Status */}
        <View style={[styles.card, shadows.subtle, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Data & Cache Status</Text>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Network Status</Text>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: isOffline ? colors.danger : colors.success },
                ]}
              />
              <Text style={[styles.statusValue, { color: colors.text }]}>
                {isOffline ? 'Offline' : 'Connected'}
              </Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Freshness</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {formatTimeAgo(lastSyncedAt)}
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Cached Breeds</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {breedIds.length} records
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Breed Groups</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {Object.keys(groupsById).length} groups
            </Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Saved Favorites</Text>
            <Text style={[styles.statusValue, { color: colors.text }]}>
              {favorites.length} breeds
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsWrap}>
            <TouchableOpacity
              style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
              onPress={() => syncAllData()}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <>
                  <Ionicons name="refresh" size={18} color="#FFF" />
                  <Text style={styles.primaryActionBtnText}>Sync All 283 Breeds Now</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryActionBtn, { borderColor: colors.border }]}
              onPress={handleClearCache}
            >
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={[styles.secondaryActionBtnText, { color: colors.danger }]}>
                Clear Local Storage
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Card */}
        <View style={[styles.card, shadows.subtle, { backgroundColor: colors.card, borderColor: colors.cardBorder, borderRadius: borderRadius.lg }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>About Pawpedia</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            Pawpedia is an offline-first mobile reference app powered by the open Dog API (v2). It delivers comprehensive, multi-dimensional canine traits, vital health statistics, and rich photo galleries under Creative Commons licensing.
          </Text>
          <View style={styles.versionRow}>
            <Text style={[styles.versionText, { color: colors.textMuted }]}>
              Version 1.0.0 • React Native & Expo SDK 58
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  card: {
    padding: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  themeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsWrap: {
    marginTop: 16,
    gap: 10,
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  primaryActionBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    gap: 6,
  },
  secondaryActionBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
  },
  versionRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.15)',
  },
  versionText: {
    fontSize: 12,
  },
});
