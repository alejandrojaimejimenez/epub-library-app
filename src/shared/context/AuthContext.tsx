import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../../domain/models/Auth';
import { AuthService } from '../../application/services/auth';
import { getAuthToken, setAuthToken, setUserData, getUserData, clearAuthData } from '../utils/authStorage';

// Define el tipo para el contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

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
  const [user, setUser] = useState<User | null>(null);
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
        }
      } catch (err) {
        console.error('❌ Error cargando datos de usuario:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar usuario');
      } finally {
        console.log('🏁 Finalizada la carga de datos de usuario');
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);
  // Función para iniciar sesión
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.login(credentials);
      // Comprobamos que la respuesta tiene la estructura esperada
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
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  // Función para registrar un nuevo usuario
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await AuthService.register(data);
      // Comprobamos que la respuesta tiene la estructura esperada
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
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    setIsLoading(true);
    try {
      await clearAuthData();
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
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
