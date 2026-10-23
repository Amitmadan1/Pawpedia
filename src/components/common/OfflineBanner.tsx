import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreedStore } from '../../store/useBreedStore';
import { useTheme } from '../../theme/ThemeContext';
import { formatTimeAgo } from '../../utils/formatters';

export const OfflineBanner: React.FC = () => {
  const { colors, spacing, borderRadius } = useTheme();
  const isOffline = useBreedStore((s) => s.isOffline);
  const isSyncing = useBreedStore((s) => s.isSyncing);
  const syncProgress = useBreedStore((s) => s.syncProgress);
  const syncError = useBreedStore((s) => s.syncError);
  const lastSyncedAt = useBreedStore((s) => s.lastSyncedAt);
  const syncAllData = useBreedStore((s) => s.syncAllData);
  const dismissSyncError = useBreedStore((s) => s.dismissSyncError);

  // 1. Syncing state
  if (isSyncing) {
    const progressText = syncProgress
      ? `Syncing catalog (${syncProgress.loaded}/${syncProgress.total})...`
      : 'Syncing breed catalog...';

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.info + '18', borderBottomColor: colors.info + '40' },
        ]}
      >
        <ActivityIndicator size="small" color={colors.info} style={styles.indicator} />
        <Text style={[styles.text, { color: colors.info }]}>{progressText}</Text>
      </View>
    );
  }

  // 2. Sync Error banner
  if (syncError) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.danger + '18', borderBottomColor: colors.danger + '40' },
        ]}
      >
        <Ionicons name="alert-circle" size={18} color={colors.danger} style={styles.icon} />
        <Text style={[styles.text, { color: colors.danger }]} numberOfLines={2}>
          {syncError}
        </Text>
        <TouchableOpacity
          style={[styles.retryBtn, { backgroundColor: colors.danger }]}
          onPress={() => syncAllData()}
          activeOpacity={0.7}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={dismissSyncError} style={styles.dismissBtn}>
          <Ionicons name="close" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Offline Mode banner
  if (isOffline) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.offlineBannerBg,
            borderBottomColor: colors.warning + '40',
          },
        ]}
      >
        <Ionicons name="cloud-offline" size={18} color={colors.offlineBannerText} style={styles.icon} />
        <View style={styles.offlineTextWrap}>
          <Text style={[styles.titleText, { color: colors.offlineBannerText }]}>
            Offline Mode
          </Text>
          <Text style={[styles.subText, { color: colors.offlineBannerText + 'CC' }]}>
            {formatTimeAgo(lastSyncedAt)} • Using cached data
          </Text>
        </View>
      </View>
    );
  }

  // 4. Subtle freshness bar when online
  return (
    <View style={[styles.freshnessContainer, { backgroundColor: colors.background }]}>
      <View style={styles.statusDot} />
      <Text style={[styles.freshnessText, { color: colors.textMuted }]}>
        {formatTimeAgo(lastSyncedAt)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  freshnessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  freshnessText: {
    fontSize: 12,
    fontWeight: '500',
  },
  indicator: {
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  offlineTextWrap: {
    flex: 1,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '700',
  },
  subText: {
    fontSize: 11,
    fontWeight: '500',
  },
  retryBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  retryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dismissBtn: {
    padding: 4,
    marginLeft: 4,
  },
});
