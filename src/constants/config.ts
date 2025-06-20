export interface Config {
  apiUrl: string;
  timeout: number;
  maxBooks: number;
}

// Usamos localhost para desarrollo y la URL del contenedor para producción
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? 'http://api:3000/api'  // URL dentro del contenedor Docker
    : 'http://localhost:3000/api';  // URL para desarrollo local

const config: Config = {
  apiUrl: API_BASE_URL,
  timeout: 5000, // Tiempo de espera para las solicitudes
  maxBooks: 100, // Número máximo de libros a mostrar
};

export default config;