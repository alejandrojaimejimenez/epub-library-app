import React from 'react';
import { IEpubReaderWebProps } from './types';
import EpubReaderWebContainer from './EpubReaderWebContainer';

/**
 * Componente principal para lector de EPUB en entorno web
 * 
 * Este componente actúa como punto de entrada para el feature de lectura EPUB en web.
 * Sigue el patrón de Container/Presentational para separar lógica de UI:
 * - EpubReaderWeb: Punto de entrada y componente exportado
 * - EpubReaderWebContainer: Maneja la lógica y estado
 * - EpubReaderWebView: Se encarga exclusivamente de la presentación visual
 */
const EpubReaderWeb: React.FC<IEpubReaderWebProps> = (props) => {
  return <EpubReaderWebContainer {...props} />;
};

// Aplicamos memoización para optimizar el rendimiento
export default React.memo(EpubReaderWeb);
