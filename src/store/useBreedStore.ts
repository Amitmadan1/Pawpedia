import { create } from 'zustand';
import { fetchAllBreeds, fetchBreedById, fetchGroups } from '../api/dogApi';
import { Breed, BreedGroup } from '../types/breed';
import {
  loadCachedData,
  saveCachedData,
  saveFavorites,
  updateCachedBreed,
} from './storage';

export interface BreedStoreState {
  // Normalized entities
  breedsById: Record<string, Breed>;
  breedIds: string[];
  groupsById: Record<string, BreedGroup>;
  favorites: string[];

  // Sync & network metadata
  lastSyncedAt: number | null;
  isSyncing: boolean;
  syncProgress: { loaded: number; total: number } | null;
  syncError: string | null;
  isOffline: boolean;
  isHydrated: boolean;

  // Actions
  hydrateFromStorage: () => Promise<void>;
  syncAllData: (options?: { isBackground?: boolean }) => Promise<void>;
  refreshBreed: (breedId: string) => Promise<Breed | null>;
  setOfflineStatus: (isOffline: boolean) => void;
  toggleFavorite: (breedId: string) => Promise<void>;
  dismissSyncError: () => void;
}

export const useBreedStore = create<BreedStoreState>((set, get) => ({
  breedsById: {},
  breedIds: [],
  groupsById: {},
  favorites: [],

  lastSyncedAt: null,
  isSyncing: false,
  syncProgress: null,
  syncError: null,
  isOffline: false,
  isHydrated: false,

  hydrateFromStorage: async () => {
    try {
      const cached = await loadCachedData();
      if (cached && cached.breedIds.length > 0) {
        set({
          breedsById: cached.breedsById,
          breedIds: cached.breedIds,
          groupsById: cached.groupsById,
          lastSyncedAt: cached.lastSyncedAt,
          favorites: cached.favorites || [],
          isHydrated: true,
        });
      } else {
        set({ isHydrated: true });
        // Trigger initial load if empty
        get().syncAllData();
      }
    } catch (err: unknown) {
      console.warn('Hydration error:', err);
      set({ isHydrated: true });
    }
  },

  syncAllData: async (options = {}) => {
    const { isBackground = false } = options;
    const state = get();

    if (state.isSyncing) return;

    set({
      isSyncing: true,
      syncProgress: { loaded: 0, total: 283 },
      syncError: null,
    });

    try {
      // 1. Fetch groups first for proper relations and labels
      const groupsById = await fetchGroups();

      // 2. Fetch all 6 pages with progress callback
      const breeds = await fetchAllBreeds(groupsById, (loaded, total) => {
        set({ syncProgress: { loaded, total } });
      });

      const breedsById: Record<string, Breed> = {};
      const breedIds: string[] = [];

      for (const breed of breeds) {
        breedsById[breed.id] = breed;
        breedIds.push(breed.id);
      }

      const lastSyncedAt = Date.now();

      // Update state
      set({
        breedsById,
        breedIds,
        groupsById,
        lastSyncedAt,
        isSyncing: false,
        syncProgress: null,
        syncError: null,
      });

      // Persist to local storage
      await saveCachedData({
        breedsById,
        breedIds,
        groupsById,
        lastSyncedAt,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to synchronize breed catalog';

      // Keep existing cached data, mark error
      set({
        isSyncing: false,
        syncProgress: null,
        syncError: isBackground
          ? `Background sync failed: ${errorMessage}`
          : `Sync failed: ${errorMessage}. Showing cached data.`,
      });
    }
  },

  refreshBreed: async (breedId: string) => {
    const state = get();
    try {
      const updated = await fetchBreedById(breedId, state.groupsById);
      const nextBreedsById = { ...state.breedsById, [breedId]: updated };
      set({ breedsById: nextBreedsById });
      await updateCachedBreed(updated);
      return updated;
    } catch (err: unknown) {
      console.warn(`Failed to refresh breed ${breedId}:`, err);
      return null;
    }
  },

  setOfflineStatus: (isOffline: boolean) => {
    const wasOffline = get().isOffline;
    set({ isOffline });

    // If returning from offline to online, trigger background sync
    if (wasOffline && !isOffline) {
      get().syncAllData({ isBackground: true });
    }
  },

  toggleFavorite: async (breedId: string) => {
    const { favorites } = get();
    const isFav = favorites.includes(breedId);
    const updated = isFav
      ? favorites.filter((id) => id !== breedId)
      : [...favorites, breedId];

    set({ favorites: updated });
    await saveFavorites(updated);
  },

  dismissSyncError: () => {
    set({ syncError: null });
  },
}));
