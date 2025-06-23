import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { MBook } from '@models/Book';
import { GetBooksUseCase } from '@usecases/book-usecases';
import { SBooks } from '@services/books';
import { BookRepository } from '@data/BookRepository';

export interface LibraryContextType {
  books: MBook[];
  loading: boolean;
  error: Error | null;
  addBook?: (book: MBook) => Promise<void>;
  removeBook?: (id: string) => Promise<void>;
  updateBook?: (id: string, bookData: Partial<MBook>) => Promise<void>;
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
const bookService = new SBooks(bookRepository);
const getBooksUseCase = new GetBooksUseCase(bookService);

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
    const [books, setBooks] = useState<MBook[]>([]);
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
