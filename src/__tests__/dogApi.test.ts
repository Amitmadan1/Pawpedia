import { normalizeBreed, normalizeGroup } from '../api/dogApi';
import { RawBreedItem, RawGroupItem } from '../types/api';

describe('dogApi normalization', () => {
  const mockRawGroup: RawGroupItem = {
    id: 'grp-123',
    type: 'group',
    attributes: {
      name: 'Working Group',
    },
    relationships: {
      breeds: {
        data: [{ id: 'br-1', type: 'breed' }],
      },
    },
  };

  const mockRawBreed: RawBreedItem = {
    id: 'br-1',
    type: 'breed',
    attributes: {
      name: 'Bernese Mountain Dog',
      description: 'Gentle giant farm dog',
      life: { min: 7, max: 10 },
      male_weight: { min: 38, max: 52 },
      female_weight: { min: 36, max: 48 },
      hypoallergenic: false,
      male_height: { min: 64, max: 70 },
      female_height: { min: 58, max: 66 },
      origin: { era: 'Ancient', region: 'Alps', country: 'Switzerland' },
      coat: { type: 'double', colors: ['tricolor', 'black rust white'], length: 'long' },
      traits: {
        energy: 3,
        barking: 2,
        drooling: 3,
        grooming: 4,
        shedding: 5,
        trainability: 4,
        good_with_dogs: 4,
        exercise_minutes: 45,
        apartment_friendly: 2,
        good_with_children: 5,
        good_with_strangers: 4,
        temperament: ['affectionate', 'loyal', 'gentle'],
      },
      other_names: ['Berner Sennenhund'],
      recognized_by: ['AKC', 'FCI', 'UKC'],
      sources: [{ title: 'AKC Standard', url: 'https://akc.org/berner' }],
      images: [
        {
          id: 'img-1',
          url: 'https://images.dogapi.dog/berner_full.jpg',
          thumb: 'https://images.dogapi.dog/berner_thumb.jpg',
          medium: 'https://images.dogapi.dog/berner_med.jpg',
          large: 'https://images.dogapi.dog/berner_large.jpg',
          attribution: {
            author: 'Photographer A',
            license: 'CC BY 2.0',
            license_url: 'https://creativecommons.org/licenses/by/2.0',
            source: 'Wikimedia',
            source_url: 'https://commons.wikimedia.org',
          },
        },
      ],
    },
    relationships: {
      group: {
        data: { id: 'grp-123', type: 'group' },
      },
    },
  };

  it('normalizes group correctly', () => {
    const group = normalizeGroup(mockRawGroup);
    expect(group.id).toBe('grp-123');
    expect(group.name).toBe('Working Group');
    expect(group.breedIds).toEqual(['br-1']);
  });

  it('normalizes breed attributes and relationships', () => {
    const groupsById = { [mockRawGroup.id]: normalizeGroup(mockRawGroup) };
    const breed = normalizeBreed(mockRawBreed, groupsById);

    expect(breed.id).toBe('br-1');
    expect(breed.name).toBe('Bernese Mountain Dog');
    expect(breed.groupName).toBe('Working Group');
    expect(breed.groupId).toBe('grp-123');
    expect(breed.sizeBand).toBe('large'); // 38-52 kg -> large
    expect(breed.coat.length).toBe('long');
    expect(breed.traits.goodWithChildren).toBe(5);
    expect(breed.traits.temperament).toContain('affectionate');
    expect(breed.images.length).toBe(1);
    expect(breed.primaryImage?.thumb).toBe('https://images.dogapi.dog/berner_thumb.jpg');
    expect(breed.primaryImage?.attribution.author).toBe('Photographer A');
  });

  it('provides safe fallbacks for missing or partial attributes', () => {
    const minimalRawBreed: RawBreedItem = {
      id: 'br-min',
      type: 'breed',
      attributes: {
        name: 'Mystery Dog',
        description: '',
        life: {},
        male_weight: {},
        female_weight: {},
        hypoallergenic: false,
        male_height: {},
        female_height: {},
        origin: {},
        coat: {},
        traits: {},
        images: [],
      },
    };

    const breed = normalizeBreed(minimalRawBreed);
    expect(breed.name).toBe('Mystery Dog');
    expect(breed.groupName).toBe('Unknown Group');
    expect(breed.images).toEqual([]);
    expect(breed.primaryImage).toBeNull();
    expect(breed.traits.energy).toBe(3);
    expect(breed.sizeBand).toBe('medium');
  });
});
