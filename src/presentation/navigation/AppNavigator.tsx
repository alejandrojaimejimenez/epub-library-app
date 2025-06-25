import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Screens
import HomeScreen from '@screens/HomeScreen';
import LibraryScreen from '@screens/LibraryScreen/LibraryScreen';
import BookDetailScreen from '@screens/BookDetailScreen';
import ReaderScreen from '@screens/ReaderScreen';
import SettingsScreen from '@screens/SettingsScreen';

// Types
import { MBook } from '@models/Book';

// Define los tipos de parámetros para las rutas
export type RootStackParamList = {
  Home: undefined;
  Library: undefined;
  BookDetail: { bookId: string } | { book: MBook };
  Reader: { bookId: string; initialPosition?: number; initialCfi?: string } | { book: MBook; initialPosition?: number; initialCfi?: string };
  Settings: undefined;
};

// Crea el navegador
const Stack = createStackNavigator<RootStackParamList>();

// Navegador principal
const AppNavigator = () => {
  console.log('🔄 Renderizando AppNavigator');

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          // El estilo de la tarjeta ahora incluye pointerEvents como parte del estilo,
          // no como propiedad independiente
          pointerEvents: 'auto',
        }
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen 
        name="Reader" 
        component={ReaderScreen} 
        options={{ 
          gestureEnabled: false,
        }} 
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
