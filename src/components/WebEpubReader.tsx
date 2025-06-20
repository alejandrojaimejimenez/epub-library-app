import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
// Importamos epubjs directamente (compatible con Webpack)
import ePub from 'epubjs';
import type { Book, Rendition, Location } from 'epubjs';

interface WebEpubReaderProps {
  url: string;
  blob?: Blob;
  arrayBuffer?: ArrayBuffer;
  onLocationChange?: (location: string) => void;
}

const WebEpubReader: React.FC<WebEpubReaderProps> = ({ url, blob, arrayBuffer, onLocationChange }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isReady, setIsReady] = useState<boolean>(false);
  const hasAttempedLoad = useRef<boolean>(false);

  useEffect(() => {
    if (!url && !blob && !arrayBuffer) return;
    if (Platform.OS !== 'web') return;
    
    // Evitar cargas duplicadas
    if (hasAttempedLoad.current && bookRef.current) return;
    hasAttempedLoad.current = true;

    console.log('URL del EPUB recibida:', url);
    console.log('Blob disponible:', blob ? 'Sí' : 'No');
    console.log('ArrayBuffer disponible:', arrayBuffer ? 'Sí' : 'No');
    
    // Función para cargar y renderizar el EPUB
    const loadEpub = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Limpiar cualquier contenido previo
        if (viewerRef.current) {
          viewerRef.current.innerHTML = '';
        }
          // Crear una nueva instancia del libro usando el método más adecuado
        let book: Book;
        
        try {          // Preferimos usar ArrayBuffer por compatibilidad
          if (arrayBuffer) {
            console.log('Iniciando carga del EPUB desde ArrayBuffer');
            console.log('Tamaño del ArrayBuffer:', arrayBuffer.byteLength, 'bytes');
            
            try {
              // Crear un Blob desde ArrayBuffer
              const arrayBufferBlob = new Blob([arrayBuffer], { type: 'application/epub+zip' });
              console.log('Blob creado desde ArrayBuffer, tamaño:', arrayBufferBlob.size, 'bytes');
              
              // Método 1: Intentar usando el Blob directamente
              try {
                console.log('Intentando crear libro directamente desde Blob');
                book = ePub(arrayBufferBlob);
              } catch (blobError) {
                console.error('Error al crear libro desde Blob:', blobError);
                
                // Método 2: Crear URL desde Blob
                const arrayBufferUrl = URL.createObjectURL(arrayBufferBlob);
                console.log('URL creada desde ArrayBuffer:', arrayBufferUrl);
                
                // Intentar crear el libro desde la URL
                book = ePub(arrayBufferUrl);
              }
            } catch (conversionError) {
              console.error('Error al convertir ArrayBuffer:', conversionError);
              throw conversionError;
            }
          }          // Segunda opción: usar Blob directamente
          else if (blob) {
            console.log('Iniciando carga del EPUB desde Blob');
            console.log('Tipo del Blob:', blob.type);
            console.log('Tamaño del Blob:', blob.size, 'bytes');
            
            try {
              // Asegurarnos de que el Blob tenga el tipo MIME correcto
              const epubBlob = blob.type === 'application/epub+zip' 
                ? blob 
                : new Blob([await blob.arrayBuffer()], { type: 'application/epub+zip' });
              
              // Método 1: Intentar usando el Blob directamente
              try {
                console.log('Intentando crear libro directamente desde Blob');
                book = ePub(epubBlob);
              } catch (blobError) {
                console.error('Error al crear libro desde Blob:', blobError);
                
                // Método 2: Crear URL desde Blob
                const blobUrl = URL.createObjectURL(epubBlob);
                console.log('URL creada desde Blob:', blobUrl);
                
                // Intentar crear el libro desde la URL
                book = ePub(blobUrl);
              }
            } catch (conversionError) {
              console.error('Error al procesar Blob:', conversionError);
              throw conversionError;
            }
          }          // Última opción: usar la URL directamente
          else if (url) {
            console.log('Iniciando carga del EPUB desde URL:', url);
            
            // Validar que la URL es válida
            if (!url.startsWith('blob:') && !url.startsWith('http')) {
              throw new Error('URL del EPUB no válida');
            }
            
            try {
              // Método 1: Intentar cargar directamente
              book = ePub(url);
            } catch (urlError) {
              console.error('Error al cargar desde URL directa:', urlError);
              
              // Método 2: Intentar cargar a través de fetch y luego crear un blob
              console.log('Intentando obtener el EPUB mediante fetch...');
              const response = await fetch(url);
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              
              const contentType = response.headers.get('content-type');
              console.log('Tipo de contenido recibido:', contentType);
              
              const epubArrayBuffer = await response.arrayBuffer();
              console.log('EPUB recibido, tamaño:', epubArrayBuffer.byteLength, 'bytes');
              
              const epubBlob = new Blob([epubArrayBuffer], { type: 'application/epub+zip' });
              const newBlobUrl = URL.createObjectURL(epubBlob);
              console.log('Nueva URL creada desde fetch:', newBlobUrl);
              
              book = ePub(newBlobUrl);
            }
          } else {
            throw new Error('No se proporcionó ningún método válido para cargar el EPUB');
          }
        } catch (initError) {
          console.error('Error al inicializar el libro:', initError);
            // Intento de recuperación: intentar cargar usando fetch directamente
          if (url && (url.startsWith('http') || url.startsWith('blob:'))) {
            console.log('Intento alternativo: cargando mediante fetch desde URL:', url);
            
            try {
              const response = await fetch(url, {
                headers: {
                  'Accept': 'application/epub+zip'
                }
              });
              
              if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
              
              const contentType = response.headers.get('content-type');
              console.log('Tipo de contenido recibido en fallback:', contentType);
              
              const epubArrayBuffer = await response.arrayBuffer();
              console.log('EPUB recibido en fallback, tamaño:', epubArrayBuffer.byteLength, 'bytes');
              
              if (epubArrayBuffer.byteLength === 0) {
                throw new Error('El archivo EPUB descargado está vacío');
              }
              
              const epubBlob = new Blob([epubArrayBuffer], { type: 'application/epub+zip' });
              const newBlobUrl = URL.createObjectURL(epubBlob);
              
              console.log('URL alternativa creada:', newBlobUrl);
              console.log('Intentando crear libro desde URL alternativa');
              
              try {
                // Intentar primero directamente con el Blob
                book = ePub(epubBlob);
              } catch (blobError) {
                console.error('Error al crear libro desde Blob alternativo:', blobError);
                // Si falla, intentar con la URL
                book = ePub(newBlobUrl);
              }} catch (fetchError) {
              const errorMessage = fetchError instanceof Error ? fetchError.message : 'Error desconocido';
              console.error('Error en intento alternativo:', errorMessage);
              throw new Error(`Error al cargar el EPUB: ${errorMessage}`);
            }
          } else {
            throw initError;
          }
        }
        
        bookRef.current = book;
        
        // Registrar evento para debug
        book.on('openFailed', (error: any) => {
          console.error('Error al abrir el EPUB:', error);
          setError('Error al abrir el EPUB: ' + (error.message || 'Error desconocido'));
          setIsLoading(false);
        });
        
        // Esperar a que el libro esté listo
        await book.ready;
        console.log('Libro EPUB listo para renderizar');
        
        // Crear un nuevo rendition
        if (!viewerRef.current) {
          throw new Error('El contenedor de renderizado no está disponible');
        }
        
        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'auto',
          flow: 'paginated'
        });
          
        renditionRef.current = rendition;
          // Configurar eventos de localización
        rendition.on('locationChanged', (location: Location) => {
          if (onLocationChange) {
            // Enviamos el CFI completo
            onLocationChange(location.start.cfi);
            
            // También podemos guardar la posición en el backend directamente
            if (url) {
              // Extraer el ID del libro de la URL
              const bookIdMatch = url.match(/\/books\/(\d+)/);
              if (bookIdMatch && bookIdMatch[1]) {
                const bookId = bookIdMatch[1];
                console.log('Actualizando posición de lectura para el libro:', bookId);
                
                // Construir los datos de posición
                const positionData = {
                  format: 'EPUB',
                  user: 'usuario1', // Idealmente, obtener esto del contexto de autenticación
                  device: 'browser',
                  cfi: location.start.cfi,
                  position: Math.round((location.start.index / 100) * 100) // Convertir a porcentaje
                };
                  // Enviar al servidor usando los dos métodos (PUT y POST) para asegurar compatibilidad
                const savePosition = async () => {
                  try {
                    // Intento 1: PUT
                    try {
                      const putResponse = await fetch(`http://localhost:3000/api/books/${bookId}/position`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(positionData)
                      });
                      
                      const putData = await putResponse.json();
                      if (putData.success) {
                        console.log('Posición guardada correctamente con PUT:', putData);
                        return;
                      } else {
                        console.error('Error al guardar posición con PUT:', putData.message);
                        throw new Error(putData.message);
                      }
                    } catch (putError) {
                      console.error('Error en la petición PUT:', putError);
                      
                      // Intento 2: POST como alternativa
                      const postResponse = await fetch(`http://localhost:3000/api/books/${bookId}/position`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(positionData)
                      });
                      
                      const postData = await postResponse.json();
                      if (postData.success) {
                        console.log('Posición guardada correctamente con POST:', postData);
                      } else {
                        console.error('Error al guardar posición con POST:', postData.message);
                      }
                    }
                  } catch (error) {
                    console.error('Error al enviar posición al servidor:', error);
                  }
                };
                
                // Ejecutar sin esperar para no bloquear la UI
                savePosition();
              }
            }
          }
        });
        
        // Mostrar la primera página
        await rendition.display();
        console.log('EPUB renderizado correctamente');
        
        setIsLoading(false);
        setIsReady(true);
      } catch (err: any) {
        console.error('Error al cargar el EPUB:', err);
        setError('Error al cargar el EPUB: ' + (err.message || 'Error desconocido'));
        setIsLoading(false);
      }
    };
    
    // Iniciar la carga del EPUB
    loadEpub();
    
    // Limpieza al desmontar
    return () => {
      if (renditionRef.current) {
        try {
          renditionRef.current.destroy();
        } catch (e) {
          console.error('Error al destruir el rendition:', e);
        }
      }
      
      if (bookRef.current) {
        try {
          bookRef.current.destroy();
        } catch (e) {
          console.error('Error al destruir el libro:', e);
        }
      }
    };
  }, [url, blob, arrayBuffer, onLocationChange]);

  // Controles de navegación
  const goNext = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  const goPrevious = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  // Si no estamos en web, mostramos un mensaje
  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text>El lector web de EPUB solo está disponible en la versión web.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Cargando EPUB...</Text>
          <Text style={styles.debugText}>URL: {url ? url.substring(0, 30) + '...' : 'No disponible'}</Text>
          <Text style={styles.debugText}>Método: {arrayBuffer ? 'ArrayBuffer' : blob ? 'Blob' : 'URL'}</Text>
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <button 
            onClick={() => { hasAttempedLoad.current = false; window.location.reload(); }} 
            style={styles.retryButton}
          >
            Reintentar
          </button>
        </View>
      )}
      
      <div 
        ref={viewerRef} 
        style={{
          width: '100%',
          height: '90%',
          backgroundColor: '#f9f9f9',
          display: isLoading ? 'none' : 'block', // Ocultar mientras carga
          border: '1px solid #ddd',
          overflow: 'hidden',
        }} 
        data-testid="epub-viewer-container"
      />
      
      {isReady && (
        <View style={styles.navigationContainer}>
          <button onClick={goPrevious} style={styles.navButton}>Anterior</button>
          <Text style={styles.statusText}>Libro cargado correctamente</Text>
          <button onClick={goNext} style={styles.navButton}>Siguiente</button>
        </View>
      )}
      
      {!isLoading && !isReady && !error && (
        <View style={styles.waitingContainer}>
          <Text style={styles.waitingText}>Preparando visualización...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  epubViewerWeb: {
    width: '100%',
    height: '90%',
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#fee',
    margin: 10,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#ff6b6b',
    color: 'white',
    borderRadius: 5,
    cursor: 'pointer',
    border: 'none',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    height: '10%',
    alignItems: 'center',
  },
  navButton: {
    padding: 10,
    backgroundColor: '#007AFF',
    color: 'white',
    borderRadius: 5,
    cursor: 'pointer',
    border: 'none',
    margin: 5,
  },
  statusText: {
    color: '#28a745',
    fontSize: 14,
    textAlign: 'center',
  },
  waitingContainer: {
    padding: 20,
    backgroundColor: '#fffde7',
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  waitingText: {
    color: '#ff9800',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default WebEpubReader;
