import axios, { AxiosInstance } from 'axios';
import config from '../constants/config';
import { Book, ApiResponse } from '../types';
import { handleApiError, extractApiResponse } from '../utils/apiHelpers';
import API_ENDPOINTS from './endpoints';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.timeout,
});

export const getBooks = async (): Promise<Book[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Book[]>>(API_ENDPOINTS.GET_BOOKS);
    return extractApiResponse<Book[]>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBookById = async (id: string): Promise<Book> => {
  try {
    const response = await apiClient.get<ApiResponse<Book>>(API_ENDPOINTS.GET_BOOK(id));
    return extractApiResponse<Book>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  try {
    const response = await apiClient.post<ApiResponse<Book>>(API_ENDPOINTS.ADD_BOOK, bookData);
    return extractApiResponse<Book>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  try {
    const response = await apiClient.put<ApiResponse<Book>>(API_ENDPOINTS.UPDATE_BOOK(id), bookData);
    return extractApiResponse<Book>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(API_ENDPOINTS.DELETE_BOOK(id));
  } catch (error) {
    throw handleApiError(error);
  }
};

// Nuevos métodos para interactuar con el backend
export const getAuthors = async (): Promise<{id: string, name: string}[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{id: string, name: string}[]>>(API_ENDPOINTS.GET_AUTHORS);
    return extractApiResponse<{id: string, name: string}[]>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTags = async (): Promise<{id: string, name: string}[]> => {
  try {
    const response = await apiClient.get<ApiResponse<{id: string, name: string}[]>>(API_ENDPOINTS.GET_TAGS);
    return extractApiResponse<{id: string, name: string}[]>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBooksByAuthor = async (author: string): Promise<Book[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Book[]>>(API_ENDPOINTS.GET_BOOKS_BY_AUTHOR(author));
    return extractApiResponse<Book[]>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBooksByTag = async (tag: string): Promise<Book[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Book[]>>(API_ENDPOINTS.GET_BOOKS_BY_TAG(tag));
    return extractApiResponse<Book[]>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await apiClient.get<ApiResponse<Book[]>>(API_ENDPOINTS.SEARCH_BOOKS(query));
    return extractApiResponse<Book[]>(response.data);
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateReadPosition = async (
  id: string, 
  position: number, 
  cfi?: string, 
  format: string = 'EPUB',
  user: string = 'usuario1',
  device: string = 'browser'
): Promise<void> => {
  const data = {
    position,
    format,
    user,
    device,
    cfi: cfi || `epubcfi(/6/4!/1:${position})` // Generamos un CFI básico si no se proporciona
  };
  
  console.log('Enviando datos de posición:', data);
  
  try {
    // Intento 1: Usar PUT (método original)
    try {
      console.log('Intentando actualizar posición con PUT...');
      const response = await apiClient.put(API_ENDPOINTS.UPDATE_READ_POSITION(id), data);
      console.log('Respuesta al actualizar posición con PUT:', response.data);
      
      // Si la respuesta indica error pero la petición se realizó correctamente, intentamos con POST
      if (response.data && response.data.success === false) {
        throw new Error(`Error del servidor: ${response.data.message} - ${response.data.error}`);
      }
      
      return; // Si llegamos aquí, todo salió bien
    } catch (putError) {
      console.error('Error con método PUT:', putError);
      
      // Intento 2: Usar POST como alternativa
      console.log('Intentando actualizar posición con POST...');
      const postResponse = await apiClient.post(API_ENDPOINTS.UPDATE_READ_POSITION(id), data);
      console.log('Respuesta al actualizar posición con POST:', postResponse.data);
      
      if (postResponse.data && postResponse.data.success === false) {
        throw new Error(`Error del servidor (POST): ${postResponse.data.message}`);
      }
    }
  } catch (error) {
    console.error('Error completo al actualizar posición:', error);
    // No lanzamos el error para no interrumpir la experiencia de lectura
    // pero sí lo registramos para depuración
  }
};

export const getReadPosition = async (
  id: string,
  options?: {
    format?: string;
    user?: string;
    device?: string;
  }
): Promise<{
  id: number;
  book: number;
  format: string;
  user: string;
  device: string;
  cfi: string;
  epoch: number;
  pos_frac: number;
} | null> => {
  try {
    // Asegurar que siempre enviamos los parámetros predeterminados
    const defaultOptions = {
      format: 'EPUB',
      user: 'usuario1',
      device: 'browser',
      ...options // Esto permitirá sobrescribir los valores predeterminados si se proporcionan otros
    };
    
    console.log(`Obteniendo posición de lectura para el libro ${id}`, defaultOptions);
    const response = await apiClient.get(API_ENDPOINTS.GET_READ_POSITION(id, defaultOptions));
    
    // Si la respuesta es exitosa pero data es null, significa que no hay posición guardada
    if (response.data && response.data.success === true) {
      console.log('Respuesta de posición de lectura:', response.data);
      return response.data.data; // Puede ser null o un objeto con la posición
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener la posición de lectura:', error);
    // No lanzamos el error para no interrumpir la experiencia de lectura
    return null;
  }
};

// Configurar interceptor global para manejar errores
apiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(handleApiError(error))
);

export default apiClient;
