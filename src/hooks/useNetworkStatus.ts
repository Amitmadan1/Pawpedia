import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { useBreedStore } from '../store/useBreedStore';

/**
 * Listens for network changes and updates store offline status.
 * Automatically triggers background sync when network is restored.
 */
export function useNetworkStatus(): void {
  const setOfflineStatus = useBreedStore((s) => s.setOfflineStatus);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then((state: NetInfoState) => {
      const isConnected = state.isConnected ?? true;
      const isInternetReachable = state.isInternetReachable ?? true;
      setOfflineStatus(!isConnected || !isInternetReachable);
    });

    // Event listener
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const isConnected = state.isConnected ?? true;
      const isInternetReachable = state.isInternetReachable ?? true;
      setOfflineStatus(!isConnected || !isInternetReachable);
    });

    return () => {
      unsubscribe();
    };
  }, [setOfflineStatus]);
}
