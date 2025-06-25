import { useState, useCallback } from 'react';
import { MBook } from '@models/Book';
import useBooks from '@hooks/useBooks';

export const useLibrarySearch = () => {
  const { books, searchBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.length === 0) {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim().length === 0) return;
    
    setIsSearching(true);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, searchBooks]);

  return {
    searchQuery,
    searchResults,
    isSearching,
    handleSearchChange,
    handleSearch,
    displayedBooks: searchResults.length > 0 || isSearching ? searchResults : books,
  };
};
