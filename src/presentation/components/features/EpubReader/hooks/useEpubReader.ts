import { useCallback, useState, useEffect } from 'react';
import { ApiClient, API_ENDPOINTS } from '@api/client';
import { EpubRepository } from '@data/EpubRepository';
import { SEpub } from '@services/epub';
import { LoadEpubUseCase } from '@usecases/epub-usecases';

// Interfaces
interface PositionResponse {
  cfi: string;
}

export interface EpubData {
  url: string;
  blob?: Blob;
  arrayBuffer?: ArrayBuffer;
}

export interface UseEpubReaderResult {
  epubData: EpubData | null;
  initialCfi: string;
  isLoading: boolean;
  error: string | null;
  handleLocationChange: (newCfi: string) => void;
}

/**
 * Hook personalizado para manejar la lógica del lector EPUB
 */
export const useEpubReader = (
  bookId: string,
  initialCfiProp?: string,
  onLocationChange?: (newCfi: string) => void
): UseEpubReaderResult => {
  // Estados
  const [epubData, setEpubData] = useState<EpubData | null>(null);
  const [initialCfi, setInitialCfi] = useState<string>(initialCfiProp || '');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función de debounce para limitar la frecuencia de llamadas a la API
  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function(...args: any[]) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }

  // Callback para guardar la posición de lectura
  const handleLocationChange = useCallback((newCfi: string) => {
    if (!bookId || !newCfi) return;
    
    // Actualizar el estado local
    setInitialCfi(newCfi);
    
    // Notificar al componente padre si existe el callback
    if (onLocationChange) {
      onLocationChange(newCfi);
    } else {
      // Si no hay callback externo, guardamos la posición directamente
      const updatePositionEndpoint = API_ENDPOINTS.UPDATE_READ_POSITION(bookId);
      
      // Debounce: limitamos la frecuencia de las actualizaciones para no sobrecargar el servidor
      const updatePosition = debounce(async () => {
        try {
          await ApiClient.put(updatePositionEndpoint, { cfi: newCfi });
          console.log('Posición de lectura actualizada:', newCfi.substring(0, 50) + '...');
        } catch (err) {
          console.error('Error al guardar la posición de lectura:', err);
        }
      }, 2000); // Esperar 2 segundos entre actualizaciones
      
      updatePosition();
    }
  }, [bookId, onLocationChange]);

  // Cargar EPUB y posición cuando se obtiene bookId
  useEffect(() => {
    if (!bookId) return;

    const loadEpubData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Configurar el repositorio y caso de uso
        const epubRepository = new EpubRepository();
        const epubService = new SEpub(epubRepository);
        const loadEpubUseCase = new LoadEpubUseCase(epubService);

        // 2. Cargar el EPUB
        console.log(`Cargando EPUB para el libro ${bookId}`);
        const epubResult = await loadEpubUseCase.execute(bookId);
        
        if (!epubResult || !epubResult.url) {
          throw new Error('No se pudo cargar el archivo EPUB');
        }
        
        setEpubData(epubResult);
        console.log('EPUB cargado correctamente, URL:', epubResult.url.substring(0, 50) + '...');

        // 3. Cargar posición de lectura si no se proporcionó una inicial
        if (!initialCfiProp) {
          try {
            const positionEndpoint = API_ENDPOINTS.GET_READ_POSITION(bookId);
            const positionResponse = await ApiClient.get<PositionResponse>(positionEndpoint);
            
            if (positionResponse && positionResponse.cfi) {
              console.log('Posición de lectura cargada:', positionResponse.cfi.substring(0, 50) + '...');
              setInitialCfi(positionResponse.cfi);
            } else {
              console.log('No hay posición de lectura guardada');
            }
          } catch (positionError) {
            console.warn('Error al cargar la posición de lectura:', positionError);
            // No bloqueamos la carga del libro si falla la posición
          }
        }
      } catch (err) {
        console.error('Error al cargar el EPUB o la posición:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el libro');
      } finally {
        setIsLoading(false);
      }
    };

    loadEpubData();
  }, [bookId, initialCfiProp]);

  return {
    epubData,
    initialCfi,
    isLoading,
    error,
    handleLocationChange
  };
};
