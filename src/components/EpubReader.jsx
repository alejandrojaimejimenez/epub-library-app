import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEpubParser } from '../hooks/useEpubParser';
import Loading from './common/Loading';

const EpubReader = ({ epubFile }) => {
    const { content, loading, error } = useEpubParser(epubFile);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading EPUB: {error.message}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.content}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    content: {
        fontSize: 16,
        lineHeight: 24,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
});

export default EpubReader;