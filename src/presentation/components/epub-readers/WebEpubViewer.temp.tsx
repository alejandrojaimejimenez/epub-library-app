import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@theme/colors';
import Loading from '@components/common/Loading';
import ePub from 'epubjs';
import { TouchableOpacity } from 'react-native';

// Interfaces
interface EpubLocation {
  start?: {
    cfi?: string;
  } | string;
  href?: string;
  index?: number;
}

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

interface WebEpubViewerRef {
  nextPage: () => void;
  prevPage: () => void;
  setLocation: (location: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
}

interface EpubRendition {
  display: (location?: string) => Promise<void>;
  next: () => Promise<void>;
  prev: () => Promise<void>;
  themes: {
    register: (name: string, styles: object) => void;
    select: (name: string) => void;
    fontSize: (size: string) => void;
    font: (family: string) => void;
  };
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
  currentLocation: () => EpubLocation;
  manager?: {
    name?: string;
    container?: HTMLElement;
  };
}

interface EpubBook {
  renderTo: (element: HTMLElement, options: any) => EpubRendition;
  destroy: () => void;
  on: (event: string, callback: (error: Error) => void) => void;
  off: (event: string, callback?: (error: Error) => void) => void;
}

// Convertir Book de epubjs a nuestro EpubBook
const convertToEpubBook = (book: any): EpubBook => {
  return {
    renderTo: (element: HTMLElement, options: any) => {
      const rendition = book.renderTo(element, options);
      return {
        ...rendition,
        off: (event: string, callback?: (data: any) => void) => {
          rendition.off(event, callback);
        }
      };
    },
    destroy: () => book.destroy(),
    on: (event: string, callback: (error: Error) => void) => book.on(event, callback),
    off: (event: string, callback?: (error: Error) => void) => book.off(event, callback)
  };
};

const WebEpubViewer = React.forwardRef<WebEpubViewerRef, WebEpubViewerProps>((props, ref) => {
  const {
    url,
    initialLocation,
    onLocationChange,
    onError,
    onReady,
    defaultTheme = 'light',
    defaultFontSize = 16,
    defaultFontFamily = 'serif'
  } = props;

  const viewerRef = useRef<HTMLDivElement>(null);
  const [book, setBook] = useState<EpubBook | null>(null);
  const [rendition, setRendition] = useState<EpubRendition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const lastLocationRef = useRef<string | null>(null);

  // Manejar errores
  const handleError = useCallback((error: Error) => {
    console.error('Error en WebEpubViewer:', error);
    setError(error);
    setIsLoading(false);
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Aplicar tema
  const applyTheme = useCallback((rendition: EpubRendition, theme: 'light' | 'dark' | 'sepia') => {
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

  // Aplicar tamaño de fuente
  const applyFontSize = useCallback((rendition: EpubRendition, size: number) => {
    if (!rendition) return;
    rendition.themes.fontSize(`${size}px`);
  }, []);

  // Aplicar familia de fuente
  const applyFontFamily = useCallback((rendition: EpubRendition, family: string) => {
    if (!rendition) return;
    rendition.themes.font(family);
  }, []);

  // Navegación con reintentos
  const navigateWithRetry = useCallback((location: string, retryCount = 0) => {
    if (!rendition || !location) return;
    
    const maxRetries = 3;
    
    try {
      console.log(`Intentando navegar a: ${location} (intento ${retryCount + 1})`);
      void rendition.display(location)
        .catch((error: any) => {
          console.error(`Error al navegar a ${location}:`, error);
          
          if (retryCount < maxRetries) {
            console.log(`Reintentando (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => {
              navigateWithRetry(location, retryCount + 1);
            }, 500);
          } else {
            console.error(`No se pudo navegar a ${location} después de ${maxRetries} intentos`);
            if (onError) {
              onError(new Error(`No se pudo navegar a la ubicación: ${location}`));
            }
          }
        });
    } catch (error) {
      console.error('Error inesperado al navegar:', error);
    }
  }, [rendition, onError]);

  // Navegación a página anterior
  const goToPrevPage = useCallback(() => {
    if (!rendition) return;
    
    console.log('Navegando a la página anterior');
    try {
      void rendition.prev().then(() => {
        const currentLocation = rendition.currentLocation();
        if (currentLocation) {
          const cfi = typeof currentLocation.start === 'string' 
            ? currentLocation.start 
            : currentLocation.start?.cfi;
          
          if (cfi) {
            lastLocationRef.current = cfi;
            console.log('Navegación a página anterior completada, guardando ubicación:', cfi);
            if (onLocationChange) {
              onLocationChange(cfi);
            }
          }
        }
      }).catch((error: Error) => {
        console.error('Error en navegación a página anterior:', error);
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Error desconocido');
      console.error('Error al navegar a la página anterior:', err);
    }
  }, [rendition, onLocationChange]);

  // Navegación a página siguiente
  const goToNextPage = useCallback(() => {
    if (!rendition) return;
    
    console.log('Navegando a la página siguiente');
    try {
      void rendition.next().then(() => {
        const currentLocation = rendition.currentLocation();
        if (currentLocation) {
          const cfi = typeof currentLocation.start === 'string'
            ? currentLocation.start
            : currentLocation.start?.cfi;
          
          if (cfi) {
            lastLocationRef.current = cfi;
            console.log('Navegación a página siguiente completada, guardando ubicación:', cfi);
            if (onLocationChange) {
              onLocationChange(cfi);
            }
          }
        }
      }).catch((error: Error) => {
        console.error('Error en navegación a página siguiente:', error);
      });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Error desconocido');
      console.error('Error al navegar a la página siguiente:', err);
    }
  }, [rendition, onLocationChange]);

  // Configurar el libro
  useEffect(() => {
    if (!viewerRef.current || !url) return;

    let newBook: EpubBook | null = null;
    let cleanup = () => {};
    
    // Configuración del renderizado con reintentos
    const setupRendition = async (book: EpubBook, retryCount = 0): Promise<EpubRendition | null> => {
      const maxRetries = 3;
      
      try {
        if (!viewerRef.current) {
          throw new Error('El elemento de visualización no está disponible');
        }

        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'paginated',
          minSpreadWidth: 900,
          allowScriptedContent: true,
          allowPopups: false,
          manager: 'default'
        });

        applyTheme(rendition, defaultTheme);
        applyFontSize(rendition, defaultFontSize);
        applyFontFamily(rendition, defaultFontFamily);

        try {
          await rendition.display(initialLocation);
        } catch (error) {
          console.error('Error al mostrar la página inicial:', error);
        }

        rendition.on('locationChanged', (location: EpubLocation) => {
          console.log('Evento locationChanged recibido:', JSON.stringify(location));
          
          if (!location) {
            console.log('Ignorando cambio de ubicación - ubicación nula');
            return;
          }
          
          let newCfi = '';
          
          if (typeof location.start === 'string') {
            newCfi = location.start;
          } else if (location.start?.cfi) {
            newCfi = location.start.cfi;
          } else if (location.href) {
            const index = location.index || 0;
            newCfi = `${location.href}#index=${index}`;
          } else {
            console.log('No se pudo extraer un identificador de posición válido:', JSON.stringify(location));
            return;
          }
          
          if (!newCfi || newCfi.trim() === '') {
            console.log('Se ignoró cambio de ubicación con CFI vacío');
            return;
          }
          
          if (lastLocationRef.current !== newCfi) {
            console.log('Actualizando referencia interna de ubicación a:', newCfi);
            lastLocationRef.current = newCfi;
          } else {
            console.log('Se ignoró cambio repetido a la misma ubicación:', newCfi);
          }
        });

        let isFirstRender = true;
        
        rendition.on('rendered', () => {
          setIsLoading(false);
          
          if (onReady && isFirstRender) {
            console.log('Libro renderizado correctamente');
            onReady();
            isFirstRender = false;
          }
        });

        book.on('openFailed', (err: Error) => {
          handleError(err);
        });

        setRendition(rendition);
        return rendition;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error al inicializar el lector EPUB');
        console.error('Error configurando la renderización:', error);
        
        if (retryCount < maxRetries) {
          console.log(`Reintentando configuración del renderizador (${retryCount + 1}/${maxRetries})...`);
          return new Promise<EpubRendition | null>((resolve) => {
            setTimeout(async () => {
              const result = await setupRendition(book, retryCount + 1);
              resolve(result);
            }, 500);
          });
        }
        
        handleError(error);
        return null;
      }
    };

    const loadBook = async () => {
      try {
        console.log('Intentando cargar EPUB desde URL:', url);
        
        const isBlobUrl = url.startsWith('blob:');
        
        if (isBlobUrl) {
          console.log('Detectada URL de tipo blob, utilizando manejo especial');
          
          try {
            const response = await fetch(url, {
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
            
            console.log('Convirtiendo Blob a ArrayBuffer para cargar el EPUB...');
            const arrayBuffer = await blob.arrayBuffer();
            
            try {
              newBook = convertToEpubBook(ePub(arrayBuffer));
              console.log('Libro creado correctamente desde ArrayBuffer');
            } catch (bufferError) {
              console.error('Error al crear el libro desde ArrayBuffer:', bufferError);
              
              console.log('Intentando método alternativo con URL.createObjectURL...');
              try {
                const objectUrl = URL.createObjectURL(blob);
                console.log('URL de objeto creada para el blob:', objectUrl);
                
                newBook = convertToEpubBook(ePub(objectUrl));
                console.log('Libro creado correctamente desde Object URL');
                
                const originalCleanup = cleanup;
                cleanup = () => {
                  originalCleanup();
                  URL.revokeObjectURL(objectUrl);
                  console.log('URL de objeto revocada:', objectUrl);
                };
              } catch (urlError) {
                console.error('Error al crear el libro desde Object URL:', urlError);
                throw new Error('Todos los métodos de carga del EPUB fallaron. Último error: ' + 
                  (urlError instanceof Error ? urlError.message : String(urlError)));
              }
            }
          } catch (fetchError) {
            console.error('Error al obtener o procesar el blob:', fetchError);
            throw new Error('No se pudo acceder al archivo EPUB: ' + 
                          (fetchError instanceof Error ? fetchError.message : String(fetchError)));
          }
        } else {
          try {
            console.log('Cargando EPUB desde URL directa:', url);
            newBook = convertToEpubBook(ePub(url));
            console.log('Libro creado correctamente desde URL');
          } catch (epubError) {
            console.error('Error al crear el libro desde URL:', epubError);
            throw new Error('Error al cargar el archivo EPUB desde URL: ' + 
              (epubError instanceof Error ? epubError.message : String(epubError)));
          }
        }
        
        setBook(newBook);
        
        if (newBook) {
          await setupRendition(newBook);
          
          cleanup = () => {
            if (newBook) {
              console.log('Limpiando recursos del libro');
              newBook.destroy();
            }
          };
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error al inicializar el lector EPUB');
        console.error('Error cargando EPUB:', err);
        handleError(err);
      }
    };

    void loadBook();

    return () => {
      cleanup();
    };
  }, [url, initialLocation, defaultTheme, defaultFontSize, defaultFontFamily, applyTheme, applyFontSize, applyFontFamily, onReady, handleError]);

  // Métodos expuestos a través de la ref
  React.useImperativeHandle(ref, () => ({
    nextPage: goToNextPage,
    prevPage: goToPrevPage,
    setLocation: (location: string) => {
      if (rendition && location) {
        navigateWithRetry(location);
      } else {
        console.warn('No se puede cambiar ubicación: rendition no disponible o ubicación inválida');
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
  }), [rendition, applyTheme, applyFontSize, applyFontFamily, goToNextPage, goToPrevPage, navigateWithRetry]);

  // Eventos de teclado
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
    let touchStartY = 0;
    const minSwipeDistance = 30;
    
    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      event.preventDefault();
    };
    
    const handleTouchEnd = (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;
      
      const distanceX = touchEndX - touchStartX;
      const distanceY = touchEndY - touchStartY;
      
      if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) >= minSwipeDistance) {
        if (distanceX > 0) {
          console.log('Gesto detectado: deslizamiento a la derecha (página anterior)');
          goToPrevPage();
        } else {
          console.log('Gesto detectado: deslizamiento a la izquierda (página siguiente)');
          goToNextPage();
        }
        
        event.preventDefault();
      }
    };
    
    const handleClick = (event: MouseEvent) => {
      const containerWidth = viewerRef.current?.clientWidth || 0;
      const clickX = event.clientX;
      
      const centerBuffer = containerWidth * 0.2;
      const edgeBuffer = containerWidth * 0.1;
      
      if (clickX < edgeBuffer || clickX > containerWidth - edgeBuffer) {
        return;
      }
      
      if (clickX < (containerWidth / 2) - centerBuffer) {
        console.log('Clic detectado en el lado izquierdo (página anterior)');
        goToPrevPage();
      } else if (clickX > (containerWidth / 2) + centerBuffer) {
        console.log('Clic detectado en el lado derecho (página siguiente)');
        goToNextPage();
      }
    };
    
    const viewerElement = viewerRef.current;
    viewerElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    viewerElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    viewerElement.addEventListener('click', handleClick);
    
    return () => {
      viewerElement.removeEventListener('touchstart', handleTouchStart);
      viewerElement.removeEventListener('touchend', handleTouchEnd);
      viewerElement.removeEventListener('click', handleClick);
    };
  }, [rendition, goToPrevPage, goToNextPage, viewerRef]);

  const configureIframe = useCallback(() => {
    if (!rendition) return;

    try {
      setTimeout(() => {
        const iframe = viewerRef.current?.querySelector('iframe');
        
        if (iframe) {
          console.log('Configurando iframe para permitir scripts');
          
          try {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            
            if (iframeDocument) {
              const meta = iframeDocument.createElement('meta');
              meta.setAttribute('name', 'viewport');
              meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
              iframeDocument.head.appendChild(meta);
              
              const style = iframeDocument.createElement('style');
              style.textContent = `
                html, body { 
                  margin: 0; 
                  padding: 0; 
                  height: 100%; 
                  overflow: hidden; 
                  -webkit-overflow-scrolling: none;
                  position: fixed;
                  width: 100%;
                }
                body * {
                  max-width: 100% !important;
                  box-sizing: border-box;
                }
                img { max-width: 100%; height: auto; }
                ::-webkit-scrollbar { 
                  display: none; 
                }
              `;
              iframeDocument.head.appendChild(style);
              
              console.log('Iframe configurado correctamente');
            } else {
              console.log('No se pudo acceder al documento del iframe');
            }
          } catch (docError) {
            console.error('Error al acceder al documento del iframe:', docError);
          }
        } else {
          console.log('No se encontró el iframe para configurar');
        }
      }, 500);
    } catch (error) {
      console.error('Error al configurar iframe:', error);
    }
  }, [rendition]);

  useEffect(() => {
    if (rendition) {
      configureIframe();
    }
  }, [rendition, configureIframe]);
  
  const preventScroll = useCallback(() => {
    if (!viewerRef.current) return;
    
    try {
      const iframe = viewerRef.current.querySelector('iframe');
      if (!iframe) return;
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;
      
      const preventScrollFn = (e: Event) => {
        e.preventDefault();
        return false;
      };
      
      iframeDoc.removeEventListener('scroll', preventScrollFn);
      iframeDoc.addEventListener('scroll', preventScrollFn, { passive: false });
      
      const section = iframeDoc.querySelector('section');
      if (section) {
        section.style.overflow = 'hidden';
        section.style.height = '100%';
      }
      
      console.log('Eventos de scroll controlados en el iframe');
    } catch (error) {
      console.error('Error al configurar prevención de scroll:', error);
    }
  }, []);
  
  useEffect(() => {
    if (rendition) {
      const timer = setTimeout(() => {
        preventScroll();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [rendition, preventScroll]);
  
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
      {isLoading && <Loading />}
      <div 
        id="epub-viewer" 
        ref={viewerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          visibility: isLoading ? 'hidden' : 'visible',
          overflow: 'hidden',
          position: 'relative'
        }} 
      />
      {!isLoading && !error && (
        <View style={styles.controlsContainer} pointerEvents="box-none">
          <View style={styles.navButtonContainer} pointerEvents="auto">
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={goToPrevPage}
              accessibilityLabel="Página anterior"
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>←</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.centerSpace} pointerEvents="none" />
          
          <View style={styles.navButtonContainer} pointerEvents="auto">
            <TouchableOpacity 
              style={styles.navButton} 
              onPress={goToNextPage}
              accessibilityLabel="Página siguiente"
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
    position: 'relative'
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
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 100,
    height: '100%'
  },
  navButtonContainer: {
    width: 60,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  },
  navButton: {
    width: 50,
    height: 100,
    borderRadius: 25,
    backgroundColor: `rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.7)`,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5
  },
  navButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  centerSpace: {
    flex: 1
  }
});

export default WebEpubViewer;
