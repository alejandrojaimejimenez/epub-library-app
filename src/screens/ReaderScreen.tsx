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
    const { getBookById, updateLastReadPosition } = useBooks();
    
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);    const [currentCfi, setCurrentCfi] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookData = await getBookById(bookId);
                setBook(bookData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error(`Error al cargar el libro ${bookId}`));
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId, getBookById]);    // Handler para cambios de posición en el lector
    const handleLocationChange = (location: number, cfi?: string) => {
        if (book) {
            setCurrentCfi(cfi);
            console.log(`Actualizando posición para libro ${book.id}: location=${location}, cfi=${cfi || 'no disponible'}`);
            try {
                updateLastReadPosition(book.id.toString(), location, cfi);
            } catch (err) {
                console.error('Error al actualizar posición:', err);
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