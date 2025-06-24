import React, { memo } from 'react';
import { IEpubReaderWebProps } from './types';
import EpubReaderWebView from './EpubReaderWebView';
import { useEpubRendering } from '../../hooks/useEpubRendering';

/**
 * Componente contenedor para el lector EPUB
 * Sigue el patrón Container/Presentational separando la lógica de la interfaz
 */
const EpubReaderWebContainer: React.FC<IEpubReaderWebProps> = ({ 
  epubUrl, 
  initialCfi, 
  onLocationChange 
}) => {
  // Usar hook personalizado para toda la lógica de renderización
  const {
    isLoading,
    loadError,
    canGoBack,
    canGoForward,
    viewerRef,
    handlePrevPage,
    handleNextPage,
    handleRetry
  } = useEpubRendering({ 
    epubUrl, 
    initialCfi, 
    onLocationChange 
  });

  // Renderizar solo el componente de vista con las props necesarias
  return (
    <EpubReaderWebView
      viewerRef={viewerRef}
      isLoading={isLoading}
      loadError={loadError}
      canGoBack={canGoBack}
      canGoForward={canGoForward}
      onPrevPage={handlePrevPage}
      onNextPage={handleNextPage}
      onRetry={handleRetry}
    />
  );
};

// Aplicar memoización para evitar renders innecesarios
export default memo(EpubReaderWebContainer);
