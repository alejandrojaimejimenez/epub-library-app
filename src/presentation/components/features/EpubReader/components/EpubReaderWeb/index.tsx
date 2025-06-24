/**
 * Archivo principal que exporta el componente EpubReaderWeb
 * Siguiendo el patrón recomendado para componentes complejos
 * 
 * Punto de entrada unificado para el lector EPUB web
 */
import EpubReaderWeb from './EpubReaderWeb';
import EpubReaderWebContainer from './EpubReaderWebContainer';
import EpubReaderWebView from './EpubReaderWebView';
import type { IEpubReaderWebProps } from './types';
import type { IEpubReaderState } from './types';
import { EPUB_CONTAINER_ID } from './types';

export type { IEpubReaderWebProps, IEpubReaderState };
export { 
  EpubReaderWebContainer,
  EpubReaderWebView,
  EPUB_CONTAINER_ID 
};

export default EpubReaderWeb;
