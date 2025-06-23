import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Header from '@components/common/Header';
import Button from '@components/common/Button';
import Loading from '@components/common/Loading';
import { colors } from '@theme/colors';
import { MBook } from '@models/Book';
import useBooks from '@hooks/useBooks';

type RouteParams = {
  BookDetail: {
    book: MBook;
    bookId?: string;
  };
};

const BookDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'BookDetail'>>();
  const { getBookById, getBookReadPosition } = useBooks();

  const [book, setBook] = useState<MBook | null>(route.params?.book || null);
  const [loading, setLoading] = useState(!book);
  const [error, setError] = useState<string | null>(null);
  const [readPosition, setReadPosition] = useState<number | null>(null);

  const loadBook = useCallback(async () => {
    if (route.params?.bookId) {
      try {
        setLoading(true);
        const bookData = await getBookById(route.params.bookId);
        if (bookData) {
          setBook(bookData);
        } else {
          setError('No se pudo encontrar el libro');
        }
      } catch (err) {
        setError(`Error al cargar el libro: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    }
  }, [route.params?.bookId, getBookById]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);
  useEffect(() => {
    const fetchReadPosition = async () => {
      if (book) {
        try {
          console.log('Obteniendo posición de lectura para el libro:', book.id);
          const position = await getBookReadPosition(book.id.toString());
          if (position) {
            console.log('Posición de lectura recuperada:', position);
            setReadPosition(position.position);
          } else {
            console.log('No hay posición de lectura guardada');
          }
        } catch (err) {
          console.error('Error al obtener posición de lectura:', err);
        }
      }
    };

    fetchReadPosition();
  }, [book, getBookReadPosition]);
  const handleStartReading = () => {
    if (book) {
      console.log(`Iniciando lectura del libro ${book.id} con posición:`, readPosition);
      navigation.navigate('Reader', { 
        book: {
          id: book.id,
          title: book.title,
          authors: book.authors
        }, 
        initialPosition: readPosition
      });
    }
  };

  const goBack = () => navigation.goBack();

  if (loading) {
    return <Loading />;
  }

  if (error || !book) {
    return (
      <View style={styles.container}>
        <Header 
          title="Detalle del libro" 
          leftComponent={
            <TouchableOpacity onPress={goBack}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'No se pudo cargar el libro'}</Text>
        </View>
      </View>
    );
  }

  const coverSource = book.coverImage 
    ? { uri: book.coverImage } 
    : require('../../../assets/images/default-cover.jpg');

  return (
    <View style={styles.container}>
      <Header 
        title={book.title} 
        leftComponent={
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.bookHeader}>
          <Image source={coverSource} style={styles.cover} resizeMode="contain" />
          
          <View style={styles.bookInfo}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>
              {book.authors?.map(a => a.name).join(', ') || 'Autor desconocido'}
            </Text>
            
            {book.series && (
              <Text style={styles.series}>
                {`${book.series.name} ${book.series_index ? `#${book.series_index}` : ''}`}
              </Text>
            )}
            
            <View style={styles.tags}>
              {book.tags?.map((tag) => (
                <View key={tag.id} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <Button
            title={readPosition ? "Continuar leyendo" : "Comenzar a leer"}
            onPress={handleStartReading}
            size="large"
            style={styles.readButton}
          />
        </View>
        
        {book.comments && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinopsis</Text>
            <Text style={styles.description}>{book.comments}</Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fecha de publicación:</Text>
            <Text style={styles.detailValue}>
              {book.pubdate ? new Date(book.pubdate).toLocaleDateString() : 'Desconocida'}
            </Text>
          </View>
          
          {book.isbn && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ISBN:</Text>
              <Text style={styles.detailValue}>{book.isbn}</Text>
            </View>
          )}
          
          {book.formats && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Formatos:</Text>
              <Text style={styles.detailValue}>{book.formats.join(', ')}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.cardBackground,
  },
  cover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  series: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: colors.textLight,
    fontSize: 12,
  },
  actionButtons: {
    padding: 16,
    backgroundColor: colors.cardBackground,
    marginTop: 1,
  },
  readButton: {
    width: '100%',
  },
  section: {
    padding: 16,
    backgroundColor: colors.cardBackground,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 150,
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
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
});

export default BookDetailScreen;
