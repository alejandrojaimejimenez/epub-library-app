import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Book } from '../types';
import * as FileSystem from 'expo-file-system';
import { API_BASE_URL } from '../constants/config';

type BookCardNavigationProp = StackNavigationProp<RootStackParamList, 'Library'>;

interface BookCardProps {
    book: Book;
    onPress?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
    const { id, title, authors, cover_path, has_cover } = book;
    const navigation = useNavigation<BookCardNavigationProp>();
    
    // Obtener el nombre del autor (podría haber varios)
    const authorName = authors && authors.length > 0 
        ? authors[0].name 
        : book.author_sort?.replace(/,\s*/, ', ') || 'Autor desconocido';
    
    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.navigate('BookDetail', { bookId: id.toString() });
        }
    };
    
    // Determinar la URL de la portada basada en la plataforma
    let coverUrl;
    if (has_cover) {
        if (Platform.OS === 'web') {
            // En web, usamos la URL del backend para obtener la portada
            coverUrl = `${API_BASE_URL}/books/${id}/cover`;
        } else {
            // En móvil, usamos la ruta del sistema de archivos
            const baseDir = FileSystem.documentDirectory || '';
            coverUrl = cover_path ? `${baseDir}${cover_path}` : undefined;
        }
    }
    
    return (
        <TouchableOpacity onPress={handlePress} style={styles.card}>
            <Image 
                source={coverUrl ? { uri: coverUrl } : require('../../assets/images/default-cover.jpg')} 
                style={styles.coverImage}
                defaultSource={require('../../assets/images/default-cover.jpg')}
            />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.author} numberOfLines={1}>{authorName}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        flexDirection: 'row',
    },
    coverImage: {
        width: 80,
        height: 120,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
        color: '#666',
    },
});

export default BookCard;