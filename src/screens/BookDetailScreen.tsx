import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useBooks from '../hooks/useBooks';
import Loading from '../components/common/Loading';
import { Book } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as FileSystem from 'expo-file-system';
import { colors } from '../constants/colors';
import { API_BASE_URL } from '../constants/config';

type BookDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookDetail'>;
type BookDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookDetail'>;

const BookDetailScreen: React.FC = () => {
    const route = useRoute<BookDetailScreenRouteProp>();
    const navigation = useNavigation<BookDetailScreenNavigationProp>();
    const { bookId } = route.params;
    const { getBookById } = useBooks();
    
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
    }, [bookId, getBookById]);

    const handleReadBook = () => {
        if (book) {
            navigation.navigate('Reader', { bookId: book.id.toString() });
        }
    };

    // Determinar la URL de la portada basada en la plataforma
    let coverUrl;
    if (book?.has_cover) {
        if (Platform.OS === 'web') {
            // En web, usamos la URL del backend para obtener la portada
            coverUrl = `${API_BASE_URL}/books/${book.id}/cover`;
        } else {
            // En móvil, usamos la ruta del sistema de archivos
            const baseDir = FileSystem.documentDirectory || '';
            coverUrl = book.cover_path ? `${baseDir}${book.cover_path}` : undefined;
        }
    }    if (loading) {
        return <Loading />;
    }

    if (error || !book) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error ? error.message : 'No se pudo encontrar el libro'}
                </Text>
            </View>
        );
    }

    // Extraer información del libro
    const authorName = book.authors && book.authors.length > 0 
        ? book.authors[0].name 
        : book.author_sort?.replace(/,\s*/, ', ') || 'Autor desconocido';
    
    // Extraer la fecha de publicación
    const publishDate = book.pubdate ? new Date(book.pubdate) : null;
    
    // Extraer la descripción (comentarios HTML)
    const description = book.comments;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image 
                    source={coverUrl ? { uri: coverUrl } : require('../../assets/images/default-cover.jpg')} 
                    style={styles.coverImage}
                    defaultSource={require('../../assets/images/default-cover.jpg')}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{book.title}</Text>
                    <Text style={styles.author}>{authorName}</Text>
                    
                    {publishDate && (
                        <Text style={styles.publishDate}>
                            Publicado: {publishDate.getFullYear()}
                        </Text>
                    )}
                    
                    {book.tags && book.tags.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {book.tags.map((tag, index) => (
                                <View key={index} style={styles.tagPill}>
                                    <Text style={styles.tagText}>{tag.name}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
            
            <TouchableOpacity style={styles.readButton} onPress={handleReadBook}>
                <Text style={styles.readButtonText}>Leer Libro</Text>
            </TouchableOpacity>
            
            {description && (
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Descripción</Text>
                    <Text style={styles.description}>
                        {description.replace(/<[^>]*>/g, '')}
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        padding: 20,
    },
    coverImage: {
        width: 120,
        height: 180,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    infoContainer: {
        flex: 1,
        marginLeft: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    author: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    publishDate: {
        fontSize: 14,
        color: '#888',
        marginBottom: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tagPill: {
        backgroundColor: '#f0f0f0',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#666',
    },
    readButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        padding: 16,
        margin: 20,
        alignItems: 'center',
    },
    readButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        padding: 20,
        paddingTop: 0,
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
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

export default BookDetailScreen;