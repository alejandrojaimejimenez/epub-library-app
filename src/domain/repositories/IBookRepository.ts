import { MBook, MAuthor, MTag, MReadPosition } from '@models/Book';

export interface IBookRepository {
  getBooks(): Promise<MBook[]>;
  getBookById(id: string): Promise<MBook | null>;
  searchBooks(query: string): Promise<MBook[]>;
  getBooksByAuthor(authorName: string): Promise<MBook[]>;
  getBooksByTag(tagName: string): Promise<MBook[]>;
  getAuthors(): Promise<{id: string, name: string}[]>;
  getTags(): Promise<{id: string, name: string}[]>;
  updateReadPosition(bookId: string, position: number, cfi?: string, format?: string, user?: string, device?: string): Promise<void>;
  getReadPosition(bookId: string, options?: { format?: string; user?: string; device?: string; }): Promise<MReadPosition | null>;
}
