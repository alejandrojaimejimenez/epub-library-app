/**
 * Exportación principal del feature EpubReader
 * Siguiendo el patrón recomendado para features
 */
import EpubReader from './components/EpubReader';
import { useEpubRendering } from './hooks/useEpubRendering';

export {
  useEpubRendering
};

export default EpubReader;
