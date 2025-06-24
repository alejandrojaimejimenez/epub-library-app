import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler, Platform, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { EpubReader } from '@presentation/components/features';
import { Loading } from '@presentation/components/atoms';
import { useTheme } from '@presentation/theme/useTheme';
import useBooks from '@hooks/useBooks';
import { MBook } from '@models/Book';

type RouteParams = {
  Reader: {
    book?: MBook;
    bookId?: string;
    initialPosition?: number;
    initialCfi?: string;
  };
};

const ReaderScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'Reader'>>();
  const navigation = useNavigation();
  const { updateLastReadPosition, getBookById } = useBooks();
  const { colors, spacing } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCfi, setCurrentCfi] = useState<string | undefined>(route.params.initialCfi);
  const [book, setBook] = useState<MBook | undefined>(route.params.book);
  
  const { initialPosition, initialCfi, bookId } = route.params;

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (bookId && !book) {
          const loadedBook = await getBookById(bookId);
          if (!loadedBook) {
            throw new Error('Libro no encontrado');
          }
          setBook(loadedBook);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el libro');
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId, book, getBookById]);
  // Función para salir del lector
  const handleExit = useCallback(() => {
    if (book?.id && currentCfi) {
      // Guardar la posición actual antes de salir
      saveReadingPosition(currentCfi);
    }
    navigation.goBack();
  }, [book?.id, currentCfi, navigation]);
  
  useEffect(() => {
    if (book?.title) {
      // Configurar el título de la pantalla
      navigation.setOptions({ title: book.title });
    }
    
    // Intercepción del botón de retroceso (solo en plataformas nativas)
    if (Platform.OS !== 'web') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleExit();
        return true;
      });
      
      return () => backHandler.remove();
    }
    
    // Para plataformas web, podemos usar el API de History si es necesario
    if (Platform.OS === 'web') {
      const handleWebBack = () => {
        handleExit();
        // No utilizamos preventDefault para permitir que la navegación web funcione normalmente
      };
      
      // Opcionalmente, podríamos añadir un listener para la tecla ESC
      // window.addEventListener('popstate', handleWebBack);
      // return () => window.removeEventListener('popstate', handleWebBack);
    }
  }, [book, navigation, handleExit]);  // Función para guardar la posición de lectura actual
  const saveReadingPosition = useCallback(async (cfi: string) => {
    if (!book?.id) return;
    
    try {
      await updateLastReadPosition(
        book.id.toString(),
        0, // Posición numérica (no se usa para EPUB)
        cfi
      );
    } catch (err) {
      console.error('Error al guardar posición de lectura:', err);
    }
  }, [book?.id, updateLastReadPosition]);
  // Manejar cambios en la posición de lectura
  const handleLocationChange = useCallback((cfi: string) => {
    setCurrentCfi(cfi);
    // Guardamos la posición cada vez que cambia
    saveReadingPosition(cfi);
  }, [saveReadingPosition]);

  // Manejar la salida del lector
  // const handleExit = useCallback(() => {
  //   if (currentCfi) {
  //     saveReadingPosition(currentCfi);
  //   }
  //   navigation.goBack();
  // }, [currentCfi, navigation, saveReadingPosition]);
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity 
          style={[styles.errorButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >          <Text style={[styles.errorButtonText, { color: colors.text }]}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading || !book) {
    return <Loading />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {book && (
        <EpubReader
          bookId={book.id.toString()}
          initialCfi={initialCfi}
          onLocationChange={handleLocationChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButton: {
    padding: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    fontSize: 16,
  },
});

export default ReaderScreen;
