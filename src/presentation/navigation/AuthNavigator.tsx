import React from 'react';
import { View, Text } from 'react-native';
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
  const { isAuthenticated, isLoading, error } = useAuth();

  // Si está cargando, podríamos mostrar una pantalla de splash o un indicador de carga
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>Cargando información de usuario...</Text>
        <Text style={{ color: '#666', marginBottom: 10 }}>Estado: Verificando autenticación</Text>
      </View>
    );
  }

  // Añadimos información de depuración si hay un error
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 18, color: 'red', marginBottom: 20 }}>Error de autenticación</Text>
        <Text style={{ color: '#666', marginBottom: 10 }}>Mensaje: {error}</Text>
        <Text style={{ color: '#666', marginBottom: 10 }}>Estado autenticado: {isAuthenticated ? 'Sí' : 'No'}</Text>
      </View>
    );
  }
  console.log('AuthNavigator: Renderizando navegación', {
    isAuthenticated,
    isLoading,
    hasError: !!error
  });

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
