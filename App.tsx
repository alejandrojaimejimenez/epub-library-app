import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import 'react-native-gesture-handler';
import { LibraryProvider } from './src/shared/context/LibraryContext';
import { AuthProvider } from './src/shared/context/AuthContext';
import AuthNavigator from './src/presentation/navigation/AuthNavigator';
import AppNavigator, { RootStackParamList } from './src/presentation/navigation/AppNavigator';
import { AuthStackParamList } from './src/presentation/navigation/AuthNavigator';

// Habilitar las pantallas nativas para mejor rendimiento
enableScreens();

// Definir el tipo para todas las rutas posibles
export type AppRoutes = {
  Auth: AuthStackParamList;
  App: RootStackParamList;
};

// Definir tipos específicos para la configuración de linking
type AppLinkingConfig = {
  screens: {
    Auth: {
      screens: {
        Login: string;
        Register: string;
      };
    };
    App: {
      screens: {
        TabNavigator: {
          screens: {
            Home: string;
            Library: string;
          };
        };
        BookDetail: string;
        Reader: string;
      };
    };
  };
};

// Configuración de enlace para rutas personalizadas
const linking: LinkingOptions<AppRoutes> & { config: AppLinkingConfig } = {
  enabled: true,
  prefixes: ['epublibraryapp://', 'http://localhost:19006'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register'
        }
      },
      App: {
        screens: {
          TabNavigator: {
            screens: {
              Home: '',
              Library: 'library'
            }
          },
          BookDetail: 'book/:bookId',
          Reader: 'book/:bookId/read'
        }
      }
    }
  }
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LibraryProvider>
          <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
          <NavigationContainer
            linking={linking}
            fallback={<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Cargando aplicación...</Text>
            </View>}
            onStateChange={(state) => {
              console.log('Navegación - Nuevo estado:', state);
            }}
            onReady={() => {
              console.log('Navegación - Contenedor listo');
            }}
          >
            <AuthNavigator />
          </NavigationContainer>
        </LibraryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;