/**
 * Dog API v2 JSON:API response structures
 */

export interface JsonApiLinks {
  self?: string;
  current?: string;
  next?: string;
  last?: string;
  prev?: string;
}

export interface JsonApiPagination {
  current: number;
  next?: number;
  last: number;
  records: number;
}

export interface JsonApiMeta {
  pagination?: JsonApiPagination;
}

export interface JsonApiRelationship {
  data: {
    id: string;
    type: string;
  } | null;
}

export interface RawImageAttribution {
  author?: string;
  license?: string;
  license_url?: string;
  source?: string;
  source_url?: string;
}

export interface RawBreedImage {
  id: string;
  url: string;
  thumb: string;
  medium: string;
  large: string;
  attribution?: RawImageAttribution;
}

export interface RawRange {
  min?: number;
  max?: number;
}

export interface RawOrigin {
  era?: string;
  region?: string;
  country?: string;
}

export interface RawCoat {
  type?: string;
  colors?: string[];
  length?: string;
}

export interface RawTraits {
  energy?: number;
  barking?: number;
  drooling?: number;
  grooming?: number;
  shedding?: number;
  temperament?: string[];
  trainability?: number;
  good_with_dogs?: number;
  exercise_minutes?: number;
  apartment_friendly?: number;
  good_with_children?: number;
  good_with_strangers?: number;
}

export interface RawSource {
  url?: string;
  title?: string;
}

export interface RawBreedAttributes {
  name: string;
  description: string;
  life: RawRange;
  male_weight: RawRange;
  female_weight: RawRange;
  hypoallergenic: boolean;
  male_height: RawRange;
  female_height: RawRange;
  origin: RawOrigin;
  coat: RawCoat;
  traits: RawTraits;
  other_names?: string[];
  recognized_by?: string[];
  sources?: RawSource[];
  images: RawBreedImage[];
}

export interface RawBreedItem {
  id: string;
  type: 'breed';
  attributes: RawBreedAttributes;
  relationships?: {
    group?: JsonApiRelationship;
  };
}

export interface RawBreedsResponse {
  data: RawBreedItem[];
  meta?: JsonApiMeta;
  links?: JsonApiLinks;
}

export interface RawSingleBreedResponse {
  data: RawBreedItem;
}

export interface RawGroupAttributes {
  name: string;
}

export interface RawGroupItem {
  id: string;
  type: 'group';
  attributes: RawGroupAttributes;
  relationships?: {
    breeds?: {
      data: Array<{ id: string; type: 'breed' }>;
    };
  };
}

export interface RawGroupsResponse {
  data: RawGroupItem[];
}
