import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler, Platform, Text, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import EpubReader from '@components/EpubReader';
import Loading from '@components/common/Loading';
import { colors } from '@theme/colors';
import useBooks from '@hooks/useBooks';
import { MBook } from '@models/Book';

type RouteParams = {
  Reader: {
    book: MBook;
    initialPosition?: number;
    initialCfi?: string;
  };
};

const ReaderScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'Reader'>>();
  const navigation = useNavigation();
  const { updateLastReadPosition } = useBooks();
  
  // El estado de carga se inicia como false porque la carga real se gestiona en EpubReader
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCfi, setCurrentCfi] = useState<string | undefined>(undefined);
  
  const { book, initialPosition, initialCfi } = route.params;
  useEffect(() => {
    // Configurar el título de la pantalla
    navigation.setOptions({ title: book.title });
    
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
  }, [book, navigation]);

  // Función para guardar la posición de lectura actual
  const saveReadingPosition = useCallback(async (cfi: string) => {
    try {
      await updateLastReadPosition(
        book.id.toString(),
        0, // Posición numérica (no se usa para EPUB)
        cfi
      );
    } catch (err) {
      console.error('Error al guardar posición de lectura:', err);
    }
  }, [book.id, updateLastReadPosition]);

  // Manejar cambios en la posición de lectura
  const handleLocationChange = useCallback((cfi: string) => {
    setCurrentCfi(cfi);
    // Guardamos la posición cada vez que cambia
    saveReadingPosition(cfi);
  }, [saveReadingPosition]);

  // Manejar la salida del lector
  const handleExit = useCallback(() => {
    if (currentCfi) {
      saveReadingPosition(currentCfi);
    }
    navigation.goBack();
  }, [currentCfi, navigation, saveReadingPosition]);
  if (loading) {
    return <Loading text="Preparando el libro..." />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EpubReader
        url={book.filePath || `${book.id}`}
        bookId={book.id.toString()}
        initialLocation={initialCfi}
        onLocationChange={handleLocationChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReaderScreen;
