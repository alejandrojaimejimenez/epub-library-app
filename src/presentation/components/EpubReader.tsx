import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import Loading from './common/Loading';
import DebugInfo from './common/DebugInfo';
import useEpubParser from '../../shared/hooks/useEpubParser';

// Importamos el componente de la biblioteca externa
// Cuando la biblioteca esté correctamente instalada, descomentar esta línea:
// import { EpubReader as ExternalEpubReader } from 'epub-library-reader';

// Mientras tanto, usamos la versión local o una importación alternativa
// Este es un fallback temporal hasta que la biblioteca esté disponible correctamente
const ExternalEpubReader = Platform.OS === 'web' 
  ? require('./epub-readers/WebEpubViewer').default 
  : Platform.OS === 'ios' || Platform.OS === 'android'
    ? require('./epub-readers/NativeEpubViewer').default
    : null;

interface EpubReaderProps {
  url: string;
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
}

/**
 * Componente principal para el lector de EPUB
 * Detecta automáticamente la plataforma y carga el lector apropiado (web o nativo)
 */
const EpubReader: React.FC<EpubReaderProps> = ({ 
  url, 
  initialLocation, 
  onLocationChange 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { loadEpub, loading, epubData, error: epubError } = useEpubParser();  const [logs, setLogs] = useState<string[]>([]);
  
  // Solo mostrar depuración en desarrollo
  const showDebug = false; // Cambiado de __DEV__ a false para ocultar el panel de depuración
  
  // Verificar la plataforma
  const isWeb = Platform.OS === 'web';
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  
  // Función para agregar logs
  const addLog = useCallback((message: string) => {
    console.log(message); // Log en consola
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  // Manejar errores del lector
  const handleReaderError = useCallback((error: Error) => {
    const errorMsg = `Error en el lector: ${error.message}`;
    addLog(`ERROR: ${errorMsg}`);
    setError(error);
    setIsLoading(false);
  }, [addLog]);

  // Cargar el libro
  const handleReloadEpub = useCallback(async () => {
    try {
      setIsLoading(true);
      addLog(`Recargando EPUB desde URL: ${url}`);
      await loadEpub(url);
      addLog('EPUB recargado correctamente');
      setIsLoading(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      addLog(`ERROR: ${error.message}`);
      setError(error);
      setIsLoading(false);
    }
  }, [url, loadEpub, addLog]);

  // Acciones de depuración
  const handleDebugAction = useCallback((action: string) => {
    switch (action) {
      case 'show-url':
        addLog(`URL del EPUB: ${epubData?.url || 'No disponible'}`);
        break;
      case 'show-platform':
        addLog(`Plataforma actual: ${Platform.OS}`);
        break;
      default:
        addLog(`Acción desconocida: ${action}`);
    }
  }, [epubData, addLog]);

  // Cargar el libro al inicio
  useEffect(() => {
    const loadBook = async () => {
      try {
        setIsLoading(true);
        addLog(`Cargando EPUB desde URL: ${url}`);
        await loadEpub(url);
        addLog('EPUB cargado correctamente');
        setIsLoading(false);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido');
        addLog(`ERROR: ${error.message}`);
        setError(error);
        setIsLoading(false);
      }
    };

    loadBook();
  }, [url, loadEpub, addLog]);
  
  // Registrar errores del parser
  useEffect(() => {
    if (epubError) {
      addLog(`Error del parser: ${epubError.message}`);
      setError(epubError);
    }
  }, [epubError, addLog]);
  
  // Registrar información de plataforma
  useEffect(() => {
    addLog(`Plataforma detectada: ${Platform.OS}`);
    
    if (isWeb) {
      addLog('Usando lector EPUB para Web');
    } else if (isNative) {
      addLog('Usando lector EPUB para dispositivos móviles');
    } else {
      addLog('Plataforma no soportada');
    }
  }, [isWeb, isNative, addLog]);

  // Mientras se carga el libro
  if (isLoading || loading) {
    return <Loading text="Cargando libro..." />;
  }
  // Si hay error o no hay datos
  if (error || !epubData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error?.message || 'No se pudo cargar el libro. Por favor, inténtalo de nuevo.'}
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={handleReloadEpub}
        >
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
        
        {showDebug && (
          <DebugInfo 
            visible={true}
            bookId={url}
            actions={[
              { label: 'Reintentar', action: handleReloadEpub },
              { label: 'Ver URL', action: () => handleDebugAction('show-url') },
              { label: 'Ver plataforma', action: () => handleDebugAction('show-platform') }
            ]}
            logs={logs}
          />
        )}
      </View>
    );
  }  // Usar el nuevo lector EPUB integrado (funciona tanto en web como en dispositivos nativos)
  return (
    <View style={styles.container}>
      <ExternalEpubReader
        // Para el componente actual (provisional)
        url={epubData.url}
        initialLocation={initialLocation}
        onLocationChange={onLocationChange}
        onError={handleReaderError}
        onReady={() => addLog('Lector EPUB listo')}
        blob={epubData.blob}
        arrayBuffer={epubData.arrayBuffer}
        
        // Para el componente externo (cuando esté disponible):
        // Descomentar estas líneas cuando se utilice la biblioteca externa
        /*
        source={{ 
          uri: epubData.url,
        }}
        defaultTheme="light"
        defaultFontSize={18}
        showControls={true}
        onReady={() => addLog('Lector EPUB listo')}
        onLocationChange={onLocationChange}
        onError={(errorMsg: string) => {
          const error = new Error(errorMsg);
          addLog(`ERROR: ${errorMsg}`);
          setError(error);
        }}
        */
      />
      
      {showDebug && (
        <DebugInfo 
          visible={true}
          bookId={url}
          actions={[
            { label: 'Recargar', action: handleReloadEpub },
            { label: 'Ver URL', action: () => handleDebugAction('show-url') }
          ]}
          logs={logs}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EpubReader;
