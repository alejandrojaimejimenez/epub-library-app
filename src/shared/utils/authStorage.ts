import AsyncStorage from '@react-native-async-storage/async-storage';

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
  return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const removeAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Funciones para manejar los datos del usuario
export const setUserData = async (userData: any): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
};

export const getUserData = async (): Promise<any | null> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
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
