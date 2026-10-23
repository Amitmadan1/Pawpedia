import AsyncStorage from '@react-native-async-storage/async-storage';
import { Breed, BreedGroup } from '../types/breed';

const STORAGE_KEYS = {
  BREEDS_BY_ID: '@pawpedia:breeds_by_id_v1',
  BREED_IDS: '@pawpedia:breed_ids_v1',
  GROUPS_BY_ID: '@pawpedia:groups_by_id_v1',
  LAST_SYNCED_AT: '@pawpedia:last_synced_at_v1',
  FAVORITES: '@pawpedia:favorites_v1',
  SCHEMA_VERSION: '@pawpedia:schema_version',
};

const CURRENT_SCHEMA_VERSION = '1.0.0';

export interface PersistedCacheData {
  breedsById: Record<string, Breed>;
  breedIds: string[];
  groupsById: Record<string, BreedGroup>;
  lastSyncedAt: number | null;
  favorites: string[];
}

/**
 * Loads cached data from AsyncStorage with safe fallbacks and error handling.
 */
export async function loadCachedData(): Promise<PersistedCacheData | null> {
  try {
    const [
      breedsJson,
      breedIdsJson,
      groupsJson,
      lastSyncedStr,
      favoritesJson,
    ] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.BREEDS_BY_ID),
      AsyncStorage.getItem(STORAGE_KEYS.BREED_IDS),
      AsyncStorage.getItem(STORAGE_KEYS.GROUPS_BY_ID),
      AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNCED_AT),
      AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
    ]);

    if (!breedsJson || !breedIdsJson) {
      return null;
    }

    const breedsById = JSON.parse(breedsJson) as Record<string, Breed>;
    const breedIds = JSON.parse(breedIdsJson) as string[];
    const groupsById = groupsJson
      ? (JSON.parse(groupsJson) as Record<string, BreedGroup>)
      : {};
    const lastSyncedAt = lastSyncedStr ? parseInt(lastSyncedStr, 10) : null;
    const favorites = favoritesJson ? (JSON.parse(favoritesJson) as string[]) : [];

    return {
      breedsById,
      breedIds,
      groupsById,
      lastSyncedAt,
      favorites,
    };
  } catch (error) {
    console.warn('Failed to load cached data from AsyncStorage:', error);
    return null;
  }
}

/**
 * Saves all normalized breeds and groups to AsyncStorage.
 */
export async function saveCachedData(data: {
  breedsById: Record<string, Breed>;
  breedIds: string[];
  groupsById: Record<string, BreedGroup>;
  lastSyncedAt: number;
}): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.BREEDS_BY_ID, JSON.stringify(data.breedsById)),
      AsyncStorage.setItem(STORAGE_KEYS.BREED_IDS, JSON.stringify(data.breedIds)),
      AsyncStorage.setItem(STORAGE_KEYS.GROUPS_BY_ID, JSON.stringify(data.groupsById)),
      AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNCED_AT, data.lastSyncedAt.toString()),
      AsyncStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, CURRENT_SCHEMA_VERSION),
    ]);
  } catch (error) {
    console.error('Failed to save data to AsyncStorage:', error);
  }
}

/**
 * Updates a single breed in cached storage (for single-breed enrichment).
 */
export async function updateCachedBreed(breed: Breed): Promise<void> {
  try {
    const breedsJson = await AsyncStorage.getItem(STORAGE_KEYS.BREEDS_BY_ID);
    const breedsById: Record<string, Breed> = breedsJson ? JSON.parse(breedsJson) : {};
    breedsById[breed.id] = breed;
    await AsyncStorage.setItem(STORAGE_KEYS.BREEDS_BY_ID, JSON.stringify(breedsById));
  } catch (error) {
    console.error(`Failed to update cached breed ${breed.id}:`, error);
  }
}

/**
 * Manages user favorite breeds in offline storage.
 */
export async function saveFavorites(favorites: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to AsyncStorage:', error);
  }
}

/**
 * Clears all cached storage data.
 */
export async function clearAllCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.BREEDS_BY_ID,
      STORAGE_KEYS.BREED_IDS,
      STORAGE_KEYS.GROUPS_BY_ID,
      STORAGE_KEYS.LAST_SYNCED_AT,
    ]);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}
