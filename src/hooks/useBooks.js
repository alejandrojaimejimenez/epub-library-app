import { useEffect, useState, useContext } from 'react';
import { LibraryContext } from '../context/LibraryContext';
import { fetchBooks, addBook, deleteBook } from '../services/database';

const useBooks = () => {
    const { setBooks } = useContext(LibraryContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const books = await fetchBooks();
                setBooks(books);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadBooks();
    }, [setBooks]);

    const handleAddBook = async (book) => {
        try {
            await addBook(book);
            setBooks((prevBooks) => [...prevBooks, book]);
        } catch (err) {
            setError(err);
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await deleteBook(bookId);
            setBooks((prevBooks) => prevBooks.filter(book => book.id !== bookId));
        } catch (err) {
            setError(err);
        }
    };

    return { loading, error, handleAddBook, handleDeleteBook };
};

export default useBooks;