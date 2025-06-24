import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MBook } from '@models/Book';
import { useTheme } from '@theme/useTheme';

export interface IBookCardProps {
  book: MBook;
  onPress: (book: MBook) => void;
  style?: any;
}

/**
 * Tarjeta para mostrar la información de un libro
 * Muestra portada, título y autor(es)
 */
const BookCard: React.FC<IBookCardProps> = ({ book, onPress, style }) => {
  const { colors, spacing, typography, borders } = useTheme();
  
  // Determinar la fuente de la imagen de portada
  const coverSource = book.cover_path 
    ? { uri: book.cover_path } 
    : require('../../../../../assets/images/default-cover.jpg');
  
  // Obtener el nombre del autor principal o "Desconocido" si no hay autores
  const authorName = book.authors && book.authors.length > 0
    ? book.authors[0].name
    : "Autor desconocido";
    
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.cardBackground,
      borderRadius: borders.radius.md,
      overflow: 'hidden',
      // Sombra para Android
      elevation: 2,
      // Para iOS/Web las sombras se aplican dinámicamente
      margin: spacing.xs,
    },
    cover: {
      width: 120,
      height: 180,
      backgroundColor: colors.placeholder,
    },
    info: {
      padding: spacing.sm,
      width: 120,
    },
    title: {
      fontSize: typography.bodySmall.fontSize,
      fontWeight: typography.bodySmall.fontWeight as "400",
      marginBottom: spacing.xs,
      color: colors.text,
    },
    author: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.caption.fontWeight as "400",
      color: colors.textSecondary,
    }
  });

  // Aplicar sombras según la plataforma
  const containerStyle = [
    styles.container,
    style,
    // Aplicar sombras para iOS/Web
    Platform.OS !== 'android' && {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    }
  ];

  return (
    <TouchableOpacity 
      style={containerStyle} 
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
          {authorName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BookCard;
