import { useEffect, useState, useContext, useCallback } from 'react';
import { LibraryContext } from '@context/LibraryContext';
import { MBook, MReadPosition } from '@models/Book';
import {
  GetBookByIdUseCase,
  SearchBooksUseCase,
  GetBooksByAuthorUseCase,
  GetBooksByTagUseCase,
  GetAuthorsUseCase,
  GetTagsUseCase,
  UpdateReadPositionUseCase,
  GetReadPositionUseCase
} from '@usecases/book-usecases';
import { SBooks } from '@services/books';
import { BookRepository } from '@data/BookRepository';

interface UseBooksReturn {
    loading: boolean;
    error: Error | null;
    books: MBook[];
    getBookById: (id: string) => Promise<MBook | null>;
    searchBooks: (query: string) => Promise<MBook[]>;
    getBooksByAuthor: (authorName: string) => Promise<MBook[]>;
    getBooksByTag: (tagName: string) => Promise<MBook[]>;
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
    getBookReadPosition: (bookId: string, options?: { format?: string; user?: string; device?: string; }) => Promise<MReadPosition | null>;
}

// Creamos las instancias necesarias para la inyección de dependencias
const bookRepository = new BookRepository();
const bookService = new SBooks(bookRepository);
const getBookByIdUseCase = new GetBookByIdUseCase(bookService);
const searchBooksUseCase = new SearchBooksUseCase(bookService);
const getBooksByAuthorUseCase = new GetBooksByAuthorUseCase(bookService);
const getBooksByTagUseCase = new GetBooksByTagUseCase(bookService);
const getAuthorsUseCase = new GetAuthorsUseCase(bookService);
const getTagsUseCase = new GetTagsUseCase(bookService);
const updateReadPositionUseCase = new UpdateReadPositionUseCase(bookService);
const getReadPositionUseCase = new GetReadPositionUseCase(bookService);

const useBooks = (): UseBooksReturn => {
    const { books: contextBooks, loading: contextLoading, error: contextError } = useContext(LibraryContext);    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [books, setBooks] = useState<MBook[]>([]);
      useEffect(() => {
        // Si tenemos los libros desde el contexto, los usamos
        if (contextBooks && contextBooks.length > 0) {
            setBooks(contextBooks);
            setLoading(false);
            return;
        }        
        
        // Si no, los cargamos usando el caso de uso        
        const loadBooks = async (): Promise<void> => {
            try {
                console.log('🔍 Intentando cargar libros desde el repositorio...');
                // Cambiamos por el uso adecuado del repositorio para obtener todos los libros
                const loadedBooks = await bookService.getBooks();
                console.log(`✅ Libros cargados: ${loadedBooks ? loadedBooks.length : 0}`);
                
                if (loadedBooks && loadedBooks.length > 0) {
                    console.log(`📚 Primer libro: ${JSON.stringify(loadedBooks[0])}`);
                } else {
                    console.log('⚠️ No se encontraron libros');
                }
                
                setBooks(loadedBooks);
                setLoading(false);
            } catch (err) {
                console.error('❌ Error cargando libros:', err);
                // Detalles adicionales para depuración
                if (err instanceof Error) {
                    console.error('Mensaje:', err.message);
                    console.error('Stack:', err.stack);
                } else {
                    console.error('Tipo de error desconocido:', typeof err);
                }
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };

        loadBooks();
    }, [contextBooks]);    // Función para obtener un libro por ID
    const getBookById = useCallback(async (id: string): Promise<MBook | null> => {
        try {
            const book = await getBookByIdUseCase.execute(id);
            return book;
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error getting book with ID ${id}`));
            return null;
        }
    }, []);

    // Función para buscar libros
    const searchBooks = useCallback(async (query: string): Promise<MBook[]> => {
        try {
            return await searchBooksUseCase.execute(query);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error searching for "${query}"`));            return [];
        }
    }, []);

    // Función para obtener libros por autor
    const getBooksByAuthor = useCallback(async (authorName: string): Promise<MBook[]> => {
        try {
            return await getBooksByAuthorUseCase.execute(authorName);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error getting books by author "${authorName}"`));
            return [];
        }
    }, []);

    // Función para obtener libros por etiqueta
    const getBooksByTag = useCallback(async (tagName: string): Promise<MBook[]> => {
        try {
            return await getBooksByTagUseCase.execute(tagName);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(`Error getting books by tag "${tagName}"`));
            return [];
        }
    }, []);

    // Función para obtener todos los autores
    const getAuthors = useCallback(async (): Promise<{id: string, name: string}[]> => {
        try {
            return await getAuthorsUseCase.execute();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error getting authors'));
            return [];
        }
    }, []);

    // Función para obtener todas las etiquetas
    const getTags = useCallback(async (): Promise<{id: string, name: string}[]> => {
        try {
            return await getTagsUseCase.execute();
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Error getting tags'));
            return [];
        }
    }, []);
      // Función para actualizar la posición de lectura
    const updateLastReadPosition = useCallback(async (
        bookId: string, 
        position: number, 
        cfi?: string,
        format: string = 'EPUB',
        user: string = 'usuario1',
        device: string = 'browser'
    ): Promise<void> => {
        // Evitar actualizaciones con posiciones inválidas
        if (!bookId || position === undefined || position < 0) {
            console.warn('Se ignoró actualización de posición con datos inválidos:', { bookId, position });
            return;
        }
        
        try {
            console.log(`Actualizando posición para libro ${bookId}: posición=${position}, cfi=${cfi || 'N/A'}`);
            await updateReadPositionUseCase.execute(bookId, position, cfi, format, user, device);
            console.log('Posición actualizada correctamente');
        } catch (err) {
            // Capturar y registrar el error, pero no interrumpir la experiencia del usuario
            console.error('Error al actualizar posición de lectura:', err);
            if (err instanceof Error) {
                console.error('Mensaje:', err.message);
                console.error('Stack:', err.stack);
            }
            // No establecemos el error global para no mostrar mensajes al usuario
        }
    }, []);    // Función para obtener la posición de lectura guardada
    const getBookReadPosition = useCallback(async (
        bookId: string,
        options?: {
            format?: string;
            user?: string;
            device?: string;
        }
    ): Promise<MReadPosition | null> => {
        try {
            return await getReadPositionUseCase.execute(bookId, options);
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
