import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { Book } from '../../domain/models/Book';
import BookCard from './BookCard';
import { colors } from '../theme/colors';

interface BookListProps {
  title?: string;
  books: Book[];
  onBookPress: (book: Book) => void;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

const BookList: React.FC<BookListProps> = ({ 
  title, 
  books, 
  onBookPress, 
  horizontal = true,
  showsHorizontalScrollIndicator = false 
}) => {
  const renderItem = ({ item }: ListRenderItemInfo<Book>) => (
    <BookCard 
      book={item} 
      onPress={onBookPress} 
      style={horizontal ? styles.horizontalCard : styles.gridCard}
    />
  );

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={horizontal ? styles.horizontalList : styles.gridList}
        numColumns={horizontal ? 1 : 2}
        key={horizontal ? 'horizontal' : 'grid'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    color: colors.text,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
  gridList: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  horizontalCard: {
    marginRight: 15,
  },
  gridCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 15,
  },
});

export default BookList;
