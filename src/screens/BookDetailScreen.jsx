import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useBooks } from '../hooks/useBooks';
import Loading from '../components/common/Loading';

const BookDetailScreen = () => {
    const route = useRoute();
    const { bookId } = route.params;
    const { book, isLoading } = useBooks(bookId);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
            <Text style={styles.description}>{book.description}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 18,
        color: 'gray',
    },
    description: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default BookDetailScreen;