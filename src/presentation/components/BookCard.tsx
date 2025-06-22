import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../../domain/models/Book';
import { colors } from '../theme/colors';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
  style?: any;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress, style }) => {
  const coverSource = book.coverImage 
    ? { uri: book.coverImage } 
    : require('../../../assets/images/default-cover.jpg');

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={() => onPress(book)}
      activeOpacity={0.7}
    >
      <Image 
        source={coverSource} 
        style={styles.cover}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 15,
    marginBottom: 15,
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: colors.placeholder,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default BookCard;
