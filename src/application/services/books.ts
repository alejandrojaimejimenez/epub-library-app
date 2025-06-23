import { MBook, MReadPosition } from '@models/Book';
import { IBookRepository } from '@repositories/IBookRepository';

export class SBooks {
  private bookRepository: IBookRepository;

  constructor(bookRepository: IBookRepository) {
    this.bookRepository = bookRepository;
  }
  async getBooks(): Promise<MBook[]> {
    return await this.bookRepository.getBooks();
  }

  async getBookById(id: string): Promise<MBook | null> {
    return await this.bookRepository.getBookById(id);
  }

  async searchBooks(query: string): Promise<MBook[]> {
    return await this.bookRepository.searchBooks(query);
  }

  async getBooksByAuthor(authorName: string): Promise<MBook[]> {
    return await this.bookRepository.getBooksByAuthor(authorName);
  }

  async getBooksByTag(tagName: string): Promise<MBook[]> {
    return await this.bookRepository.getBooksByTag(tagName);
  }

  async getAuthors(): Promise<{id: string, name: string}[]> {
    return await this.bookRepository.getAuthors();
  }

  async getTags(): Promise<{id: string, name: string}[]> {
    return await this.bookRepository.getTags();
  }

  async updateReadPosition(
    bookId: string, 
    position: number, 
    cfi?: string,
    format: string = 'EPUB',
    user: string = 'usuario1',
    device: string = 'browser'
  ): Promise<void> {
    await this.bookRepository.updateReadPosition(bookId, position, cfi, format, user, device);
  }
  async getReadPosition(
    bookId: string,
    options?: { format?: string; user?: string; device?: string; }
  ): Promise<MReadPosition | null> {
    return await this.bookRepository.getReadPosition(bookId, options);
  }
}
