import { API_BASE_URL } from '../constants/config';

export const API_ENDPOINTS = {
  // Endpoints principales para libros
  GET_BOOKS: `${API_BASE_URL}/books`,
  GET_BOOK: (id: string): string => `${API_BASE_URL}/books/${id}`,
  ADD_BOOK: `${API_BASE_URL}/books`,
  UPDATE_BOOK: (id: string): string => `${API_BASE_URL}/books/${id}`,
  DELETE_BOOK: (id: string): string => `${API_BASE_URL}/books/${id}`,
  
  // Endpoints para autores y etiquetas
  GET_AUTHORS: `${API_BASE_URL}/authors`,
  GET_TAGS: `${API_BASE_URL}/tags`,
  GET_BOOKS_BY_AUTHOR: (author: string): string => `${API_BASE_URL}/books/author/${encodeURIComponent(author)}`,
  GET_BOOKS_BY_TAG: (tag: string): string => `${API_BASE_URL}/books/tag/${encodeURIComponent(tag)}`,
    // Búsqueda
  SEARCH_BOOKS: (query: string): string => `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
    // Posición de lectura
  UPDATE_READ_POSITION: (id: string): string => `${API_BASE_URL}/books/${id}/position`,
  GET_READ_POSITION: (id: string, options?: { format?: string; user?: string; device?: string }): string => {
    let url = `${API_BASE_URL}/books/${id}/position`;
    if (options) {
      const params = new URLSearchParams();
      if (options.format) params.append('format', options.format);
      if (options.user) params.append('user', options.user);
      if (options.device) params.append('device', options.device);
      
      const paramString = params.toString();
      if (paramString) url += `?${paramString}`;
    }
    return url;
  },
  // Método alternativo usando POST para posición de lectura
  SAVE_READ_POSITION: (id: string): string => `${API_BASE_URL}/books/${id}/save-position`,
  
  // Acceso a archivos
  GET_FILE: (path: string): string => `${API_BASE_URL}/file/${encodeURIComponent(path)}`,
  GET_COVER: (id: string): string => `${API_BASE_URL}/books/${id}/cover`,
  GET_EPUB: (id: string): string => `${API_BASE_URL}/books/${id}/epub`,
};

// Implementar las funciones para mantener compatibilidad con código existente
export const fetchEpubs = async (): Promise<any[]> => {
  const response = await fetch(API_ENDPOINTS.GET_BOOKS);
  if (!response.ok) {
    throw new Error('Error fetching books');
  }
  const data = await response.json();
  return data.data || [];
};

export const uploadEpub = async (data: any): Promise<any> => {
  const response = await fetch(API_ENDPOINTS.ADD_BOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error uploading book');
  }
  
  return await response.json();
};

export default API_ENDPOINTS;