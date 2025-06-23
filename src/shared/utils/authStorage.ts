import AsyncStorage from '@react-native-async-storage/async-storage';
import { MUser } from '@models/Auth';

// Constantes para las claves de almacenamiento
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

// Funciones para manejar el token de autenticación
export const setAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    console.log('🔐 getAuthToken:', token ? 'Token encontrado' : 'No hay token');
    return token;
  } catch (error) {
    console.error('❌ Error al obtener token:', error);
    return null;
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    console.log('🗑️ Token eliminado correctamente');
  } catch (error) {
    console.error('❌ Error al eliminar token:', error);
  }
};

// Funciones para manejar los datos del usuario
export const setUserData = async (userData: MUser): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const getUserData = async (): Promise<MUser | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    console.log('👤 getUserData:', data ? 'Datos encontrados' : 'No hay datos');
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('📋 Datos de usuario:', parsedData);
      return parsedData;
    }
    return null;
  } catch (error) {
    console.error('❌ Error al obtener datos de usuario:', error);
    return null;
  }
};

export const removeUserData = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Función para limpiar todos los datos de autenticación
export const clearAuthData = async (): Promise<void> => {
  await Promise.all([
    removeAuthToken(),
    removeUserData()
  ]);
};
