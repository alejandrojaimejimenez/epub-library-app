import { getApiUrlWithVersion } from '@constants/config';

// API Endpoints
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: `${getApiUrlWithVersion()}/auth/login`,
  REGISTER: `${getApiUrlWithVersion()}/auth/register`,
  PROFILE: `${getApiUrlWithVersion()}/auth/profile`,
  
  // Libros
  GET_BOOKS: `${getApiUrlWithVersion()}/books`,
  GET_BOOK: (id: string) => `${getApiUrlWithVersion()}/books/${id}`,
  ADD_BOOK: `${getApiUrlWithVersion()}/books`,
  UPDATE_BOOK: (id: string) => `${getApiUrlWithVersion()}/books/${id}`,
  DELETE_BOOK: (id: string) => `${getApiUrlWithVersion()}/books/${id}`,
  SEARCH_BOOKS: (query: string) => `${getApiUrlWithVersion()}/books/search?q=${encodeURIComponent(query)}`,
  
  // Autores
  GET_AUTHORS: `${getApiUrlWithVersion()}/authors`,
  GET_BOOKS_BY_AUTHOR: (author: string) => `${getApiUrlWithVersion()}/books/author/${encodeURIComponent(author)}`,
  
  // Etiquetas
  GET_TAGS: `${getApiUrlWithVersion()}/tags`,
  GET_BOOKS_BY_TAG: (tag: string) => `${getApiUrlWithVersion()}/books/tag/${encodeURIComponent(tag)}`,
  
  // EPUB
  GET_EPUB: (bookId: string) => `${getApiUrlWithVersion()}/books/${bookId}/epub`,
  GET_COVER: (bookId: string) => `${getApiUrlWithVersion()}/books/${bookId}/cover`,
  
  // Posiciones de lectura
  UPDATE_READ_POSITION: (id: string) => `${getApiUrlWithVersion()}/books/${id}/position`,
  GET_READ_POSITION: (id: string, options?: { format?: string; user?: string; device?: string }) => {
    let url = `${getApiUrlWithVersion()}/books/${id}/position`;
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
  
  // Healthcheck
  HEALTHCHECK: `${getApiUrlWithVersion()}/healthcheck`,
};
