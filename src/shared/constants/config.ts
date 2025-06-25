export interface Config {
  apiUrl: string;
  timeout: number;
  maxBooks: number;
  authTokenKey: string;
  userDataKey: string;
}

// Prefijo de versión de la API
export const API_VERSION = '/api/v1';

// Usamos localhost para desarrollo y la URL del contenedor para producción (sin /api ni /v1)
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'http://api:3000'  // URL dentro del contenedor Docker
    : 'http://localhost:3000';  // URL para desarrollo local

export let API_BASE_URL_CUSTOM: string | null = null;

// Función para actualizar la URL custom en runtime (opcional, para hot reload)
export function setApiBaseUrlCustom(url: string) {
  API_BASE_URL_CUSTOM = url;
}

// Devuelve la URL base a usar (custom si existe, si no la default)
export function getApiBaseUrl(): string {
  return API_BASE_URL_CUSTOM || API_BASE_URL;
}

// Devuelve la URL base + versión (siempre termina sin barra final)
export function getApiUrlWithVersion(): string {
  const base = getApiBaseUrl();
  return `${base.replace(/\/$/, '')}${API_VERSION}`;
}

const config: Config = {
  apiUrl: getApiUrlWithVersion(),
  timeout: 5000, // Tiempo de espera para las solicitudes
  maxBooks: 100, // Número máximo de libros a mostrar
  authTokenKey: 'auth_token',
  userDataKey: 'user_data',
};

export default config;
