import { useEffect, useMemo, useState } from 'react';
import { Breed } from '../types/breed';
import { FilterState, INITIAL_FILTER_STATE } from '../types/filters';
import { countActiveFilters, filterBreeds } from '../utils/filterBreeds';

export interface GroupedBreedSection {
  title: string;
  groupId: string;
  data: Breed[];
}

export function useBreedFilters(breeds: Breed[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 250ms debounce for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(filters.searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [filters.searchQuery]);

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      searchQuery: debouncedQuery,
    }),
    [filters, debouncedQuery]
  );

  const filteredBreeds = useMemo(() => {
    const results = filterBreeds(breeds, effectiveFilters);

    // Sort results
    return [...results].sort((a, b) => {
      if (filters.sortBy === 'name') {
        const comp = a.name.localeCompare(b.name);
        return filters.sortOrder === 'asc' ? comp : -comp;
      }
      if (filters.sortBy === 'energy') {
        const comp = a.traits.energy - b.traits.energy;
        return filters.sortOrder === 'asc' ? comp : -comp;
      }
      if (filters.sortBy === 'lifeSpan') {
        const comp = a.lifeSpan.max - b.lifeSpan.max;
        return filters.sortOrder === 'asc' ? comp : -comp;
      }
      return 0;
    });
  }, [breeds, effectiveFilters, filters.sortBy, filters.sortOrder]);

  // Grouped by breed group if enabled
  const groupedSections = useMemo((): GroupedBreedSection[] => {
    if (!filters.groupByGroup) return [];

    const groupMap = new Map<string, { title: string; breeds: Breed[] }>();

    for (const breed of filteredBreeds) {
      const gId = breed.groupId || 'other';
      const gTitle = breed.groupName || 'Other Breeds';

      if (!groupMap.has(gId)) {
        groupMap.set(gId, { title: gTitle, breeds: [] });
      }
      groupMap.get(gId)!.breeds.push(breed);
    }

    return Array.from(groupMap.entries())
      .sort((a, b) => a[1].title.localeCompare(b[1].title))
      .map(([groupId, { title, breeds: items }]) => ({
        title,
        groupId,
        data: items,
      }));
  }, [filteredBreeds, filters.groupByGroup]);

  const activeFiltersCount = useMemo(
    () => countActiveFilters(filters),
    [filters]
  );

  const resetFilters = () => {
    setFilters((prev) => ({
      ...INITIAL_FILTER_STATE,
      groupByGroup: prev.groupByGroup,
    }));
  };

  return {
    filters,
    setFilters,
    filteredBreeds,
    groupedSections,
    activeFiltersCount,
    resetFilters,
  };
}
