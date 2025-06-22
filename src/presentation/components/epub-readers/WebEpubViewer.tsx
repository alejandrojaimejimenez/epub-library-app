import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../../theme/colors';
import Loading from '../common/Loading';
import ePub from 'epubjs';
import Button from '../common/Button';
import { TouchableOpacity } from 'react-native';

// Definimos la interfaz para las props
interface WebEpubViewerProps {
  url: string;
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
  defaultTheme?: 'light' | 'dark' | 'sepia';
  defaultFontSize?: number;
  defaultFontFamily?: string;
}

// Definimos la interfaz para la ref expuesta
export interface WebEpubViewerRef {
  nextPage: () => void;
  prevPage: () => void;
  setLocation: (location: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
}

const WebEpubViewer = React.forwardRef<WebEpubViewerRef, WebEpubViewerProps>(({
  url,
  initialLocation,
  onLocationChange,
  onError,
  onReady,
  defaultTheme = 'light',
  defaultFontSize = 16,
  defaultFontFamily = 'serif'
}, ref) => {  const viewerRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<any>(null);
  const [rendition, setRendition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastLocationRef = useRef<string | null>(null);

  // Función para manejar errores
  const handleError = useCallback((error: Error) => {
    console.error('Error en WebEpubViewer:', error);
    setError(error);
    setIsLoading(false);
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Función para aplicar tema
  const applyTheme = useCallback((rendition: any, theme: 'light' | 'dark' | 'sepia') => {
    if (!rendition) return;

    let styles = {};
    switch (theme) {
      case 'dark':
        styles = { 
          body: { 
            color: '#ffffff', 
            background: '#333333' 
          } 
        };
        break;
      case 'sepia':
        styles = { 
          body: { 
            color: '#5b4636', 
            background: '#fbf0d9' 
          } 
        };
        break;
      default: // light
        styles = { 
          body: { 
            color: '#000000', 
            background: '#ffffff' 
          } 
        };
    }
    
    rendition.themes.register(theme, styles);
    rendition.themes.select(theme);
  }, []);

  // Función para aplicar tamaño de fuente
  const applyFontSize = useCallback((rendition: any, size: number) => {
    if (!rendition) return;
    
    rendition.themes.fontSize(`${size}px`);
  }, []);

  // Función para aplicar familia de fuente
  const applyFontFamily = useCallback((rendition: any, family: string) => {
    if (!rendition) return;
    
    rendition.themes.font(family);
  }, []);// Configuración inicial del libro
  useEffect(() => {
    if (!viewerRef.current || !url) return;

    let newBook: any = null;
    let cleanup = () => {};

    const loadBook = async () => {
      try {
        console.log('Intentando cargar EPUB desde URL:', url);
        
        // Determinar si estamos manejando un blob
        const isBlobUrl = url.startsWith('blob:');
          if (isBlobUrl) {
          console.log('Detectada URL de tipo blob, utilizando manejo especial');
          
          try {
            // Para URLs de blob, primero intentamos obtener el blob
            const response = await fetch(url, {
              // Añadimos headers para evitar problemas CORS
              headers: {
                'Accept': 'application/epub+zip, application/octet-stream, */*'
              },
              mode: 'cors',
              cache: 'no-cache'
            });
            
            if (!response.ok) {
              throw new Error(`Error al obtener el blob (HTTP ${response.status}): ${response.statusText}`);
            }
            
            const blob = await response.blob();
            console.log('Blob obtenido correctamente:', blob.type, 'tamaño:', blob.size);
            
            // Convertir Blob a ArrayBuffer para epubjs
            const arrayBuffer = await blob.arrayBuffer();
            console.log('ArrayBuffer creado correctamente, tamaño:', arrayBuffer.byteLength);
            
            // Verificamos que el ArrayBuffer tenga contenido
            if (arrayBuffer.byteLength === 0) {
              throw new Error('El archivo EPUB está vacío');
            }
            
            // Usamos try/catch específico para la creación del libro
            try {
              newBook = ePub(arrayBuffer);
              console.log('Libro creado correctamente desde ArrayBuffer');
            } catch (epubError) {
              console.error('Error al crear el libro desde ArrayBuffer:', epubError);
              throw new Error('Error al procesar el archivo EPUB: ' + 
                (epubError instanceof Error ? epubError.message : String(epubError)));
            }
          } catch (fetchError) {
            console.error('Error al obtener o procesar el blob:', fetchError);
            throw new Error('No se pudo acceder al archivo EPUB: ' + 
                          (fetchError instanceof Error ? fetchError.message : String(fetchError)));
          }
        } else {
          // Para URLs normales, cargamos directamente
          try {
            console.log('Cargando EPUB desde URL directa:', url);
            newBook = ePub(url);
            console.log('Libro creado correctamente desde URL');
          } catch (epubError) {
            console.error('Error al crear el libro desde URL:', epubError);
            throw new Error('Error al cargar el archivo EPUB desde URL: ' + 
              (epubError instanceof Error ? epubError.message : String(epubError)));
          }
        }
        
        setBook(newBook);

        // Verificar si el elemento DOM existe
        if (!viewerRef.current) {
          throw new Error('El elemento de visualización no está disponible');
        }

        // Configurar el rendition
        const newRendition = newBook.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'auto',
          flow: 'paginated'
        });

        // Aplicar configuraciones iniciales
        applyTheme(newRendition, defaultTheme);
        applyFontSize(newRendition, defaultFontSize);
        applyFontFamily(newRendition, defaultFontFamily);

        // Mostrar la página inicial
        newRendition.display(initialLocation || undefined);        // Configurar eventos
        newRendition.on('locationChanged', (location: any) => {
          // Solo notificar cambios de ubicación válidos para evitar bucles
          if (onLocationChange && location && location.start && location.start.cfi) {
            const newCfi = location.start.cfi;
            
            // Verificar si es el mismo CFI que ya procesamos para evitar bucles
            if (lastLocationRef.current !== newCfi) {
              console.log('Ubicación cambiada a:', newCfi);
              lastLocationRef.current = newCfi;
              onLocationChange(newCfi);
            } else {
              console.log('Se ignoró cambio repetido a la misma ubicación:', newCfi);
            }
          } else {
            console.log('Se ignoró cambio de ubicación con valor inválido:', location);
          }
        });

        // Establecer bandera para controlar la primera carga
        let isFirstRender = true;
        
        newRendition.on('rendered', () => {
          setIsLoading(false);
          
          // Solo notificar que está listo después de la primera renderización
          if (onReady && isFirstRender) {
            console.log('Libro renderizado correctamente');
            onReady();
            isFirstRender = false;
          }
        });

        newBook.on('openFailed', (err: Error) => {
          handleError(err);
        });

        setRendition(newRendition);

        cleanup = () => {
          if (newBook) {
            console.log('Limpiando recursos del libro');
            newBook.destroy();
          }
        };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error al inicializar el lector EPUB');
        console.error('Error cargando EPUB:', error);
        handleError(error);
      }
    };

    loadBook();

    // Limpieza al desmontar
    return () => {
      cleanup();
    };  }, [url, initialLocation, defaultTheme, defaultFontSize, defaultFontFamily, applyTheme, applyFontSize, applyFontFamily, onLocationChange, onReady, handleError]);
  // Exponemos los métodos a través de la ref
  React.useImperativeHandle(ref, () => ({
    nextPage: () => {
      if (rendition) {
        rendition.next();
      }
    },
    prevPage: () => {
      if (rendition) {
        rendition.prev();
      }
    },
    setLocation: (location: string) => {
      if (rendition && location) {
        // Actualizar lastLocationRef para evitar bucle al cambiar manualmente
        lastLocationRef.current = location;
        rendition.display(location);
      }
    },
    setTheme: (theme: 'light' | 'dark' | 'sepia') => {
      if (rendition) {
        applyTheme(rendition, theme);
      }
    },
    setFontSize: (size: number) => {
      if (rendition) {
        applyFontSize(rendition, size);
      }
    },
    setFontFamily: (family: string) => {
      if (rendition) {
        applyFontFamily(rendition, family);
      }
    }
  }), [rendition, applyTheme, applyFontSize, applyFontFamily]);

  // Funciones de navegación
  const goToPrevPage = useCallback(() => {
    if (rendition) {
      console.log('Navegando a la página anterior');
      rendition.prev();
    }
  }, [rendition]);

  const goToNextPage = useCallback(() => {
    if (rendition) {
      console.log('Navegando a la página siguiente');
      rendition.next();
    }
  }, [rendition]);

  // Configurar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!rendition) return;
      
      if (e.key === 'ArrowLeft') {
        goToPrevPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rendition, goToPrevPage, goToNextPage]);

  // Soporte para gestos táctiles
  useEffect(() => {
    if (!viewerRef.current || !rendition) return;

    let touchStartX = 0;
    const minSwipeDistance = 50;
    
    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      const distance = touchEndX - touchStartX;
      
      if (Math.abs(distance) >= minSwipeDistance) {
        if (distance > 0) {
          // Deslizar hacia la derecha (página anterior)
          goToPrevPage();
        } else {
          // Deslizar hacia la izquierda (página siguiente)
          goToNextPage();
        }
      }
    };
    
    // Agregar event listeners para gestos táctiles
    const viewerElement = viewerRef.current;
    viewerElement.addEventListener('touchstart', handleTouchStart);
    viewerElement.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      viewerElement.removeEventListener('touchstart', handleTouchStart);
      viewerElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [rendition, goToPrevPage, goToNextPage]);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.message}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {isLoading && <Loading />}      <div 
        id="epub-viewer" 
        ref={viewerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          visibility: isLoading ? 'hidden' : 'visible',
          overflow: 'hidden'
        }} 
      />
        {/* Controles de navegación */}
      {!isLoading && !error && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={goToPrevPage}
            accessibilityLabel="Página anterior"
          >
            <Text style={styles.navButtonText}>←</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={goToNextPage}
            accessibilityLabel="Página siguiente"
          >
            <Text style={styles.navButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center'
  },  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 100
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.7)`,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  navButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  }
});

export default WebEpubViewer;
