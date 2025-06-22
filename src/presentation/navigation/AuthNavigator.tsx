import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../../shared/hooks/useAuth';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AppNavigator from './AppNavigator';

// Define los tipos para las rutas de autenticación
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  App: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Si está cargando, podríamos mostrar una pantalla de splash o un indicador de carga
  if (isLoading) {
    return null; // O un componente de carga
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        // Usuario autenticado: mostrar la aplicación principal
        <Stack.Screen name="App" component={AppNavigator} />
      ) : (
        // Usuario no autenticado: mostrar pantallas de autenticación
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
