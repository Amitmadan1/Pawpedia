import { Breed } from '../types/breed';
import { FilterState, INITIAL_FILTER_STATE } from '../types/filters';
import { countActiveFilters, filterBreeds } from '../utils/filterBreeds';

const mockBreeds: Breed[] = [
  {
    id: '1',
    name: 'Golden Retriever',
    description: 'Friendly and devoted',
    groupId: 'g-sporting',
    groupName: 'Sporting Group',
    sizeBand: 'large',
    lifeSpan: { min: 10, max: 12 },
    maleWeight: { min: 30, max: 34 },
    femaleWeight: { min: 25, max: 32 },
    maleHeight: { min: 56, max: 61 },
    femaleHeight: { min: 51, max: 56 },
    hypoallergenic: false,
    origin: { era: '19th century', region: 'Europe', country: 'Scotland' },
    coat: { type: 'double', length: 'long', colors: ['gold'] },
    traits: {
      energy: 4,
      barking: 2,
      drooling: 2,
      grooming: 3,
      shedding: 4,
      trainability: 5,
      goodWithDogs: 5,
      exerciseMinutes: 60,
      apartmentFriendly: 2,
      goodWithChildren: 5,
      goodWithStrangers: 5,
      temperament: ['friendly', 'intelligent', 'devoted'],
    },
    otherNames: ['Yellow Retriever'],
    recognizedBy: ['AKC', 'UKC'],
    sources: [],
    images: [],
    primaryImage: null,
    updatedAt: 1000,
  },
  {
    id: '2',
    name: 'Poodle (Toy)',
    description: 'Smart, small, hypoallergenic dog',
    groupId: 'g-toy',
    groupName: 'Toy Group',
    sizeBand: 'small',
    lifeSpan: { min: 14, max: 18 },
    maleWeight: { min: 3, max: 5 },
    femaleWeight: { min: 3, max: 4 },
    maleHeight: { min: 24, max: 28 },
    femaleHeight: { min: 24, max: 28 },
    hypoallergenic: true,
    origin: { era: '16th century', region: 'Europe', country: 'France' },
    coat: { type: 'curly', length: 'medium', colors: ['white', 'black'] },
    traits: {
      energy: 3,
      barking: 3,
      drooling: 1,
      grooming: 4,
      shedding: 1,
      trainability: 5,
      goodWithDogs: 4,
      exerciseMinutes: 30,
      apartmentFriendly: 5,
      goodWithChildren: 4,
      goodWithStrangers: 4,
      temperament: ['clever', 'agile'],
    },
    otherNames: ['Caniche', 'French Poodle'],
    recognizedBy: ['AKC', 'FCI'],
    sources: [],
    images: [],
    primaryImage: null,
    updatedAt: 1000,
  },
  {
    id: '3',
    name: 'Airedale Terrier',
    description: 'King of terriers with wire coat',
    groupId: 'g-terrier',
    groupName: 'Terrier Group',
    sizeBand: 'medium',
    lifeSpan: { min: 11, max: 14 },
    maleWeight: { min: 20, max: 25 },
    femaleWeight: { min: 18, max: 23 },
    maleHeight: { min: 58, max: 61 },
    femaleHeight: { min: 56, max: 58 },
    hypoallergenic: false,
    origin: { era: '19th century', region: 'Europe', country: 'United Kingdom' },
    coat: { type: 'wire', length: 'wire', colors: ['black and tan'] },
    traits: {
      energy: 4,
      barking: 4,
      drooling: 2,
      grooming: 3,
      shedding: 2,
      trainability: 4,
      goodWithDogs: 3,
      exerciseMinutes: 60,
      apartmentFriendly: 3,
      goodWithChildren: 4,
      goodWithStrangers: 3,
      temperament: ['outgoing', 'alert', 'courageous'],
    },
    otherNames: ['Waterside Terrier', 'Bingley Terrier'],
    recognizedBy: ['AKC', 'KC'],
    sources: [],
    images: [],
    primaryImage: null,
    updatedAt: 1000,
  },
];

describe('filterBreeds', () => {
  it('returns all breeds when no filters are set', () => {
    const results = filterBreeds(mockBreeds, INITIAL_FILTER_STATE);
    expect(results.length).toBe(3);
  });

  it('filters by breed name search query', () => {
    const filters: FilterState = { ...INITIAL_FILTER_STATE, searchQuery: 'poodle' };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Poodle (Toy)');
  });

  it('filters by alias / other_names search query', () => {
    const filters: FilterState = { ...INITIAL_FILTER_STATE, searchQuery: 'caniche' };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Poodle (Toy)');
  });

  it('filters by breed group', () => {
    const filters: FilterState = {
      ...INITIAL_FILTER_STATE,
      selectedGroups: ['g-sporting'],
    };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Golden Retriever');
  });

  it('filters by size band (small/medium/large)', () => {
    const filters: FilterState = {
      ...INITIAL_FILTER_STATE,
      selectedSizes: ['small'],
    };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Poodle (Toy)');
  });

  it('filters by coat length / wire', () => {
    const filters: FilterState = {
      ...INITIAL_FILTER_STATE,
      selectedCoats: ['wire'],
    };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Airedale Terrier');
  });

  it('filters by hypoallergenic flag', () => {
    const filters: FilterState = {
      ...INITIAL_FILTER_STATE,
      hypoallergenic: 'yes',
    };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].hypoallergenic).toBe(true);
  });

  it('filters by trait thresholds (e.g. goodWithChildren >= 5)', () => {
    const filters: FilterState = {
      ...INITIAL_FILTER_STATE,
      traitThresholds: { goodWithChildren: 5 },
    };
    const results = filterBreeds(mockBreeds, filters);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Golden Retriever');
  });

  it('calculates active filters count accurately', () => {
    expect(countActiveFilters(INITIAL_FILTER_STATE)).toBe(0);

    const activeFilters: FilterState = {
      ...INITIAL_FILTER_STATE,
      selectedGroups: ['g-1'],
      selectedSizes: ['small'],
      hypoallergenic: 'yes',
      traitThresholds: { goodWithDogs: 4 },
    };
    expect(countActiveFilters(activeFilters)).toBe(4);
  });
});
