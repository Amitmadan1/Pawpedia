import {
  RawBreedItem,
  RawBreedsResponse,
  RawGroupItem,
  RawGroupsResponse,
  RawSingleBreedResponse,
} from '../types/api';
import {
  Breed,
  BreedCoat,
  BreedGroup,
  BreedImage,
  BreedOrigin,
  BreedTraits,
  CoatLength,
  NumericRange,
} from '../types/breed';
import { deriveSizeBand } from '../utils/sizeBuckets';
import { apiFetch } from './client';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://dogapi.dog/api/v2';
const PAGE_SIZE = 48;

/**
 * Normalizes a raw Dog API breed item into a clean domain entity.
 */
export function normalizeBreed(
  item: RawBreedItem,
  groupsById: Record<string, BreedGroup> = {}
): Breed {
  const { id, attributes, relationships } = item;
  const groupId = relationships?.group?.data?.id || null;
  const groupName = (groupId && groupsById[groupId]?.name) || 'Unknown Group';

  const parseRange = (raw?: { min?: number; max?: number }, defaultMin = 0, defaultMax = 0): NumericRange => ({
    min: typeof raw?.min === 'number' ? raw.min : defaultMin,
    max: typeof raw?.max === 'number' ? raw.max : (typeof raw?.min === 'number' ? raw.min : defaultMax),
  });

  const maleWeight = parseRange(attributes.male_weight, 10, 20);
  const femaleWeight = parseRange(attributes.female_weight, 8, 18);
  const maleHeight = parseRange(attributes.male_height, 30, 45);
  const femaleHeight = parseRange(attributes.female_height, 28, 42);
  const lifeSpan = parseRange(attributes.life, 10, 14);

  const rawCoatLength = (attributes.coat?.length || 'medium').toLowerCase();
  let coatLength: CoatLength = 'medium';
  if (rawCoatLength.includes('short')) coatLength = 'short';
  else if (rawCoatLength.includes('long')) coatLength = 'long';
  else if (rawCoatLength.includes('wire')) coatLength = 'wire';
  else if (rawCoatLength.includes('hairless')) coatLength = 'hairless';

  // Check if coat type mentions wire
  if (attributes.coat?.type?.toLowerCase() === 'wire') {
    coatLength = 'wire';
  }

  const coat: BreedCoat = {
    type: attributes.coat?.type || 'Standard',
    colors: Array.isArray(attributes.coat?.colors) ? attributes.coat.colors : [],
    length: coatLength,
  };

  const origin: BreedOrigin = {
    era: attributes.origin?.era || 'Historic',
    region: attributes.origin?.region || 'Global',
    country: attributes.origin?.country || 'Unknown',
  };

  const rawTraits = attributes.traits || {};
  const traits: BreedTraits = {
    energy: rawTraits.energy ?? 3,
    barking: rawTraits.barking ?? 3,
    drooling: rawTraits.drooling ?? 1,
    grooming: rawTraits.grooming ?? 3,
    shedding: rawTraits.shedding ?? 3,
    trainability: rawTraits.trainability ?? 3,
    goodWithDogs: rawTraits.good_with_dogs ?? 3,
    exerciseMinutes: rawTraits.exercise_minutes ?? 45,
    apartmentFriendly: rawTraits.apartment_friendly ?? 3,
    goodWithChildren: rawTraits.good_with_children ?? 3,
    goodWithStrangers: rawTraits.good_with_strangers ?? 3,
    temperament: Array.isArray(rawTraits.temperament) ? rawTraits.temperament : [],
  };

  const images: BreedImage[] = (attributes.images || []).map((img) => ({
    id: img.id,
    url: img.url,
    thumb: img.thumb || img.url,
    medium: img.medium || img.url,
    large: img.large || img.url,
    attribution: {
      author: img.attribution?.author || 'Unknown Photographer',
      license: img.attribution?.license || 'CC Attribution',
      licenseUrl: img.attribution?.license_url,
      source: img.attribution?.source || 'dogapi.dog',
      sourceUrl: img.attribution?.source_url,
    },
  }));

  const sizeBand = deriveSizeBand(maleWeight, femaleWeight, maleHeight, femaleHeight);

  return {
    id,
    name: attributes.name || 'Unnamed Breed',
    description: attributes.description || 'No description available.',
    groupId,
    groupName,
    sizeBand,
    lifeSpan,
    maleWeight,
    femaleWeight,
    maleHeight,
    femaleHeight,
    hypoallergenic: Boolean(attributes.hypoallergenic),
    origin,
    coat,
    traits,
    otherNames: Array.isArray(attributes.other_names) ? attributes.other_names : [],
    recognizedBy: Array.isArray(attributes.recognized_by) ? attributes.recognized_by : [],
    sources: (attributes.sources || []).map((s) => ({
      title: s.title || 'Breed Standard',
      url: s.url || '',
    })),
    images,
    primaryImage: images.length > 0 ? images[0] : null,
    updatedAt: Date.now(),
  };
}

/**
 * Normalizes a raw breed group item.
 */
export function normalizeGroup(item: RawGroupItem): BreedGroup {
  const breedIds = item.relationships?.breeds?.data?.map((b) => b.id) || [];
  return {
    id: item.id,
    name: item.attributes?.name || 'Unnamed Group',
    breedIds,
  };
}

/**
 * Fetches all 9 breed groups.
 */
export async function fetchGroups(): Promise<Record<string, BreedGroup>> {
  const url = `${BASE_URL}/groups`;
  const response = await apiFetch<RawGroupsResponse>(url);
  const groupsById: Record<string, BreedGroup> = {};

  for (const item of response.data) {
    groupsById[item.id] = normalizeGroup(item);
  }
  return groupsById;
}

/**
 * Fetches a single page of breeds.
 */
export async function fetchBreedsPage(
  pageNumber: number,
  pageSize: number = PAGE_SIZE
): Promise<RawBreedsResponse> {
  const url = `${BASE_URL}/breeds?page[size]=${pageSize}&page[number]=${pageNumber}`;
  return apiFetch<RawBreedsResponse>(url);
}

/**
 * Fetches and merges all 6 pages of breeds into a single complete dataset (283 records).
 * Also passes progress updates back to callers.
 */
export async function fetchAllBreeds(
  groupsById: Record<string, BreedGroup>,
  onProgress?: (loadedCount: number, totalCount: number) => void
): Promise<Breed[]> {
  // Page 1 gives metadata and pagination info
  const firstPage = await fetchBreedsPage(1, PAGE_SIZE);
  const totalPages = firstPage.meta?.pagination?.last || 6;
  const totalRecords = firstPage.meta?.pagination?.records || 283;

  let allRawItems: RawBreedItem[] = [...firstPage.data];
  if (onProgress) {
    onProgress(allRawItems.length, totalRecords);
  }

  // Fetch remaining pages in parallel batches for fast loading
  if (totalPages > 1) {
    const pageNumbers: number[] = [];
    for (let p = 2; p <= totalPages; p++) {
      pageNumbers.push(p);
    }

    const remainingPages = await Promise.all(
      pageNumbers.map(async (pageNum) => {
        const pageData = await fetchBreedsPage(pageNum, PAGE_SIZE);
        return pageData.data;
      })
    );

    for (const items of remainingPages) {
      allRawItems = allRawItems.concat(items);
      if (onProgress) {
        onProgress(allRawItems.length, totalRecords);
      }
    }
  }

  // Deduplicate and normalize
  const seenIds = new Set<string>();
  const normalizedBreeds: Breed[] = [];

  for (const item of allRawItems) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      normalizedBreeds.push(normalizeBreed(item, groupsById));
    }
  }

  return normalizedBreeds;
}

/**
 * Fetches a single breed by ID for detail enrichment or refresh.
 */
export async function fetchBreedById(
  id: string,
  groupsById: Record<string, BreedGroup>
): Promise<Breed> {
  const url = `${BASE_URL}/breeds/${id}`;
  const response = await apiFetch<RawSingleBreedResponse>(url);
  return normalizeBreed(response.data, groupsById);
}
