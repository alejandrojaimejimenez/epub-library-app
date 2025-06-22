import { useState, useCallback } from 'react';
import { LoadEpubUseCase } from '../../application/usecases/epub-usecases';
import { EpubService } from '../../application/services/epub';
import { EpubRepository } from '../../infrastructure/data/EpubRepository';

// Creamos las instancias necesarias para la inyección de dependencias
const epubRepository = new EpubRepository();
const epubService = new EpubService(epubRepository);
const loadEpubUseCase = new LoadEpubUseCase(epubService);

interface UseEpubParserReturn {
  loading: boolean;
  error: Error | null;
  epubData: any;
  loadEpub: (file: string) => Promise<any>;
}

const useEpubParser = (): UseEpubParserReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [epubData, setEpubData] = useState<any>(null);
  const loadEpub = useCallback(async (file: string): Promise<any> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('useEpubParser: Intentando cargar EPUB', file);
      
      if (!file) {
        throw new Error('No se proporcionó una ruta de archivo válida');
      }
      
      const result = await loadEpubUseCase.execute(file);
      
      if (!result) {
        console.error('useEpubParser: No se recibieron datos del EPUB');
        throw new Error('No se recibieron datos del EPUB');
      }
      
      console.log('useEpubParser: EPUB cargado correctamente', 
        result.url ? 'URL generada' : 'Sin URL', 
        result.blob ? `Blob: ${result.blob.size} bytes` : 'Sin blob'
      );
      
      setEpubData(result);
      setLoading(false);
      return result;
    } catch (err) {
      console.error('useEpubParser: Error al cargar el EPUB:', err);
      const error = err instanceof Error ? err : new Error('Error al cargar el archivo EPUB');
      setError(error);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    loading,
    error,
    epubData,
    loadEpub
  };
};

export default useEpubParser;
