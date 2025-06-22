import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../../domain/models/Book';
import { GetBooksUseCase } from '../../application/usecases/book-usecases';
import { BookService } from '../../application/services/books';
import { BookRepository } from '../../infrastructure/data/BookRepository';

export interface LibraryContextType {
  books: Book[];
  loading: boolean;
  error: Error | null;
  addBook?: (book: Book) => Promise<void>;
  removeBook?: (id: string) => Promise<void>;
  updateBook?: (id: string, bookData: Partial<Book>) => Promise<void>;
}

export const LibraryContext = createContext<LibraryContextType>({
  books: [],
  loading: true,
  error: null
});

interface LibraryProviderProps {
  children: ReactNode;
}

// Creamos las instancias necesarias para la inyección de dependencias
const bookRepository = new BookRepository();
const bookService = new BookService(bookRepository);
const getBooksUseCase = new GetBooksUseCase(bookService);

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadBooks = async (): Promise<void> => {
            try {
                // Cargar libros usando el caso de uso
                const loadedBooks = await getBooksUseCase.execute();
                setBooks(loadedBooks);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Error al cargar la biblioteca'));
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    return (
        <LibraryContext.Provider value={{ books, loading, error }}>
            {children}
        </LibraryContext.Provider>
    );
};
