import { CoatLength, SizeBand } from './breed';

export type HypoallergenicFilter = 'all' | 'yes' | 'no';

export interface TraitThresholds {
  goodWithChildren?: number;
  goodWithDogs?: number;
  goodWithStrangers?: number;
  energyMin?: number;
  apartmentFriendly?: number;
}

export type SortField = 'name' | 'energy' | 'size' | 'lifeSpan';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  selectedGroups: string[]; // group IDs
  selectedSizes: SizeBand[];
  selectedCoats: CoatLength[];
  hypoallergenic: HypoallergenicFilter;
  traitThresholds: TraitThresholds;
  groupByGroup: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export const INITIAL_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedGroups: [],
  selectedSizes: [],
  selectedCoats: [],
  hypoallergenic: 'all',
  traitThresholds: {},
  groupByGroup: true,
  sortBy: 'name',
  sortOrder: 'asc',
};
