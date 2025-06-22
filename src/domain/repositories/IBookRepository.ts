import { Book, Author, Tag, ReadPosition } from '../models/Book';

export interface IBookRepository {
  getBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | null>;
  searchBooks(query: string): Promise<Book[]>;
  getBooksByAuthor(authorName: string): Promise<Book[]>;
  getBooksByTag(tagName: string): Promise<Book[]>;
  getAuthors(): Promise<{id: string, name: string}[]>;
  getTags(): Promise<{id: string, name: string}[]>;
  updateReadPosition(bookId: string, position: number, cfi?: string, format?: string, user?: string, device?: string): Promise<void>;
  getReadPosition(bookId: string, options?: { format?: string; user?: string; device?: string; }): Promise<ReadPosition | null>;
}
