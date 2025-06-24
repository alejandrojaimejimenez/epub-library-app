import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from '@screens/HomeScreen';
import LibraryScreen from '@screens/LibraryScreen';
import BookDetailScreen from '@screens/BookDetailScreen';
import ReaderScreen from '@screens/ReaderScreen';

// Types
import { MBook } from '@models/Book';

// Define los tipos de parámetros para las rutas
export type RootStackParamList = {
  TabNavigator: undefined;
  BookDetail: { bookId: string } | { book: MBook };
  Reader: { bookId: string; initialPosition?: number; initialCfi?: string } | { book: MBook; initialPosition?: number; initialCfi?: string };
};

export type TabParamList = {
  Home: undefined;
  Library: undefined;
};

// Crea los navegadores
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Navegador de pestañas
const TabNavigator = () => {
  console.log('🔄 Renderizando TabNavigator');
  
  return (    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#fff',
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Inicio',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TabIcon name="home" color={color} size={size} />
          )
        }} 
      />
      <Tab.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ 
          title: 'Biblioteca',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TabIcon name="book" color={color} size={size} />
          )
        }} 
      />
    </Tab.Navigator>
  );
};

// Componente simple para iconos (puedes reemplazar con la librería de iconos que prefieras)
const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  // Simplemente devolvemos un texto para representar el icono
  // Normalmente usarías algo como React Native Vector Icons aquí
  return <Text style={{ color, fontSize: size }}>{name === 'home' ? '🏠' : '📚'}</Text>;
};

// Navegador principal
const AppNavigator = () => {
  console.log('🔄 Renderizando AppNavigator');

  return (    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          // El estilo de la tarjeta ahora incluye pointerEvents como parte del estilo,
          // no como propiedad independiente
          pointerEvents: 'auto',
        }
      }}
      initialRouteName="TabNavigator"
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="BookDetail" component={BookDetailScreen} />
      <Stack.Screen 
        name="Reader" 
        component={ReaderScreen} 
        options={{ 
          gestureEnabled: false,
        }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
