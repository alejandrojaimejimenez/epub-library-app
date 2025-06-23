import { MBook, MReadPosition } from '../../domain/models/Book';
import { SBooks } from '../services/books';

export class GetBooksUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(): Promise<MBook[]> {
    return await this.bookService.getBooks();
  }
}

export class GetBookByIdUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(id: string): Promise<MBook | null> {
    return await this.bookService.getBookById(id);
  }
}

export class SearchBooksUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(query: string): Promise<MBook[]> {
    return await this.bookService.searchBooks(query);
  }
}

export class GetBooksByAuthorUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(authorName: string): Promise<MBook[]> {
    return await this.bookService.getBooksByAuthor(authorName);
  }
}

export class GetBooksByTagUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(tagName: string): Promise<MBook[]> {
    return await this.bookService.getBooksByTag(tagName);
  }
}

export class GetAuthorsUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(): Promise<{id: string, name: string}[]> {
    return await this.bookService.getAuthors();
  }
}

export class GetTagsUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(): Promise<{id: string, name: string}[]> {
    return await this.bookService.getTags();
  }
}

export class UpdateReadPositionUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }

  async execute(
    bookId: string, 
    position: number, 
    cfi?: string,
    format: string = 'EPUB',
    user: string = 'usuario1',
    device: string = 'browser'
  ): Promise<void> {
    await this.bookService.updateReadPosition(bookId, position, cfi, format, user, device);
  }
}

export class GetReadPositionUseCase {
  private bookService: SBooks;

  constructor(bookService: SBooks) {
    this.bookService = bookService;
  }
  async execute(
    bookId: string,
    options?: { format?: string; user?: string; device?: string; }
  ): Promise<MReadPosition | null> {
    return await this.bookService.getReadPosition(bookId, options);
  }
}
