import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { MUser, MLoginCredentials, MRegisterData } from '@models/Auth';
import { SAuth } from '@services/auth';
import { AuthRepository } from '@data/AuthRepository';
import { getAuthToken, setAuthToken, setUserData, getUserData, clearAuthData, clearAllUserStorage } from '@utils/authStorage';

// Define el tipo para el contexto de autenticación
export interface AuthContextType {
  user: MUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: MLoginCredentials) => Promise<void>;
  register: (data: MRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Inicializa el servicio de autenticación con el patrón de inyección de dependencias
const authRepository = new AuthRepository();
const authService = new SAuth(authRepository);

// Crea el contexto
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<MUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Comprueba si el usuario está autenticado al cargar la aplicación
  useEffect(() => {
    const loadUser = async () => {
      console.log('🔄 Iniciando carga de datos de usuario');
      try {
        const storedToken = await getAuthToken();
        console.log('📝 Token almacenado:', storedToken ? 'Encontrado' : 'No encontrado');
        if (storedToken) {
          console.log('🔑 Token válido, obteniendo datos de usuario');
          const userData = await getUserData();
          console.log('👤 Datos de usuario:', userData);
          setUser(userData);
          setToken(storedToken);
          console.log('✅ Usuario autenticado correctamente');
        } else {
          console.log('❌ No hay token almacenado, usuario no autenticado');
          await clearAllUserStorage(); // Limpia storage si no hay token
        }
      } catch (err) {
        console.error('❌ Error cargando datos de usuario:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuario');
        await clearAllUserStorage(); // Limpia storage si hay error de autenticación
      } finally {
        console.log('🏁 Finalizada la carga de datos de usuario');
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);
  // Función para iniciar sesión
  const login = async (credentials: MLoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (!response || !response.token || !response.user) {
        throw new Error('Respuesta de autenticación inválida');
      }
      setToken(response.token);
      setUser(response.user);
      await setAuthToken(response.token);
      await setUserData(response.user);
    } catch (err) {
      console.error('Error de login:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      await clearAllUserStorage(); // Limpia storage si hay error de autenticación
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Función para registrar un nuevo usuario
  const register = async (data: MRegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(data);
      if (!response || !response.token || !response.user) {
        throw new Error('Respuesta de registro inválida');
      }
      setToken(response.token);
      setUser(response.user);
      await setAuthToken(response.token);
      await setUserData(response.user);
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err instanceof Error ? err.message : 'Error al registrarse');
      await clearAllUserStorage(); // Limpia storage si hay error de autenticación
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Función para cerrar sesión
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      await clearAllUserStorage(); // Limpia storage al hacer logout
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
      await clearAllUserStorage(); // Limpia storage aunque falle logout
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar errores
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
