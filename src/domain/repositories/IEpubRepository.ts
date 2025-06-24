/**
 * Interfaz para el repositorio EPUB 
 * Define las operaciones necesarias para cargar y manipular libros EPUB
 */
export interface IEpubFile {
  url: string;          // URL del blob para acceder al EPUB
  blob: Blob;           // Blob que contiene los datos del EPUB
  arrayBuffer: ArrayBuffer; // Datos binarios del EPUB
}

export interface IEpubRepository {
  /**
   * Carga un archivo EPUB desde una fuente (API, sistema de archivos, etc.)
   * @param file Identificador del archivo (ID, ruta, etc.)
   * @returns Promesa con el archivo EPUB y datos asociados
   */
  loadEpub(file: string): Promise<IEpubFile>;
  
  /**
   * Extrae el ID del libro de una ruta o cadena
   * @param path Ruta o cadena que contiene el ID del libro
   * @returns ID del libro o null si no se pudo extraer
   */
  extractBookIdFromPath(path: string): string | null;
}
