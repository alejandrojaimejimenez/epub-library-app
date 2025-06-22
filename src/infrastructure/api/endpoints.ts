import { API_BASE_URL } from '../../shared/constants/config';

// API Endpoints
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  
  // Libros
  GET_BOOKS: `${API_BASE_URL}/books`,
  GET_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
  ADD_BOOK: `${API_BASE_URL}/books`,
  UPDATE_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
  DELETE_BOOK: (id: string) => `${API_BASE_URL}/books/${id}`,
  SEARCH_BOOKS: (query: string) => `${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`,
  
  // Autores
  GET_AUTHORS: `${API_BASE_URL}/authors`,
  GET_BOOKS_BY_AUTHOR: (author: string) => `${API_BASE_URL}/books/author/${encodeURIComponent(author)}`,
  
  // Etiquetas
  GET_TAGS: `${API_BASE_URL}/tags`,
  GET_BOOKS_BY_TAG: (tag: string) => `${API_BASE_URL}/books/tag/${encodeURIComponent(tag)}`,
  
  // EPUB
  GET_EPUB: (bookId: string) => `${API_BASE_URL}/books/${bookId}/epub`,
  GET_COVER: (bookId: string) => `${API_BASE_URL}/books/${bookId}/cover`,
  
  // Posiciones de lectura
  UPDATE_READ_POSITION: (id: string) => `${API_BASE_URL}/books/${id}/position`,
  GET_READ_POSITION: (id: string, options?: { format?: string; user?: string; device?: string }) => {
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
};
