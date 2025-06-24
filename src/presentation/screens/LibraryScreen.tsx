import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BookCard } from '@components/molecules';
import Loading from '@components/common/Loading';
import Header from '@components/common/Header';
import Button from '@components/common/Button';
import { colors } from '@theme/colors';
import useBooks from '@hooks/useBooks';
import { MBook } from '@models/Book';

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation<any>();  const { books, loading, error, searchBooks } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');

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
  const handleBookPress = (book: MBook) => {
    navigation.navigate('BookDetail', { bookId: book.id.toString() });
  };

  const renderBook = ({ item }: { item: MBook }) => (
    <BookCard 
      book={item} 
      onPress={handleBookPress} 
      style={currentView === 'grid' ? styles.gridCard : styles.listCard}
    />
  );

  const goBack = () => navigation.goBack();

  const displayedBooks = searchResults.length > 0 || isSearching ? searchResults : books;

  return (
    <View style={styles.container}>
      <Header 
        title="Biblioteca" 
        leftComponent={
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        }
        rightComponent={
          <TouchableOpacity onPress={() => setCurrentView(currentView === 'grid' ? 'list' : 'grid')}>
            <Text style={styles.viewToggle}>{currentView === 'grid' ? '≡' : '■'}</Text>
          </TouchableOpacity>
        }
      />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar libros..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSearch}
        />
        <Button
          title="Buscar"
          onPress={handleSearch}
          size="small"
          style={styles.searchButton}
        />
      </View>
      
      {loading ? (
        <Loading />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      ) : (
        <FlatList
          data={displayedBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.bookList}
          numColumns={currentView === 'grid' ? 2 : 1}
          key={currentView} // Forzar redibujado cuando cambia la vista
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isSearching ? 'Buscando...' : searchQuery ? 'No se encontraron resultados' : 'No hay libros en tu biblioteca'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    marginRight: 8,
  },
  searchButton: {
    height: 40,
  },
  bookList: {
    padding: 16,
  },
  gridCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 16,
  },
  listCard: {
    width: '100%',
    marginBottom: 16,
    height: 120,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    fontSize: 24,
    color: colors.textLight,
  },
  viewToggle: {
    fontSize: 24,
    color: colors.textLight,
  },
});

export default LibraryScreen;
