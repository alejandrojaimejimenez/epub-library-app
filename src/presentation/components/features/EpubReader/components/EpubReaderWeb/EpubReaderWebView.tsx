import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '@presentation/theme/useTheme';
import { styles } from './styles';

export interface IEpubReaderWebViewProps {
  viewerRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  loadError: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onRetry?: () => void; // Nuevo prop para reintentar en caso de error
}

/**
 * Componente de presentación para el lector EPUB
 * Solo se encarga de renderizar la UI sin lógica de negocio
 */
const EpubReaderWebView: React.FC<IEpubReaderWebViewProps> = ({
  viewerRef,
  isLoading,
  loadError,
  canGoBack,
  canGoForward,
  onPrevPage,
  onNextPage,
  onRetry
}) => {  const { colors, spacing } = useTheme();
    // Estilos dinámicos basados en el tema
  const dynamicStyles = {
    errorContainer: {
      backgroundColor: colors.background,
      padding: spacing.md
    },
    errorText: {
      color: colors.error,
      marginBottom: spacing.md
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: 4,
      alignSelf: 'center' as const,
      marginTop: spacing.md
    },
    retryText: {
      color: colors.textLight,
      fontWeight: 'bold' as const
    },
    loadingText: {
      color: colors.text
    },
    navButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      // Sombras para iOS/Web con propiedades correctas
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3
    },
    navButtonDisabled: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    },
    navButtonText: {
      color: colors.textLight
    }
  };

  return (
    <View style={styles.container}>
      {/* Contenedor del visor EPUB */}
      <View 
        style={styles.viewerContainer}
        //@ts-ignore - Esta es una manera de acceder a la ref para React Native Web
        ref={viewerRef}
      />
      
      {/* Mensaje de error (si existe) */}
      {loadError && (
        <View style={[styles.errorContainer, dynamicStyles.errorContainer]}>
          <Text style={[styles.errorText, dynamicStyles.errorText]}>
            Error: {loadError}
          </Text>
          
          {onRetry && (
            <Pressable 
              style={dynamicStyles.retryButton}
              onPress={onRetry}
            >
              <Text style={dynamicStyles.retryText}>Reintentar</Text>
            </Pressable>
          )}
        </View>
      )}
      
      {/* Indicador de carga */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Cargando libro...</Text>
        </View>
      )}
      
      {/* Botones de navegación */}
      <View style={styles.navigationContainer}>        <Pressable 
          style={[
            styles.navButton, 
            !canGoBack && styles.navButtonDisabled,
            dynamicStyles.navButton,
            !canGoBack && dynamicStyles.navButtonDisabled
          ]}
          disabled={!canGoBack}
          onPress={onPrevPage}
          accessibilityLabel="Página anterior"
        >
          <Text style={[styles.navButtonText, dynamicStyles.navButtonText]}>←</Text>
        </Pressable>
        
        <Pressable 
          style={[
            styles.navButton, 
            !canGoForward && styles.navButtonDisabled,
            dynamicStyles.navButton,
            !canGoForward && dynamicStyles.navButtonDisabled
          ]}
          disabled={!canGoForward}
          onPress={onNextPage}
          accessibilityLabel="Página siguiente"
        >
          <Text style={[styles.navButtonText, dynamicStyles.navButtonText]}>→</Text>
        </Pressable>
      </View>
    </View>
  );
};

// Utilizar memo para evitar re-renderizados innecesarios del componente de presentación
export default memo(EpubReaderWebView);
