import { useEffect, useState, useContext, useCallback } from 'react';
import { LibraryContext } from '../context/LibraryContext';
import { Book } from '../types';
import * as API from '../api/client';

interface UseBooksReturn {
    loading: boolean;
    error: Error | null;
    books: Book[];
    getBookById: (id: string) => Promise<Book | null>;
    searchBooks: (query: string) => Promise<Book[]>;
    getBooksByAuthor: (authorName: string) => Promise<Book[]>;
    getBooksByTag: (tagName: string) => Promise<Book[]>;
    getAuthors: () => Promise<{id: string, name: string}[]>;
    getTags: () => Promise<{id: string, name: string}[]>;
    updateLastReadPosition: (
        bookId: string, 
        position: number, 
        cfi?: string, 
        format?: string,
        user?: string,
        device?: string
    ) => Promise<void>;
    getBookReadPosition: (bookId: string, options?: { format?: string; user?: string; device?: string; }) => Promise<any>;
}

const useBooks = (): UseBooksReturn => {
    const { books: contextBooks, loading: contextLoading, error: contextError } = useContext(LibraryContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    
    useEffect(() => {
        // Si tenemos los libros desde el contexto, los usamos
        if (contextBooks && contextBooks.length > 0) {
            setBooks(contextBooks);
            setLoading(false);
            return;
        }

        // Si no, los cargamos desde la API
        const loadBooks = async (): Promise<void> => {
            try {
                const loadedBooks = await API.getBooks();
                setBooks(loadedBooks);
                setLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };

        loadBooks();
    }, [contextBooks]);

    // Función para obtener un libro por ID
    const getBookById = useCallback(async (id: string): Promise<Book | null> => {
        try {
            const book = await API.getBookById(id);
            return book;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error getting book with ID ${id}`));
            return null;
        }
    }, []);

    // Función para buscar libros
    const searchBooks = useCallback(async (query: string): Promise<Book[]> => {
        try {
            return await API.searchBooks(query);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error searching for "${query}"`));
            return [];
        }
    }, []);

    // Función para obtener libros por autor
    const getBooksByAuthor = useCallback(async (authorName: string): Promise<Book[]> => {
        try {
            return await API.getBooksByAuthor(authorName);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error getting books by author "${authorName}"`));
            return [];
        }
    }, []);

    // Función para obtener libros por etiqueta
    const getBooksByTag = useCallback(async (tagName: string): Promise<Book[]> => {
        try {
            return await API.getBooksByTag(tagName);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error getting books by tag "${tagName}"`));
            return [];
        }
    }, []);

    // Función para obtener todos los autores
    const getAuthors = useCallback(async (): Promise<{id: string, name: string}[]> => {
        try {
            return await API.getAuthors();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error getting authors'));
            return [];
        }
    }, []);

    // Función para obtener todas las etiquetas
    const getTags = useCallback(async (): Promise<{id: string, name: string}[]> => {
        try {
            return await API.getTags();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error getting tags'));
            return [];
        }
    }, []);    // Función para actualizar la posición de lectura
    const updateLastReadPosition = useCallback(async (
        bookId: string, 
        position: number, 
        cfi?: string,
        format: string = 'EPUB',
        user: string = 'usuario1',
        device: string = 'browser'
    ): Promise<void> => {
        try {
            await API.updateReadPosition(bookId, position, cfi, format, user, device);
            // No se propaga ningún error para no interrumpir la experiencia de lectura
        } catch (err) {
            console.error('Error en updateLastReadPosition:', err);
            // No establecemos el error global para no mostrar mensajes al usuario
            // pero sí lo registramos para depuración
        }
    }, []);

    // Función para obtener la posición de lectura guardada
    const getBookReadPosition = useCallback(async (
        bookId: string,
        options?: {
            format?: string;
            user?: string;
            device?: string;
        }
    ) => {
        try {
            return await API.getReadPosition(bookId, options);
        } catch (err) {
            console.error('Error al obtener posición de lectura:', err);
            return null;
        }
    }, []);

    return {
        loading,
        error,
        books,
        getBookById,
        searchBooks,
        getBooksByAuthor,
        getBooksByTag,
        getAuthors,
        getTags,
        updateLastReadPosition,
        getBookReadPosition
    };
};

export default useBooks;
