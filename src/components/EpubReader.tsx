import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import useEpubParser from '../hooks/useEpubParser';
import Loading from './common/Loading';
import WebEpubReader from './WebEpubReader';

interface EpubReaderProps {
    filePath: string;
    onLocationChange?: (location: number, cfi?: string) => void;
}

const EpubReader: React.FC<EpubReaderProps> = ({ filePath, onLocationChange }) => {
    const { content, loading, error, loadEpub } = useEpubParser();
    const [currentLocation, setCurrentLocation] = useState<number>(0);
    const loadingRef = useRef<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Cargando libro...');
    const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
        // Evitar cargar si ya está cargando o si ya hay contenido para este archivo
        if (filePath && !loadingRef.current && !content) {
            loadingRef.current = true;
            
            // Configurar mensajes de carga con temporizador
            setLoadingMessage('Cargando libro...');
            
            // Establecer un temporizador para actualizar el mensaje después de 10 segundos
            const timerMessage = setTimeout(() => {
                setLoadingMessage('La carga está tardando más de lo esperado. Por favor, espere...');
            }, 10000);
            
            // Establecer un temporizador para el timeout después de 60 segundos
            const timerTimeout = setTimeout(() => {
                if (loadingRef.current) {
                    setLoadingMessage('Tiempo de espera agotado. La descarga del libro está tardando demasiado.');
                    loadingRef.current = false;
                }
            }, 60000);
            
            // Guardar los timers para limpiarlos después
            loadingTimerRef.current = timerMessage;
            
            // Cargar el EPUB
            loadEpub(filePath)
                .finally(() => {
                    // Limpiar los temporizadores cuando la carga termine (éxito o error)
                    if (loadingTimerRef.current) {
                        clearTimeout(loadingTimerRef.current);
                    }
                    clearTimeout(timerTimeout);
                    loadingRef.current = false;
                });
        }
        
        return () => {
            // Limpiar los temporizadores cuando el componente se desmonte
            if (loadingTimerRef.current) {
                clearTimeout(loadingTimerRef.current);
            }
        };
    }, [filePath]); // Solo dependemos de filePath, no de loadEpub para evitar re-renders

    // Actualizar la ubicación del lector y notificar el cambio
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const location = Math.round((offsetY / contentHeight) * 100);
        
        if (location !== currentLocation) {
            setCurrentLocation(location);
            
            if (onLocationChange) {
                onLocationChange(location);
            }
        }
    };
      // Handler para cambios de ubicación en el WebEpubReader
    const handleWebLocationChange = (locationCfi: string) => {
        // Convertir CFI a un número entre 0-100 para mantener compatibilidad
        // Esto es una simplificación, en realidad los CFIs son más complejos
        const location = Math.round(Math.random() * 100); // Temporal
        
        if (onLocationChange) {
            onLocationChange(location, locationCfi);
        }
    };

    if (loading || loadingRef.current) {
        return (
            <View style={styles.loadingContainer}>
                <Loading />
                <Text style={styles.loadingText}>{loadingMessage}</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error al cargar el EPUB: {error}</Text>
                <Text style={styles.errorDescription}>
                    {Platform.OS === 'web' 
                        ? 'La lectura de EPUB en la versión web puede tener limitaciones. Intente usar la aplicación móvil para una mejor experiencia.'
                        : 'Verifique que el archivo EPUB sea válido y esté disponible.'}
                </Text>
            </View>
        );
    }
    
    if (!content) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No se pudo cargar el contenido del libro</Text>
            </View>
        );
    }    // Para versión web, usar el componente WebEpubReader cuando hay una URL disponible
    if (Platform.OS === 'web' && content.url) {
        console.log('Renderizando WebEpubReader con URL:', content.url);
        
        return (
            <View style={[styles.container, {height: '100%'}]}>
                <WebEpubReader 
                    url={content.url} 
                    blob={content.blob}
                    arrayBuffer={content.arrayBuffer}
                    onLocationChange={handleWebLocationChange}
                />
            </View>
        );
    }

    // Renderizar el contenido apropiado según la plataforma
    const renderContent = () => {
        // Para móvil o fallback
        return (
            <View style={styles.contentContainer}>
                <Text style={styles.title}>{content.metadata.title}</Text>
                <Text style={styles.author}>{content.metadata.creator}</Text>
                
                <View style={styles.divider} />
                
                <Text style={styles.content}>{content.content}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView 
                style={styles.scrollView}
                onScroll={handleScroll}
                scrollEventThrottle={400} // Limitar la frecuencia de eventos de desplazamiento
            >
                {renderContent()}
            </ScrollView>        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    author: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 24,
        textAlign: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 20,
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
    note: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        marginTop: 20,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
        padding: 20,
    },    errorDescription: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default EpubReader;