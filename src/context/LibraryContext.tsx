import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Book, LibraryContextType } from '../types';
import * as API from '../api/client';

export const LibraryContext = createContext<LibraryContextType>({
  books: [],
  loading: true,
  error: null
});

interface LibraryProviderProps {
  children: ReactNode;
}

export const LibraryProvider: React.FC<LibraryProviderProps> = ({ children }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadBooks = async (): Promise<void> => {
            try {
                // Cargar libros desde la API (que se conecta al backend)
                const loadedBooks = await API.getBooks();
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