import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BookList from '../components/BookList';
import Loading from '../components/common/Loading';
import Header from '../components/common/Header';
import LogoutButton from '../components/common/LogoutButton';
import { colors } from '../theme/colors';
import useBooks from '../../shared/hooks/useBooks';
import { useAuth } from '../../shared/hooks/useAuth';
import { Book } from '../../domain/models/Book';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { books, loading, error, getBooksByTag } = useBooks();
  const { user } = useAuth();
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [popularBooks, setPopularBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (books.length > 0) {
      // Mostrar los libros más recientes (basado en la fecha de adición)
      const sortedByDate = [...books].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setRecentBooks(sortedByDate.slice(0, 10));

      // Para este ejemplo, simulamos "libros populares" basados en algún criterio
      // En una app real, esto podría venir del backend con métricas reales
      const sorted = [...books].sort(() => 0.5 - Math.random());
      setPopularBooks(sorted.slice(0, 10));
    }
  }, [books]);

  const handleBookPress = (book: Book) => {
    navigation.navigate('BookDetail', { book });
  };

  const navigateToLibrary = () => {
    navigation.navigate('Library');
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.message || 'Error al cargar los libros. Intente nuevamente.'}
        </Text>
        
        {/* Añadimos detalles de depuración */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Información de depuración:</Text>
          <Text style={styles.debugText}>Error: {error.toString()}</Text>
          <Text style={styles.debugText}>Libros cargados: {books.length}</Text>
        </View>
      </View>
    );
  }

  // Si no hay libros pero tampoco error, mostramos un mensaje informativo con depuración
  if (books.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          No hay libros disponibles en tu biblioteca.
        </Text>
        
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Información de depuración:</Text>
          <Text style={styles.debugText}>Estado de carga: {loading ? 'Cargando' : 'Completado'}</Text>
          <Text style={styles.debugText}>Error: {error ? error : 'Ninguno'}</Text>
          <Text style={styles.debugText}>Usuario: {user ? JSON.stringify(user) : 'No autenticado'}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Header 
        title="Mi Biblioteca de EPUB" 
        rightComponent={
          <TouchableOpacity onPress={navigateToLibrary}>
            <Text style={styles.viewAllText}>Ver todo</Text>
          </TouchableOpacity>
        }
        leftComponent={<LogoutButton style={styles.logoutButton} />}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Bienvenido, {user?.username || 'Usuario'}</Text>
          <Text style={styles.welcomeSubtitle}>
            Explora tu colección de libros electrónicos
          </Text>
        </View>
        
        {recentBooks.length > 0 && (
          <BookList 
            title="Añadidos recientemente" 
            books={recentBooks} 
            onBookPress={handleBookPress} 
          />
        )}
        
        {popularBooks.length > 0 && (
          <BookList 
            title="Populares" 
            books={popularBooks} 
            onBookPress={handleBookPress} 
          />
        )}
        
        {/* Se podrían agregar más secciones aquí según las necesidades */}
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
  welcomeSection: {
    padding: 20,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  viewAllText: {
    color: colors.textLight,
    fontSize: 14,
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
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  // Estilos para la depuración
  debugContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  debugText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  }
});

export default HomeScreen;
