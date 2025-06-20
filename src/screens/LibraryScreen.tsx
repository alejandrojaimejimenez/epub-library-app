import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { LibraryContext } from '../context/LibraryContext';
import useBooks from '../hooks/useBooks';
import BookList from '../components/BookList';
import Loading from '../components/common/Loading';
import { colors } from '../constants/colors';

const LibraryScreen: React.FC = () => {
    const { books, loading, error } = useContext(LibraryContext);
    const { searchBooks } = useBooks();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState(books);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredBooks(books);
        }
    }, [books, searchQuery]);

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            setIsSearching(true);
            try {
                const results = await searchBooks(searchQuery);
                setFilteredBooks(results);
            } catch (err) {
                console.error('Error al buscar:', err);
            } finally {
                setIsSearching(false);
            }
        } else {
            setFilteredBooks(books);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Biblioteca</Text>
            
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar libros..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
            </View>
            
            {loading ? (
                <Loading />
            ) : error ? (
                <Text style={styles.errorText}>Error al cargar la biblioteca: {error.message}</Text>
            ) : isSearching ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <BookList books={filteredBooks} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.text,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    }
});

export default LibraryScreen;