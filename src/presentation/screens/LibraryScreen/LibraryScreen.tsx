import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Components
import BookCard from '@components/molecules/BookCard';
import Loading from '@components/atoms/Loading';
import ScreenWithHeader from '@components/templates/ScreenWithHeader';
import SearchBar from '@components/molecules/SearchBar';
import { ViewToggle } from '@components/molecules/ViewToggle';

// Theme
import { useTheme } from '@theme/useTheme';


// Domain
import { MBook } from '@models/Book';

// Shared
import useBooks from '@hooks/useBooks';

// Local
import { ViewMode } from './types';
import { createStyles } from './styles';
import { useLibrarySearch } from './hooks';

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { books, loading, error } = useBooks();
  const [currentView, setCurrentView] = useState<ViewMode>('grid');
  const theme = useTheme();
  const styles = createStyles(theme);
  
  const {
    searchQuery,
    isSearching,
    handleSearchChange,
    handleSearch,
    displayedBooks
  } = useLibrarySearch();

  const handleBookPress = (book: MBook) => {
    navigation.navigate('BookDetail', { bookId: book.id.toString() });
  };

  const renderBook = ({ item }: { item: MBook }) => (
    <BookCard 
      book={item} 
      onPress={() => handleBookPress(item)} 
      style={currentView === 'grid' ? styles.gridCard : styles.listCard}
    />
  );

  const handleViewToggle = () => {
    setCurrentView(currentView === 'grid' ? 'list' : 'grid');
  };

  const viewToggle = (
    <ViewToggle
      isGridView={currentView === 'grid'}
      onToggle={handleViewToggle}
      gridViewAccessibilityLabel="Cambiar a vista cuadrícula"
      listViewAccessibilityLabel="Cambiar a vista lista"
    />
  );

  const content = (
    <>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearchChange}
        onSubmit={handleSearch}
        isSearching={isSearching}
      />
      
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
          key={currentView}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isSearching ? 'Buscando...' : searchQuery ? 'No se encontraron resultados' : 'No hay libros en tu biblioteca'}
              </Text>
            </View>
          }
        />
      )}
    </>
  );

  return (
    <ScreenWithHeader
      title="Biblioteca"
      rightComponent={viewToggle}
    >
      {content}
    </ScreenWithHeader>
  );
};

export default LibraryScreen;
