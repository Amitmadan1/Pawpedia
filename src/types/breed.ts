/**
 * Domain types for Pawpedia app
 */

export type SizeBand = 'small' | 'medium' | 'large' | 'giant';

export type CoatLength = 'short' | 'medium' | 'long' | 'wire' | 'hairless';

export interface ImageAttribution {
  author: string;
  license: string;
  licenseUrl?: string;
  source: string;
  sourceUrl?: string;
}

export interface BreedImage {
  id: string;
  url: string;
  thumb: string;
  medium: string;
  large: string;
  attribution: ImageAttribution;
}

export interface NumericRange {
  min: number;
  max: number;
}

export interface BreedOrigin {
  era: string;
  region: string;
  country: string;
}

export interface BreedCoat {
  type: string;
  colors: string[];
  length: CoatLength;
}

export interface BreedTraits {
  energy: number;
  barking: number;
  drooling: number;
  grooming: number;
  shedding: number;
  trainability: number;
  goodWithDogs: number;
  exerciseMinutes: number;
  apartmentFriendly: number;
  goodWithChildren: number;
  goodWithStrangers: number;
  temperament: string[];
}

export interface BreedSource {
  title: string;
  url: string;
}

export interface BreedGroup {
  id: string;
  name: string;
  breedIds: string[];
}

export interface Breed {
  id: string;
  name: string;
  description: string;
  groupId: string | null;
  groupName: string;
  sizeBand: SizeBand;
  lifeSpan: NumericRange;
  maleWeight: NumericRange;
  femaleWeight: NumericRange;
  maleHeight: NumericRange;
  femaleHeight: NumericRange;
  hypoallergenic: boolean;
  origin: BreedOrigin;
  coat: BreedCoat;
  traits: BreedTraits;
  otherNames: string[];
  recognizedBy: string[];
  sources: BreedSource[];
  images: BreedImage[];
  primaryImage: BreedImage | null;
  updatedAt: number;
}

export type TraitKey =
  | 'energy'
  | 'barking'
  | 'drooling'
  | 'grooming'
  | 'shedding'
  | 'trainability'
  | 'goodWithDogs'
  | 'exerciseMinutes'
  | 'apartmentFriendly'
  | 'goodWithChildren'
  | 'goodWithStrangers';
