import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import Loading from './common/Loading';
import DebugInfo from './common/DebugInfo';
import useEpubParser from '../../shared/hooks/useEpubParser';
import useBooks from '../../shared/hooks/useBooks';

// Importamos el componente de la biblioteca externa
import { EpubReader as ExternalEpubReader, EpubReaderRef } from 'epub-library-reader';

// Fallback para plataformas no web (si es necesario)
const FallbackEpubReader = Platform.OS === 'ios' || Platform.OS === 'android'
  ? require('./epub-readers/NativeEpubViewer').default
  : null;

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
  const { updateLastReadPosition, getBookReadPosition } = useBooks();
  const [logs, setLogs] = useState<string[]>([]);
  
  // Usamos una ref para el componente EpubReader externo
  const readerRef = useRef<EpubReaderRef>(null);

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
  }, [addLog]);

  // Manejar cambios de ubicación
  const handleLocationChange = useCallback((location: string) => {
    addLog(`Nueva ubicación: ${location}`);
    if (onLocationChange) {
      onLocationChange(location);
    }
    // Actualizar la posición en el almacenamiento
    // Convertimos el CFI a un número hash para almacenamiento
    const locationHash = location ? Math.abs(location.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0)) : 0;
    updateLastReadPosition(bookId, locationHash);
  }, [bookId, onLocationChange, updateLastReadPosition, addLog]);

  // Cargar el EPUB usando el repositorio
  useEffect(() => {
    const loadBook = async () => {
      try {
        addLog(`Cargando EPUB desde URL: ${bookId}`);
        const data = await loadEpub(bookId);
        addLog('EPUB cargado correctamente');
        setIsLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido al cargar el EPUB');
        addLog(`ERROR: ${error.message}`);
        setError(error);
        setIsLoading(false);
      }
    };

    loadBook();
  }, [bookId, loadEpub, addLog]);

  // Actualizar el estado de error si hay un error del epub
  useEffect(() => {
    if (epubError) {
      setError(epubError);
    }
  }, [epubError]);

  // Exponemos los métodos necesarios a través del ref
  React.useImperativeHandle(ref, () => ({
    nextPage: () => {
      if (readerRef.current) {
        readerRef.current.nextPage();
      }
    },
    prevPage: () => {
      if (readerRef.current) {
        readerRef.current.prevPage();
      }
    },
    setLocation: (location: string) => {
      if (readerRef.current) {
        readerRef.current.setLocation(location);
      }
    },
    setTheme: (theme: 'light' | 'dark' | 'sepia') => {
      if (readerRef.current) {
        readerRef.current.setTheme(theme);
      }
    },
    setFontSize: (size: number) => {
      if (readerRef.current) {
        readerRef.current.setFontSize(size);
      }
    },
    setFontFamily: (family: string) => {
      if (readerRef.current) {
        readerRef.current.setFontFamily(family);
      }
    }
  }), [readerRef]);

  // Solo mostrar depuración en desarrollo
  const showDebug = false;

  // Verificar la plataforma
  const isWeb = Platform.OS === 'web';
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

  const renderReader = () => {
    if (isLoading || epubLoading) {
      return <Loading />;
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
          <TouchableOpacity onPress={() => setError(null)} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!epubData) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No se pudo cargar el EPUB</Text>
        </View>
      );
    }

    if (isWeb) {
      return (
        <ExternalEpubReader
          ref={readerRef}
          source={{ uri: epubData.url }}
          initialLocation={initialLocation}
          onLocationChange={handleLocationChange}
          onError={handleReaderError}
          onReady={() => setIsLoading(false)}
          defaultTheme="light"
          defaultFontSize={18}
        />
      );
    }

    if (isNative && FallbackEpubReader) {
      return (
        <FallbackEpubReader
          url={epubData.url}
          initialLocation={initialLocation}
          onLocationChange={handleLocationChange}
          onError={handleReaderError}
        />
      );
    }

    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Plataforma no soportada</Text>
      </View>
    );
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
      {renderReader()}
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
