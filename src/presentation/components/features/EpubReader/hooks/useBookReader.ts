import { useEffect, useState } from 'react';
import { MBook } from '@models/Book';
import { useTheme } from '@theme/useTheme';
import { API_ENDPOINTS } from '@api/endpoints';
import { BookRepository } from '@data/BookRepository';

interface IUseBookReaderProps {
  bookId: string;
  initialPage?: number;
}

/**
 * Hook para gestionar la lectura de un libro EPUB
 * Proporciona estado y funciones para el lector de libros
 */
export const useBookReader = ({ bookId, initialPage = 1 }: IUseBookReaderProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [book, setBook] = useState<MBook | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentCfi, setCurrentCfi] = useState<string>('');
  const { colors } = useTheme();

  // Carga inicial del libro
  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true);
        const repo = new BookRepository();
        const bookData = await repo.getBookById(bookId);
        setBook(bookData);
        setCurrentCfi(bookData?.lastReadCfi || '');
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar el libro:', error);
        setIsLoading(false);
      }
    };

    loadBook();

    // Limpieza al desmontar
    return () => {
      // Limpiar recursos si es necesario
    };
  }, [bookId]);

  // Cambiar de página
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Ir a la página siguiente
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Ir a la página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Actualizar posición CFI (EPUB)
  const updatePosition = (cfi: string) => {
    setCurrentCfi(cfi);
    // Aquí se podría guardar la posición en almacenamiento local o en servidor
  };

  // Guardar progreso de lectura
  const saveProgress = async () => {
    try {
      // Aquí se implementaría la lógica para guardar el progreso
      // Ejemplo: await bookService.saveBookProgress(bookId, currentCfi);
      console.log('Progreso guardado:', { bookId, position: currentCfi });
      return true;
    } catch (error) {
      console.error('Error al guardar progreso:', error);
      return false;
    }
  };

  return {
    book,
    isLoading,
    currentPage,
    totalPages,
    currentCfi,
    colors,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    updatePosition,
    saveProgress
  };
};

export default useBookReader;
