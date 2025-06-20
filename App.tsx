import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { LibraryProvider } from './src/context/LibraryContext';
import AppNavigator, { RootStackParamList } from './src/navigation/AppNavigator';

// Configuración de enlace para rutas personalizadas
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['app://'], // Puedes ajustar este prefijo según la configuración de tu app
  config: {
    screens: {
      Home: 'home',
      Library: 'library',
      BookDetail: {
        path: 'book/:bookId',
        parse: {
          bookId: (bookId: string) => bookId,
        },
      },
      Reader: {
        path: 'read/:bookId',
        parse: {
          bookId: (bookId: string) => bookId,
        },
      },
    },
  },
};

const App: React.FC = () => {
  return (
    <LibraryProvider>
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </LibraryProvider>
  );
};

export default App;