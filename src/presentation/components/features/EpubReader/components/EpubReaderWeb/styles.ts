import { StyleSheet } from 'react-native';

/**
 * Estilos para el componente EpubReaderWeb
 * Separados de la lógica y presentación para seguir los principios de Clean Architecture
 * Las propiedades específicas de tema se aplican dinámicamente en el componente
 */
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  viewerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    // Establecer pointerEvents dentro del estilo para evitar warnings
    pointerEvents: 'auto',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 15,
  },  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra multiplataforma usando elevation para Android
    elevation: 3,
    // Para iOS, estas propiedades se aplicarán dinamicamente en el componente
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  readerArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centeredText: {
    textAlign: 'center',
  }
});
