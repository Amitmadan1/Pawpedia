import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useBreedStore } from '../store/useBreedStore';
import { useTheme } from '../theme/ThemeContext';
import { BreedDetailScreen } from '../screens/BreedDetailScreen';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors, isDark } = useTheme();
  const hydrateFromStorage = useBreedStore((s) => s.hydrateFromStorage);

  // Restore cached catalog on mount (<3s to interactive)
  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  const navTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '900' as const },
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="BreedList" component={MainTabNavigator} />
        <Stack.Screen name="BreedDetail" component={BreedDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
