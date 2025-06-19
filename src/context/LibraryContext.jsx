import React, { createContext, useState, useEffect } from 'react';
import { fetchBooks } from '../api/endpoints';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchBooks();
                setBooks(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, []);

    return (
        <LibraryContext.Provider value={{ books, loading, error }}>
            {children}
        </LibraryContext.Provider>
    );
};