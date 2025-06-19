import React from 'react';
import { View, StyleSheet } from 'react-native';
import EpubReader from '../components/EpubReader';
import { useBooks } from '../hooks/useBooks';

const ReaderScreen = ({ route }) => {
    const { bookId } = route.params;
    const { getBookById } = useBooks();
    const book = getBookById(bookId);

    return (
        <View style={styles.container}>
            {book && <EpubReader filePath={book.filePath} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReaderScreen;