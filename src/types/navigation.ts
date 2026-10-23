import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainTabParamList = {
  Explore: undefined;
  Favorites: undefined;
  Compare: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  BreedList: undefined; // Alias for backward compatibility
  BreedDetail: { breedId: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type BreedListScreenProps = MainTabProps<'Explore'>;
export type FavoritesScreenProps = MainTabProps<'Favorites'>;
export type CompareScreenProps = MainTabProps<'Compare'>;
export type SettingsScreenProps = MainTabProps<'Settings'>;
export type BreedDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'BreedDetail'>;

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
