import { Breed } from '../types/breed';
import { FilterState } from '../types/filters';

/**
 * Pure filtering function for 283 breeds.
 * Evaluates search query (name + other_names), group, size, coat, hypoallergenic, and trait thresholds.
 */
export function filterBreeds(breeds: Breed[], filters: FilterState): Breed[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return breeds.filter((breed) => {
    // 1. Search Query (name or other_names)
    if (query.length > 0) {
      const nameMatch = breed.name.toLowerCase().includes(query);
      const otherNamesMatch = breed.otherNames.some((alias) =>
        alias.toLowerCase().includes(query)
      );
      if (!nameMatch && !otherNamesMatch) {
        return false;
      }
    }

    // 2. Breed Group (multi-select)
    if (filters.selectedGroups.length > 0) {
      if (!breed.groupId || !filters.selectedGroups.includes(breed.groupId)) {
        return false;
      }
    }

    // 3. Size Band (multi-select)
    if (filters.selectedSizes.length > 0) {
      if (!filters.selectedSizes.includes(breed.sizeBand)) {
        return false;
      }
    }

    // 4. Coat Length / Wire
    if (filters.selectedCoats.length > 0) {
      const coatMatch =
        filters.selectedCoats.includes(breed.coat.length) ||
        (filters.selectedCoats.includes('wire') &&
          breed.coat.type.toLowerCase().includes('wire'));
      if (!coatMatch) {
        return false;
      }
    }

    // 5. Hypoallergenic
    if (filters.hypoallergenic === 'yes' && !breed.hypoallergenic) {
      return false;
    }
    if (filters.hypoallergenic === 'no' && breed.hypoallergenic) {
      return false;
    }

    // 6. Trait Thresholds
    const { traitThresholds } = filters;
    if (
      traitThresholds.goodWithChildren &&
      breed.traits.goodWithChildren < traitThresholds.goodWithChildren
    ) {
      return false;
    }
    if (
      traitThresholds.goodWithDogs &&
      breed.traits.goodWithDogs < traitThresholds.goodWithDogs
    ) {
      return false;
    }
    if (
      traitThresholds.goodWithStrangers &&
      breed.traits.goodWithStrangers < traitThresholds.goodWithStrangers
    ) {
      return false;
    }
    if (
      traitThresholds.energyMin &&
      breed.traits.energy < traitThresholds.energyMin
    ) {
      return false;
    }
    if (
      traitThresholds.apartmentFriendly &&
      breed.traits.apartmentFriendly < traitThresholds.apartmentFriendly
    ) {
      return false;
    }

    return true;
  });
}

/**
 * Calculates how many active filter dimensions are currently engaged.
 */
export function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.selectedGroups.length > 0) count++;
  if (filters.selectedSizes.length > 0) count++;
  if (filters.selectedCoats.length > 0) count++;
  if (filters.hypoallergenic !== 'all') count++;
  const thresholds = filters.traitThresholds;
  if (thresholds.goodWithChildren && thresholds.goodWithChildren > 0) count++;
  if (thresholds.goodWithDogs && thresholds.goodWithDogs > 0) count++;
  if (thresholds.goodWithStrangers && thresholds.goodWithStrangers > 0) count++;
  if (thresholds.energyMin && thresholds.energyMin > 0) count++;
  if (thresholds.apartmentFriendly && thresholds.apartmentFriendly > 0) count++;
  return count;
}
