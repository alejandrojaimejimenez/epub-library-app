import React, { useState, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { colors } from '../../theme/colors';

interface NativeEpubViewerProps {
  url: string;
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
  onError?: (error: Error) => void;
}

export interface NativeEpubViewerRef {
  nextPage: () => void;
  prevPage: () => void;
  setLocation: (location: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'sepia') => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
}

/**
 * Visor de EPUB para plataformas nativas (iOS/Android)
 * que utiliza WebView para renderizar el contenido EPUB
 */
const NativeEpubViewer = forwardRef<NativeEpubViewerRef, NativeEpubViewerProps>(({
  url,
  initialLocation,
  onLocationChange,
  onError
}, ref) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const webViewRef = useRef<WebView>(null);

  // Función para ejecutar JavaScript en el WebView
  const runJavaScript = useCallback((script: string) => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        try {
          ${script}
        } catch (e) {
          console.error("Error ejecutando script:", e);
        }
        true;
      `);
    }
  }, [webViewRef]);

  // Exponemos las funciones a través de la ref
  useImperativeHandle(ref, () => ({
    nextPage: () => {
      runJavaScript('if (window.rendition) window.rendition.next();');
    },
    prevPage: () => {
      runJavaScript('if (window.rendition) window.rendition.prev();');
    },
    setLocation: (location: string) => {
      runJavaScript(`if (window.rendition) window.rendition.display("${location}");`);
    },
    setTheme: (theme: 'light' | 'dark' | 'sepia') => {
      let backgroundColor, textColor;
      switch (theme) {
        case 'dark':
          backgroundColor = '#333333';
          textColor = '#ffffff';
          break;
        case 'sepia':
          backgroundColor = '#fbf0d9';
          textColor = '#5b4636';
          break;
        default:
          backgroundColor = '#ffffff';
          textColor = '#000000';
      }
      runJavaScript(`
        if (window.rendition && window.rendition.themes) {
          window.rendition.themes.register('${theme}', { 
            body: { 
              color: '${textColor}', 
              background: '${backgroundColor}' 
            } 
          });
          window.rendition.themes.select('${theme}');
        }
      `);
    },
    setFontSize: (size: number) => {
      runJavaScript(`
        if (window.rendition && window.rendition.themes) {
          window.rendition.themes.fontSize("${size}px");
        }
      `);
    },
    setFontFamily: (family: string) => {
      runJavaScript(`
        if (window.rendition && window.rendition.themes) {
          window.rendition.themes.font("${family}");
        }
      `);
    }
  }), [runJavaScript]);
  // Manejar mensajes del WebView
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'location' && onLocationChange) {
        // Verificar que el valor sea válido antes de procesarlo
        if (data.value) {
          console.log('NativeEpubViewer: Ubicación cambiada:', data.value);
          onLocationChange(data.value);
        } else {
          console.log('NativeEpubViewer: Se ignoró cambio de ubicación con valor inválido');
        }
      } else if (data.type === 'error') {
        console.error('NativeEpubViewer: Error desde WebView:', data.message);
        setError(data.message);
        if (onError) onError(new Error(data.message));
      } else if (data.type === 'loaded') {
        console.log('NativeEpubViewer: EPUB cargado correctamente');
        setLoading(false);
      }
    } catch (err) {
      console.error('NativeEpubViewer: Error al procesar mensaje:', err);
    }
  }, [onLocationChange, onError]);

  // Manejar errores de WebView
  const handleWebViewError = useCallback((syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    const errorMessage = nativeEvent.description || 'Error al cargar el WebView';
    console.error('NativeEpubViewer: Error en WebView:', errorMessage);
    setError(errorMessage);
    if (onError) onError(new Error(errorMessage));
  }, [onError]);
  
  // Script para inyectar en el WebView
  const injectedJavaScript = `
    // Comunicación con React Native
    function sendMessage(type, value) {
      window.ReactNativeWebView.postMessage(JSON.stringify({type, value}));
    }
    
    // Configurar libro EPUB usando EPUB.js
    try {
      // Intentar cargar el libro
      const book = ePub("${url}");
      window.book = book;
      
      // Renderizar el libro
      const rendition = book.renderTo("viewer", {
        width: "100%",
        height: "100%",
        flow: "paginated"
      });
      window.rendition = rendition;
      
      // Ir a la ubicación inicial si existe
      ${initialLocation ? `rendition.display("${initialLocation}");` : 'rendition.display();'}
        // Registrar cambios de ubicación
      rendition.on("locationChanged", (location) => {
        if (location && location.start && location.start.cfi) {
          sendMessage("location", location.start.cfi);
        } else {
          console.log("Se ignoró cambio de ubicación con valor inválido");
        }
      });
      
      // Configurar controles de navegación
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowLeft") rendition.prev();
        if (e.key === "ArrowRight") rendition.next();
      });
      
      // Configurar gestos táctiles
      let touchStart = null;
      window.addEventListener("touchstart", (e) => {
        touchStart = e.changedTouches[0].screenX;
      });
      window.addEventListener("touchend", (e) => {
        const touchEnd = e.changedTouches[0].screenX;
        if (touchStart && touchEnd) {
          if (touchStart - touchEnd > 50) rendition.next();
          if (touchEnd - touchStart > 50) rendition.prev();
        }
      });
      
      // Notificar que se ha cargado
      sendMessage("loaded", true);
    } catch (error) {
      console.error("Error al inicializar el lector:", error);
      sendMessage("error", error.toString());
    }
    
    true; // Importante para WebView
  `;

  // HTML para el WebView
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <title>Lector EPUB</title>
      <script src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"></script>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #f8f9fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        #viewer {
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50px;
          background-color: ${colors.primary};
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 15px;
          z-index: 1000;
        }
        .controls {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 20px;
          z-index: 1000;
        }
        .nav-button {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          background-color: rgba(0, 0, 0, 0.2);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 24px;
          border: none;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <span>Lector EPUB</span>
      </div>
      <div id="viewer"></div>
      <div class="controls">
        <button class="nav-button" onclick="window.rendition.prev()">←</button>
        <button class="nav-button" onclick="window.rendition.next()">→</button>
      </div>
    </body>
    </html>
  `;

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error || 'No se pudo cargar el visor EPUB.'}
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webView}
        onMessage={handleWebViewMessage}
        onError={handleWebViewError}
        injectedJavaScript={injectedJavaScript}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        mixedContentMode="always"
        onLoad={() => console.log('WebView cargado')}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webView: {
    flex: 1,
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
  },
});

export default NativeEpubViewer;
