import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';
import { LibraryProvider } from './src/shared/context/LibraryContext';
import { AuthProvider } from './src/shared/context/AuthContext';
import AuthNavigator from './src/presentation/navigation/AuthNavigator';
import { RootStackParamList } from './src/presentation/navigation/AppNavigator';

// Habilitar las pantallas nativas para mejor rendimiento
enableScreens();

// Configuración de enlace para rutas personalizadas
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['app://'], // Puedes ajustar este prefijo según la configuración de tu app
  config: {
    screens: {
      TabNavigator: {
        screens: {
          Home: 'home',
          Library: 'library',
        }
      },
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
    <SafeAreaProvider>
      <AuthProvider>
        <LibraryProvider>
          <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
          <NavigationContainer linking={linking}>
            <AuthNavigator />
          </NavigationContainer>
        </LibraryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;