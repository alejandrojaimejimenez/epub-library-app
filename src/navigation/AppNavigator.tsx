import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import ReaderScreen from '../screens/ReaderScreen';
import Header from '../components/common/Header';

// Definimos los tipos para los parámetros de navegación
export type RootStackParamList = {
  Home: undefined;
  Library: undefined;
  BookDetail: { bookId: string };
  Reader: { bookId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ 
          title: 'Inicio' 
        }}
      />
      <Stack.Screen 
        name="Library" 
        component={LibraryScreen} 
        options={{ 
          title: 'Biblioteca' 
        }}
      />
      <Stack.Screen 
        name="BookDetail" 
        component={BookDetailScreen} 
        options={{ 
          title: 'Detalle del Libro'
        }}
      />
      <Stack.Screen 
        name="Reader" 
        component={ReaderScreen} 
        options={{ 
          title: 'Lector'
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;