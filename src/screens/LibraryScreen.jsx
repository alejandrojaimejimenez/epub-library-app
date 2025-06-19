import React, { useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { LibraryContext } from '../context/LibraryContext';
import BookList from '../components/BookList';
import Loading from '../components/common/Loading';

const LibraryScreen = () => {
    const { books, loading, fetchBooks } = useContext(LibraryContext);

    useEffect(() => {
        fetchBooks();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <View>
            <Text>Mi Biblioteca</Text>
            <BookList books={books} />
        </View>
    );
};

export default LibraryScreen;