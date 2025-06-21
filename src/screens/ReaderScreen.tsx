import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import EpubReader from '../components/EpubReader';
import useBooks from '../hooks/useBooks';
import { Book } from '../types';
import Loading from '../components/common/Loading';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '../constants/config';
import { API_ENDPOINTS } from '../api/endpoints';

type ReaderScreenRouteProp = RouteProp<RootStackParamList, 'Reader'>;

const ReaderScreen: React.FC = () => {
    const route = useRoute<ReaderScreenRouteProp>();
    const { bookId } = route.params;
    const { getBookById, updateLastReadPosition, getBookReadPosition } = useBooks();
    
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [currentCfi, setCurrentCfi] = useState<string | undefined>(undefined);
    const [savedCfi, setSavedCfi] = useState<string | undefined>(undefined);    useEffect(() => {
        const fetchBookAndPosition = async () => {
            try {
                // Obtener los datos del libro
                const bookData = await getBookById(bookId);
                setBook(bookData);                // Obtener la posición de lectura específicamente desde el endpoint
                // Pasamos los parámetros para identificar el usuario y dispositivo actuales
                const readPosition = await getBookReadPosition(bookId, {
                    format: 'EPUB',
                    user: 'usuario1', // En una app real, esto vendría del contexto de autenticación
                    device: Platform.OS === 'web' ? 'browser' : Platform.OS
                });
                
                if (readPosition) {
                    console.log(`Posición de lectura obtenida para el libro ${bookId}:`, readPosition);
                    
                    // Validar que el CFI tenga un formato básico válido antes de usarlo
                    if (readPosition.cfi && typeof readPosition.cfi === 'string' && 
                        readPosition.cfi.startsWith('epubcfi(') && readPosition.cfi.includes('/')) {
                        console.log('CFI recuperado del servidor:', readPosition.cfi);
                        setSavedCfi(readPosition.cfi);
                    } else {
                        console.warn('El CFI recibido no tiene un formato válido:', readPosition.cfi);
                    }
                    
                    // También podemos guardar la posición porcentual si la necesitamos
                    if (readPosition.pos_frac !== undefined && bookData) {
                        const updatedBook = {
                            ...bookData,
                            lastReadPosition: readPosition.pos_frac,
                            lastReadCfi: readPosition.cfi
                        };
                        setBook(updatedBook);
                    }
                } else {
                    console.log(`No hay posición de lectura guardada para el libro ${bookId}, comenzando desde el inicio`);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error(`Error al cargar el libro ${bookId}`));
            } finally {
                setLoading(false);
            }
        };

        fetchBookAndPosition();
    }, [bookId, getBookById, getBookReadPosition]);    const handleLocationChange = (location: number, cfi?: string) => {
        if (book) {
            // Validar el CFI antes de usarlo
            if (cfi && typeof cfi === 'string' && cfi.startsWith('epubcfi(') && cfi.includes('/')) {
                setCurrentCfi(cfi);
                console.log(`Actualizando posición para libro ${book.id}: location=${location}, cfi=${cfi}`);
                try {
                    // Pasar los parámetros para identificar el usuario y dispositivo actuales
                    updateLastReadPosition(
                        book.id.toString(), 
                        location, 
                        cfi,
                        'EPUB',
                        'usuario1', // En una app real, esto vendría del contexto de autenticación
                        Platform.OS === 'web' ? 'browser' : Platform.OS
                    );
                } catch (err) {
                    console.error('Error al actualizar posición:', err);
                }
            } else {
                console.warn('CFI no válido, no se actualizará la posición:', cfi);
            }
        }
    };
    
    // Determinar la URL del EPUB basada en la plataforma
    let epubUri;
    if (book) {
        if (Platform.OS === 'web') {
            // En web, usamos directamente la URL del endpoint para obtener el archivo EPUB
            epubUri = API_ENDPOINTS.GET_EPUB(book.id.toString());
            console.log('Web EPUB URI:', epubUri);
        } else {
            // En móvil, usamos la ruta del sistema de archivos
            const baseDir = FileSystem.documentDirectory || '';
            // Obtener el path relativo del EPUB desde la ruta completa
            const relativePath = book.path;
            const epubFilename = book.formats?.find(format => format === 'EPUB') ? 'book.epub' : null;
            
            if (relativePath && epubFilename) {
                epubUri = `${baseDir}books/${relativePath}/${epubFilename}`;
                console.log('Native EPUB URI:', epubUri);
            }
        }
    }

    if (loading) {
        return <Loading />;
    }

    if (error || !book || !epubUri) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error ? error.message : 'No se pudo cargar el libro para lectura'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <EpubReader 
                filePath={epubUri} 
                onLocationChange={handleLocationChange}
                initialCfi={savedCfi} // Pasar el CFI guardado como CFI inicial
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default ReaderScreen;