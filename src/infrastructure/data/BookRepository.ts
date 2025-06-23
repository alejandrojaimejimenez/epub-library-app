import { MBook, MReadPosition } from '@models/Book';
import { IBookRepository } from '@repositories/IBookRepository';
import { ApiClient, API_ENDPOINTS } from '@api/client';

export class BookRepository implements IBookRepository {
  async getBooks(): Promise<MBook[]> {
    return await ApiClient.get<MBook[]>(API_ENDPOINTS.GET_BOOKS);
  }
  async getBookById(id: string): Promise<MBook | null> {
    try {
      return await ApiClient.get<MBook>(API_ENDPOINTS.GET_BOOK(id));
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        return null;
      }
      throw error;
    }
  }

  async searchBooks(query: string): Promise<MBook[]> {
    return await ApiClient.get<MBook[]>(API_ENDPOINTS.SEARCH_BOOKS(query));
  }

  async getBooksByAuthor(authorName: string): Promise<MBook[]> {
    return await ApiClient.get<MBook[]>(API_ENDPOINTS.GET_BOOKS_BY_AUTHOR(authorName));
  }

  async getBooksByTag(tagName: string): Promise<MBook[]> {
    return await ApiClient.get<MBook[]>(API_ENDPOINTS.GET_BOOKS_BY_TAG(tagName));
  }

  async getAuthors(): Promise<{id: string, name: string}[]> {
    return await ApiClient.get<{id: string, name: string}[]>(API_ENDPOINTS.GET_AUTHORS);
  }

  async getTags(): Promise<{id: string, name: string}[]> {
    return await ApiClient.get<{id: string, name: string}[]>(API_ENDPOINTS.GET_TAGS);
  }  async updateReadPosition(
    bookId: string, 
    position: number, 
    cfi?: string,
    format: string = 'EPUB',
    user: string = 'usuario1',
    device: string = 'browser'
  ): Promise<void> {
    try {
      // Verificación de parámetros
      if (!bookId) {
        throw new Error('ID de libro no proporcionado para actualizar posición');
      }
      
      if (position === undefined || position < 0) {
        throw new Error(`Posición inválida: ${position}`);
      }
        console.log(`📌 Enviando actualización de posición a API: 
        bookId=${bookId}, 
        position=${position}, 
        cfi=${cfi || 'N/A'},
        format=${format},
        user=${user},
        device=${device}`);
      
      await ApiClient.put(API_ENDPOINTS.UPDATE_READ_POSITION(bookId), {
        position,
        cfi,
        format,
        user,
        device,
        timestamp: new Date().toISOString() // Añadir timestamp para tracking
      });
      
      console.log(`✅ Posición actualizada correctamente para libro ${bookId}`);
    } catch (error) {
      console.error(`❌ Error al actualizar posición para libro ${bookId}:`, error);
      
      // Información de depuración adicional
      if (error instanceof Error) {
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
      } else {
        console.error('Tipo de error desconocido:', typeof error);
      }
      
      // Propagar el error para que los componentes superiores puedan manejarlo
      throw error;
    }
  }
  async getReadPosition(
    bookId: string,
    options?: { format?: string; user?: string; device?: string; }
  ): Promise<MReadPosition | null> {
    try {
      const queryParams = new URLSearchParams();
      
      if (options?.format) queryParams.append('format', options.format);
      if (options?.user) queryParams.append('user', options.user);
      if (options?.device) queryParams.append('device', options.device);
      
      const queryString = queryParams.toString();
      const url = `${API_ENDPOINTS.GET_READ_POSITION(bookId)}${queryString ? `?${queryString}` : ''}`;
      
      return await ApiClient.get<MReadPosition>(url);
    } catch (error) {
      // Si no hay posición guardada, devolvemos null sin error
      return null;
    }
  }
}
