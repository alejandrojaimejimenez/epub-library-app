import React from 'react';
import { View, Text, FlatList, StyleSheet, ListRenderItemInfo } from 'react-native';
import { MBook } from '@models/Book';
import { useTheme } from '@theme/useTheme';
import BookCard from '@components/molecules/BookCard';

export interface IBookListProps {
  title?: string;
  books: MBook[];
  onBookPress: (book: MBook) => void;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

/**
 * Componente para mostrar una lista de libros
 * Puede ser horizontal o en grid según las necesidades
 */
const BookList: React.FC<IBookListProps> = ({ 
  title, 
  books, 
  onBookPress, 
  horizontal = true,
  showsHorizontalScrollIndicator = false 
}) => {
  const { colors, spacing, typography } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.md,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    title: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight as "600",
      color: colors.text,
    },
    listContainer: {
      paddingLeft: spacing.sm,
    },
    gridContainer: {
      paddingHorizontal: spacing.sm,
    },
    horizontalCard: {
      marginRight: spacing.sm,
    },
    gridCard: {
      margin: spacing.xs,
      width: '47%', // Aproximadamente 2 columnas con margen
    },
    emptyContainer: {
      padding: spacing.lg,
      alignItems: 'center',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: typography.body.fontSize,
      fontWeight: typography.body.fontWeight as "400",
    }
  });

  // Renderizar cada elemento del libro
  const renderItem = ({ item }: ListRenderItemInfo<MBook>) => (
    <BookCard 
      book={item} 
      onPress={onBookPress} 
      style={horizontal ? styles.horizontalCard : styles.gridCard}
    />
  );

  // Renderizar mensaje cuando no hay libros
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No hay libros disponibles</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        contentContainerStyle={horizontal ? styles.listContainer : styles.gridContainer}
        numColumns={horizontal ? 1 : 2}
        key={horizontal ? 'horizontal' : 'grid'}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

export default BookList;
