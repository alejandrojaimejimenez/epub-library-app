import { useCallback, useEffect, useRef, useState } from 'react';
import ePub, { Book, Rendition } from 'epubjs';
import { Platform } from 'react-native';
import { EPUB_CONTAINER_ID } from '../components/EpubReaderWeb/types';

interface UseEpubRenderingParams {
  epubUrl: string;
  initialCfi?: string;
  onLocationChange?: (newCfi: string) => void;
}

interface UseEpubRenderingState {
  isLoading: boolean;
  loadError: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
}

/**
 * Hook personalizado para manejar la renderización de EPUB
 * Separa la lógica de renderización de la lógica del componente
 */
export const useEpubRendering = ({ 
  epubUrl, 
  initialCfi, 
  onLocationChange 
}: UseEpubRenderingParams) => {
  // Referencias
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  // Estado
  const [state, setState] = useState<UseEpubRenderingState>({
    isLoading: true,
    loadError: null,
    canGoBack: true,
    canGoForward: true
  });

  // DOM Ready
  const [domReady, setDomReady] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [manualContainerCreated, setManualContainerCreated] = useState(false);

  // Métodos de utilidad
  const updateState = useCallback((newState: Partial<UseEpubRenderingState>) => {
    setState(prevState => ({ ...prevState, ...newState }));
  }, []);

  // Actualizar botones de navegación
  const updateNavigationButtons = useCallback(() => {
    if (!bookRef.current || !renditionRef.current) return;
    
    const rendition = renditionRef.current;
    const location = rendition.location;
    
    if (!location) return;
    
    // Verificar si el libro usa dirección RTL
    const bookWithMeta = bookRef.current as any;
    const isRTL = bookWithMeta.package?.metadata?.direction === 'rtl';
    
    setState(prev => ({
      ...prev,
      canGoBack: isRTL ? !location.atEnd : !location.atStart,
      canGoForward: isRTL ? !location.atStart : !location.atEnd
    }));
  }, []);

  // Verificar si el DOM está listo
  const checkDomReady = useCallback(() => {
    const refExists = !!viewerRef.current;
    const containerExists = Platform.OS === 'web' && 
      typeof document !== 'undefined' && 
      !!document.getElementById(EPUB_CONTAINER_ID);
    
    return refExists || containerExists || manualContainerCreated;
  }, [manualContainerCreated]);

  // Inicializar contenedor DOM
  useEffect(() => {
    if (domReady) return;
    
    if (checkDomReady()) {
      setDomReady(true);
      return;
    }
    
    // Reintento con límite de 5 veces
    if (retryCount < 5) {
      const timeoutId = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    } 
    
    // Último intento: crear manualmente el contenedor
    if (retryCount === 5 && Platform.OS === 'web') {
      try {
        const container = document.createElement('div');
        container.id = EPUB_CONTAINER_ID;
        document.body.appendChild(container);
        setManualContainerCreated(true);
        setDomReady(true);
      } catch (err) {
        console.error('Error al crear contenedor DOM:', err);
        updateState({ 
          loadError: 'No se pudo crear el contenedor para el lector EPUB.',
          isLoading: false
        });
      }
    }
  }, [checkDomReady, domReady, retryCount, updateState]);

  // Cargar y renderizar el libro EPUB
  useEffect(() => {
    if (!domReady || !epubUrl) return;
    
    // Limpiar instancias previas
    if (bookRef.current) {
      bookRef.current = null;
    }
    
    if (renditionRef.current) {
      renditionRef.current.destroy();
      renditionRef.current = null;
    }
    
    const initializeBook = async () => {
      try {
        updateState({ isLoading: true, loadError: null });
        
        // Determinar si el URL es un blob
        const isBlob = epubUrl.startsWith('blob:');
        console.log(`Inicializando libro EPUB desde ${isBlob ? 'blob' : 'URL'}: ${epubUrl.substring(0, 50)}...`);
        
        // Mejorado: usar fetch para obtener el blob y trabajar con un objeto File
        let book;
        
        if (isBlob) {
          try {
            // Convertir blob URL a File object (funciona mejor con EPUBjs)
            console.log('Convirtiendo blob URL a File object...');
            const response = await fetch(epubUrl);
            const blob = await response.blob();
            
            // Validar que el blob es válido
            if (blob.size === 0) {
              throw new Error('El archivo EPUB está vacío');
            }
            
            if (!blob.type.includes('epub') && !blob.type.includes('octet-stream')) {
              console.warn(`Tipo MIME potencialmente incorrecto: ${blob.type}. Continuando de todos modos...`);
            }
              // Usar ArrayBuffer que es compatible con la API de EPUBjs
            const arrayBuffer = await blob.arrayBuffer();
            
            console.log(`ArrayBuffer creado correctamente, tamaño: ${arrayBuffer.byteLength} bytes`);
            
            // Crear instancia con ArrayBuffer
            book = ePub(arrayBuffer, { 
              encoding: 'binary'
            });
            console.log('Instancia del libro creada con ArrayBuffer');
          } catch (fileError) {
            console.warn('Error al convertir blob a File:', fileError);
            
            // Si falla, intentar con configuración binaria
            console.log('Intentando cargar con configuración para binarios...');
            book = ePub(epubUrl, {
              openAs: 'binary',
              encoding: 'binary'
            });
          }
        } else {
          // URL normal, no es un blob
          book = ePub(epubUrl);
        }
        
        if (!book) {
          throw new Error('No se pudo crear una instancia del libro EPUB');
        }
        
        console.log('Instancia del libro creada correctamente');
        bookRef.current = book;
        
        // Obtener el elemento del DOM donde renderizar
        const element = viewerRef.current || document.getElementById(EPUB_CONTAINER_ID);
        
        if (!element) {
          console.error('Elemento contenedor no encontrado');
          throw new Error('No se encontró el elemento contenedor para el lector EPUB.');
        }
        
        console.log('Elemento contenedor encontrado, creando rendition');
        
        // Crear el rendition (visualización) del libro
        const rendition = book.renderTo(element, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'paginated',
        });
        
        console.log('Rendition creado correctamente');
        renditionRef.current = rendition;
        
        // Agregar hooks de depuración
        book.spine.hooks.content.register((content: any) => {
          console.log('Hook de contenido EPUB ejecutado');
          return content;
        });
        
        rendition.hooks.content.register((content: any) => {
          console.log('Hook de contenido Rendition ejecutado');
          return content;
        });
        
        // Esperar a que el libro esté listo (con tolerancia a errores)
        console.log('Esperando a que el libro esté listo...');
        try {
          // Dar un tiempo máximo de 15 segundos, pero no fallar si excede
          await Promise.race([
            book.ready,
            new Promise<void>(resolve => {
              setTimeout(() => {
                console.log('Tiempo de espera para book.ready superado, continuando...');
                resolve();
              }, 15000);
            })
          ]);
          console.log('¡Libro listo para renderizar!');
        } catch (readyError) {
          console.warn('Advertencia al esperar que el libro esté listo:', readyError);
          console.log('Continuando a pesar del error en book.ready');
        }
        
        // Ir a la posición inicial o mostrar la primera página
        console.log('Mostrando contenido del libro...');
        try {
          if (initialCfi) {
            console.log(`Navegando a posición inicial: ${initialCfi.substring(0, 30)}...`);
            await rendition.display(initialCfi);
          } else {
            console.log('Mostrando primera página del libro');
            await rendition.display();
          }
          console.log('Libro mostrado correctamente');
        } catch (displayError) {
          console.error('Error al mostrar el libro:', displayError);
          // Intentar mostrar la primera página como fallback
          if (initialCfi) {
            console.log('Intentando mostrar primera página como alternativa...');
            await rendition.display();
          } else {
            throw displayError;
          }
        }
        
        // Configurar evento de cambio de ubicación
        rendition.on('locationChanged', (location: any) => {
          console.log('Ubicación cambiada:', location?.start?.cfi?.substring(0, 20));
          if (location?.start?.cfi) {
            onLocationChange?.(location.start.cfi);
            updateNavigationButtons();
          }
        });
        
        // Actualizar estado final
        updateState({ isLoading: false });
        updateNavigationButtons();
        console.log('Inicialización del lector completada con éxito');
      } catch (error) {
        console.error('Error al inicializar el lector EPUB:', error);
        
        // Generar mensaje de error apropiado
        let errorMessage = 'Error desconocido al cargar el libro';
        
        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Mensajes más descriptivos para errores comunes
          if (error.message.includes('container.xml')) {
            errorMessage = 'Error al cargar la estructura del EPUB. El archivo puede estar corrupto o el formato no es compatible.';
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Error de red al cargar el EPUB. Verifique su conexión a internet.';
          } else if (error.message.includes('cors')) {
            errorMessage = 'Error de permisos CORS al cargar el EPUB.';
          } else if (error.message.includes('Timeout')) {
            errorMessage = 'Se agotó el tiempo de espera al cargar el libro. Intente nuevamente.';
          } else if (error.message.includes('encryption.xml')) {
            errorMessage = 'El libro EPUB está protegido con DRM y no puede ser leído.';
          } else if (error.message.includes('Failed to open')) {
            errorMessage = 'No se pudo abrir el libro. Verifique que el formato sea válido.';
          }
        }
        
        updateState({
          loadError: errorMessage,
          isLoading: false
        });
      }
    };
    
    initializeBook();
    
    // Limpieza al desmontar
    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
      
      if (bookRef.current) {
        bookRef.current.destroy();
      }
      
      // Eliminar contenedor manual si fue creado
      if (manualContainerCreated && Platform.OS === 'web') {
        try {
          const container = document.getElementById(EPUB_CONTAINER_ID);
          if (container) {
            document.body.removeChild(container);
          }
        } catch (err) {
          console.error('Error al eliminar el contenedor manual:', err);
        }
      }
    };
  }, [domReady, epubUrl, initialCfi, manualContainerCreated, onLocationChange, updateNavigationButtons, updateState]);

  // Navegación: página anterior
  const handlePrevPage = useCallback(() => {
    if (renditionRef.current && state.canGoBack) {
      renditionRef.current.prev();
      updateNavigationButtons();
    }
  }, [state.canGoBack, updateNavigationButtons]);
  
  // Navegación: página siguiente
  const handleNextPage = useCallback(() => {
    if (renditionRef.current && state.canGoForward) {
      renditionRef.current.next();
      updateNavigationButtons();
    }
  }, [state.canGoForward, updateNavigationButtons]);
  
  // Reintentar después de un error
  const handleRetry = useCallback(() => {
    // Reiniciar estado
    updateState({ 
      isLoading: true, 
      loadError: null 
    });
    
    // Limpiar instancias actuales
    if (renditionRef.current) {
      renditionRef.current.destroy();
      renditionRef.current = null;
    }
    
    if (bookRef.current) {
      bookRef.current.destroy();
      bookRef.current = null;
    }
    
    // Comprobar si el DOM está listo
    if (!domReady) {
      setRetryCount(0);
    }
  }, [domReady, updateState]);

  return {
    ...state,
    viewerRef,
    handlePrevPage,
    handleNextPage,
    handleRetry
  };
};
