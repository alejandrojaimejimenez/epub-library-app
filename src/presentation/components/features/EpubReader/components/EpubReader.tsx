import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@presentation/theme/useTheme';
import { Loading } from '@presentation/components/atoms';
import { useEpubReader } from '../hooks/useEpubReader';

// Importamos los componentes internos del feature
import EpubReaderDevices from './EpubReaderDevices';
import EpubReaderWeb from './EpubReaderWeb';

interface EpubReaderProps {
  bookId: string;
  initialCfi?: string;
  onLocationChange?: (newCfi: string) => void;
}

/**
 * Componente principal del lector de EPUB que:
 * 1. Recibe bookId como prop
 * 2. Carga el archivo EPUB y la posición de lectura mediante el hook useEpubReader
 * 3. Renderiza el lector adecuado según la plataforma
 */
const EpubReader: React.FC<EpubReaderProps> = ({ 
  bookId, 
  initialCfi: initialCfiProp, 
  onLocationChange 
}) => {
  const { colors, spacing, typography } = useTheme();
  
  // Usamos el hook personalizado que encapsula toda la lógica
  const {
    epubData,
    initialCfi,
    isLoading,
    error,
    handleLocationChange
  } = useEpubReader(bookId, initialCfiProp, onLocationChange);

  // Renderizado condicional
  if (isLoading) {
    return <Loading text="Cargando libro..." />;
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <Text style={[styles.errorTitle, { fontSize: typography.h2.fontSize, color: colors.error }]}>
          Error
        </Text>
        <Text style={[styles.errorMessage, { fontSize: typography.body.fontSize, color: colors.text }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!epubData || !epubData.url) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background, padding: spacing.lg }]}>
        <Text style={[styles.errorMessage, { fontSize: typography.body.fontSize, color: colors.text }]}>
          No se pudo cargar el archivo EPUB
        </Text>
      </View>
    );
  }

  // Props comunes para ambos lectores
  const readerProps = {
    epubUrl: epubData.url,
    initialCfi,
    onLocationChange: handleLocationChange
  };

  // Renderizar el lector adecuado según la plataforma
  return Platform.OS === 'web' 
    ? <EpubReaderWeb {...readerProps} />
    : <EpubReaderDevices {...readerProps} />;
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  errorMessage: {
    textAlign: 'center'
  }
});

export default EpubReader;
