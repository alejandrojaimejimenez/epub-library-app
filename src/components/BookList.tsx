import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import BookCard from './BookCard';
import Loading from './common/Loading';
import { Book } from '../types';

interface BookListProps {
    books: Book[];
    loading?: boolean;
}

const BookList: React.FC<BookListProps> = ({ books, loading }) => {
    if (loading) {
        return <Loading />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                renderItem={({ item }) => <BookCard book={item} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
});

export default BookList;