import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import Loading from './common/Loading';
import DebugInfo from './common/DebugInfo';
import useEpubParser from '../../shared/hooks/useEpubParser';
import useBooks from '../../shared/hooks/useBooks';

// Importamos los componentes específicos de plataforma
import WebEpubViewer, { WebEpubViewerRef } from './epub-readers/WebEpubViewer';
import NativeEpubViewer, { NativeEpubViewerRef } from './epub-readers/NativeEpubViewer';

// Definimos una interfaz común para ambas implementaciones
export interface EpubReaderRef {
  nextPage: () => void;
  prevPage: () => void;
  setLocation: (location: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
}


interface EpubReaderProps {
  url: string;
  bookId: string;
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
}

const EpubReader = React.forwardRef<EpubReaderRef, EpubReaderProps>(({
  url,
  bookId,
  initialLocation,
  onLocationChange
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { loadEpub, loading: epubLoading, epubData, error: epubError } = useEpubParser();
  const { updateLastReadPosition } = useBooks();
  const [logs, setLogs] = useState<string[]>([]);
  // Refs para los componentes de lector
  const webReaderRef = useRef<WebEpubViewerRef>(null);
  const nativeReaderRef = useRef<NativeEpubViewerRef>(null);
  
  // Variables de estado para el reintento
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Función para agregar logs
  const addLog = useCallback((message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  // Manejar errores del lector
  const handleReaderError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorMsg = `Error en el lector: ${errorObj.message}`;
    addLog(`ERROR: ${errorMsg}`);
    setError(errorObj);
    setIsLoading(false);
  }, [addLog]);  // Manejar cambios de ubicación
  const handleLocationChange = useCallback((location: string) => {
    // Ignorar valores nulos o indefinidos
    if (!location) {
      addLog('Se ignoró cambio de ubicación con valor nulo o vacío');
      return;
    }
    
    addLog(`Nueva ubicación: ${location}`);
    
    // Informar al componente padre del cambio de ubicación
    if (onLocationChange) {
      onLocationChange(location);
    }
    
    try {      // Determinar si estamos trabajando con un CFI estándar o un identificador basado en href
      const isCfi = location.startsWith('epubcfi(');
      
      // Si no es un CFI estándar, podríamos necesitar manejarlo de forma diferente
      if (!isCfi) {
        addLog(`Advertencia: La ubicación no es un CFI estándar: ${location}`);
      }
      
      // Posición numérica (0 para posiciones iniciales o calcular basado en índice)
      // Para simplificar, usaremos 0 como se muestra en tu ejemplo de cURL
      const position = 0;
      
      addLog(`Actualizando posición en API: bookId=${bookId}, posición=${position}, cfi=${location}`);
      
      // Llamar a la API para actualizar la posición
      updateLastReadPosition(bookId, position, location, 'EPUB', 'usuario1', 'browser')
        .then(() => {
          addLog('✅ Posición actualizada correctamente en API');
        })
        .catch((error) => {
          const errorMsg = error instanceof Error ? error.message : String(error);
          addLog(`❌ Error al actualizar posición en API: ${errorMsg}`);
          // Registrar detalles adicionales para depuración
          console.error('Error completo:', error);
        });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog(`❌ ERROR al procesar cambio de posición: ${errorMsg}`);
      console.error('Error al guardar posición de lectura:', error);
    }
  }, [bookId, onLocationChange, updateLastReadPosition, addLog]);

  // Cargar el EPUB usando el repositorio
  useEffect(() => {
    const loadBook = async () => {
      try {
        addLog(`Cargando EPUB desde URL: ${bookId} (intento ${retryCount + 1}/${MAX_RETRIES + 1})`);
        const data = await loadEpub(bookId);
        addLog('EPUB cargado correctamente');
        setIsLoading(false);
        setRetryCount(0); // Reiniciar contador de intentos al cargar con éxito
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido al cargar el EPUB');
        addLog(`ERROR: ${error.message}`);
        
        // Intentar recargar automáticamente si no se ha superado el máximo de intentos
        if (retryCount < MAX_RETRIES) {
          const nextRetry = retryCount + 1;
          addLog(`Reintentando carga automáticamente (${nextRetry}/${MAX_RETRIES})...`);
          setRetryCount(nextRetry);
          // No establecer error para que no se muestre el mensaje de error
        } else {
          addLog(`Se alcanzó el máximo de intentos (${MAX_RETRIES})`);
          setError(error);
          setIsLoading(false);
        }
      }
    };

    loadBook();
  }, [bookId, loadEpub, addLog, retryCount]);

  // Actualizar el estado de error si hay un error del epub
  useEffect(() => {
    if (epubError) {
      setError(epubError);
    }
  }, [epubError]);

  // Exponemos los métodos necesarios a través del ref
  React.useImperativeHandle(ref, () => ({
    nextPage: () => {
      if (Platform.OS === 'web' && webReaderRef.current) {
        webReaderRef.current.nextPage();
      } else if (Platform.OS !== 'web' && nativeReaderRef.current) {
        nativeReaderRef.current.nextPage();
      }
    },
    prevPage: () => {
      if (Platform.OS === 'web' && webReaderRef.current) {
        webReaderRef.current.prevPage();
      } else if (Platform.OS !== 'web' && nativeReaderRef.current) {
        nativeReaderRef.current.prevPage();
      }
    },
    setLocation: (location: string) => {
      if (Platform.OS === 'web' && webReaderRef.current) {
        webReaderRef.current.setLocation(location);
      } else if (Platform.OS !== 'web' && nativeReaderRef.current) {
        nativeReaderRef.current.setLocation(location);
      }
    },
    setTheme: (theme: 'light' | 'dark' | 'sepia') => {
      if (Platform.OS === 'web' && webReaderRef.current) {
        webReaderRef.current.setTheme(theme);
      } else if (Platform.OS !== 'web' && nativeReaderRef.current) {
        nativeReaderRef.current.setTheme(theme);
      }
    },
    setFontSize: (size: number) => {
      if (Platform.OS === 'web' && webReaderRef.current) {
        webReaderRef.current.setFontSize(size);
      } else if (Platform.OS !== 'web' && nativeReaderRef.current) {
        nativeReaderRef.current.setFontSize(size);
      }
    },
    setFontFamily: (family: string) => {
      if (Platform.OS === 'web' && webReaderRef.current) {
        webReaderRef.current.setFontFamily(family);
      } else if (Platform.OS !== 'web' && nativeReaderRef.current) {
        nativeReaderRef.current.setFontFamily(family);
      }
    }
  }), [webReaderRef, nativeReaderRef]);

  // Solo mostrar depuración en desarrollo
  const showDebug = false;

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error?.message || 'No se pudo cargar el EPUB'}</Text>
      {error && (
        <TouchableOpacity onPress={() => setError(null)} style={styles.retryButton}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderContent = () => {
    if (isLoading || epubLoading) {
      return <Loading />;
    }

    if (error) {
      return renderError();
    }

    if (!epubData) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el EPUB</Text>
        </View>
      );
    }    // Renderizar componente según plataforma
    if (Platform.OS === 'web') {
      return (
        <WebEpubViewer
          ref={webReaderRef}
          url={epubData.url}
          initialLocation={initialLocation}
          onLocationChange={handleLocationChange}
          onError={handleReaderError}
          onReady={() => setIsLoading(false)}
          defaultTheme="light"
          defaultFontSize={18}
        />
      );
    } else {
      return (
        <NativeEpubViewer
          ref={nativeReaderRef}
          url={epubData.url}
          initialLocation={initialLocation}
          onLocationChange={handleLocationChange}
          onError={handleReaderError}
        />
      );
    }
  };

  const handleDebugAction = (action: string) => {
    switch (action) {
      case 'clear':
        setLogs([]);
        break;
      case 'reload':
        setError(null);
        setIsLoading(true);
        break;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      {showDebug && (
        <DebugInfo
          visible={true}
          logs={logs}
          actions={[
            { label: 'Limpiar logs', action: () => handleDebugAction('clear') },
            { label: 'Recargar', action: () => handleDebugAction('reload') }
          ]}
        />
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
    marginBottom: 20,
    textAlign: 'center'
  },
  retryButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5
  },
  retryText: {
    color: '#ffffff', // Usando valor literal en lugar de colors.white
    fontSize: 14
  }
});

export default EpubReader;
