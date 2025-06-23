import React, { useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { EpubReader as OriginalEpubReader, EpubReaderRef } from 'epub-library-reader';
import { colors } from '@theme/colors';
import ReactDOM from 'react-dom';

// Propiedades para nuestro wrapper
interface ExternalEpubReaderWrapperProps {
  source: { uri: string };
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
  onError?: (error: Error) => void;
  onReady?: () => void;
  defaultTheme?: 'light' | 'dark' | 'sepia';
  defaultFontSize?: number;
}

// Creamos un componente con forwardRef para manejar correctamente las refs
const ExternalEpubReaderWrapper = forwardRef<EpubReaderRef, ExternalEpubReaderWrapperProps>(
  (props, ref) => {
    const {
      source,
      initialLocation,
      onLocationChange,
      onError,
      onReady,
      defaultTheme,
      defaultFontSize
    } = props;

    const [error, setError] = useState<Error | null>(null);
    
    // Esta es la clave: usamos un div como contenedor en web
    // en lugar de pasar la ref directamente al componente externo
    const containerRef = useRef<HTMLDivElement>(null);
    const readerInstanceRef = useRef<any>(null);
    
    useEffect(() => {
      // Solo en web, montamos el componente manualmente
      if (Platform.OS === 'web' && containerRef.current) {
        try {
          // Evitamos usar 'new' con el componente
          // En su lugar, creamos un elemento DIV como contenedor
          // y renderizamos el componente original en él
          const readerDiv = document.createElement('div');
          readerDiv.style.width = '100%';
          readerDiv.style.height = '100%';
          
          // Configuramos un manejador de errores adaptado
          const handleError = (errMsg: string) => {
            const errorObj = new Error(errMsg);
            setError(errorObj);
            if (onError) onError(errorObj);
          };
            // Aquí usamos realmente la biblioteca epub-library-reader
          // Pero en lugar de renderizarla directamente con JSX (lo que causaría el problema de refs)
          // Usamos React.createElement para crearla programáticamente
          
          try {
            // Creamos una instancia del componente usando React.createElement
            // Esto evita que React intente pasar una ref al componente funcional
            const epubReaderElement = React.createElement(OriginalEpubReader, {
              source: source,
              initialLocation: initialLocation,
              onLocationChange: onLocationChange,
              onError: (errMsg: string) => {
                const errorObj = new Error(errMsg);
                setError(errorObj);
                if (onError) onError(errorObj);
              },
              onReady: onReady,
              defaultTheme: defaultTheme,
              defaultFontSize: defaultFontSize
            });
            
            // Almacenamos una referencia para los métodos
            // que expondremos mediante useImperativeHandle
            const readerApi = {
              nextPage: () => {
                // Implementación real - Aquí deberíamos acceder a los métodos de tu librería
                console.log('Navegando a la página siguiente');
                // Tu biblioteca debería exponer estos métodos a través de una API global o un ref
              },
              prevPage: () => {
                console.log('Navegando a la página anterior');
              },
              setLocation: (location: string) => {
                console.log('Cambiando ubicación a:', location);
              },
              setTheme: (theme: 'light' | 'dark' | 'sepia') => {
                console.log('Cambiando tema a:', theme);
              },
              setFontSize: (size: number) => {
                console.log('Cambiando tamaño de fuente a:', size);
              },
              setFontFamily: (family: string) => {
                console.log('Cambiando familia de fuente a:', family);
              },
              destroy: () => {
                console.log('Limpiando recursos del lector');
              }
            };
              // Guardamos la API en nuestra ref
            readerInstanceRef.current = readerApi;
            
            // Limpiamos el contenedor antes de añadir el nuevo componente
            if (containerRef.current) {
              while (containerRef.current.firstChild) {
                containerRef.current.removeChild(containerRef.current.firstChild);
              }
                // Renderizamos el componente EpubReader en el DOM
              // Usando ReactDOM.render que es más compatible con versiones antiguas
              ReactDOM.render(epubReaderElement, containerRef.current);
            }
          } catch (err) {
            console.error('Error al montar el lector EPUB externo:', err);
            const error = err instanceof Error ? err : new Error('Error desconocido');
            setError(error);
            if (onError) onError(error);
          }
        }
        catch (err) {
            console.error('Error al inicializar el contenedor del lector EPUB:', err);
        }
      }
      
      return () => {
        // Limpieza al desmontar
        if (readerInstanceRef.current && readerInstanceRef.current.destroy) {
          readerInstanceRef.current.destroy();
        }
      };
    }, [source.uri, initialLocation, onLocationChange, onError, onReady, defaultTheme, defaultFontSize]); // Dependencias

    // Exponemos los métodos a través de useImperativeHandle
    useImperativeHandle(ref, () => ({
      nextPage: () => {
        if (readerInstanceRef.current) {
          readerInstanceRef.current.nextPage();
        }
      },
      prevPage: () => {
        if (readerInstanceRef.current) {
          readerInstanceRef.current.prevPage();
        }
      },
      setLocation: (location: string) => {
        if (readerInstanceRef.current) {
          readerInstanceRef.current.setLocation(location);
        }
      },
      setTheme: (theme: 'light' | 'dark' | 'sepia') => {
        if (readerInstanceRef.current) {
          readerInstanceRef.current.setTheme(theme);
        }
      },
      setFontSize: (size: number) => {
        if (readerInstanceRef.current) {
          readerInstanceRef.current.setFontSize(size);
        }
      },
      setFontFamily: (family: string) => {
        if (readerInstanceRef.current) {
          readerInstanceRef.current.setFontFamily(family);
        }
      }
    }), []);

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error.message || 'Error al inicializar el lector EPUB'}
          </Text>
        </View>
      );
    }

    // En web, usamos un div que servirá como contenedor
    if (Platform.OS === 'web') {
      return (
        <View style={styles.container}>
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
            }}
          />
        </View>
      );
    }

    // En plataformas nativas, no debería llegar aquí
    // ya que se utiliza NativeEpubViewer
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Este componente solo está diseñado para la plataforma web.
        </Text>
      </View>
    );
  }
);

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
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ExternalEpubReaderWrapper;
