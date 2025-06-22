import { Book, ReadPosition } from '../../domain/models/Book';
import { IBookRepository } from '../../domain/repositories/IBookRepository';
import { ApiClient, API_ENDPOINTS } from '../api/client';

export class BookRepository implements IBookRepository {
  async getBooks(): Promise<Book[]> {
    return await ApiClient.get<Book[]>(API_ENDPOINTS.GET_BOOKS);
  }

  async getBookById(id: string): Promise<Book | null> {
    try {
      return await ApiClient.get<Book>(API_ENDPOINTS.GET_BOOK(id));
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        return null;
      }
      throw error;
    }
  }

  async searchBooks(query: string): Promise<Book[]> {
    return await ApiClient.get<Book[]>(API_ENDPOINTS.SEARCH_BOOKS(query));
  }

  async getBooksByAuthor(authorName: string): Promise<Book[]> {
    return await ApiClient.get<Book[]>(API_ENDPOINTS.GET_BOOKS_BY_AUTHOR(authorName));
  }

  async getBooksByTag(tagName: string): Promise<Book[]> {
    return await ApiClient.get<Book[]>(API_ENDPOINTS.GET_BOOKS_BY_TAG(tagName));
  }

  async getAuthors(): Promise<{id: string, name: string}[]> {
    return await ApiClient.get<{id: string, name: string}[]>(API_ENDPOINTS.GET_AUTHORS);
  }

  async getTags(): Promise<{id: string, name: string}[]> {
    return await ApiClient.get<{id: string, name: string}[]>(API_ENDPOINTS.GET_TAGS);
  }
  async updateReadPosition(
    bookId: string, 
    position: number, 
    cfi?: string,
    format: string = 'EPUB',
    user: string = 'usuario1',
    device: string = 'browser'
  ): Promise<void> {
    await ApiClient.post(API_ENDPOINTS.UPDATE_READ_POSITION(bookId), {
      bookId,
      position,
      cfi,
      format,
      user,
      device
    });
  }

  async getReadPosition(
    bookId: string,
    options?: { format?: string; user?: string; device?: string; }
  ): Promise<ReadPosition | null> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options?.format) queryParams.append('format', options.format);
      if (options?.user) queryParams.append('user', options.user);
      if (options?.device) queryParams.append('device', options.device);
      
      const queryString = queryParams.toString();
      const url = `${API_ENDPOINTS.GET_READ_POSITION(bookId)}${queryString ? `?${queryString}` : ''}`;
      
      return await ApiClient.get<ReadPosition>(url);
    } catch (error) {
      // Si no hay posición guardada, devolvemos null sin error
      return null;
    }
  }
}
