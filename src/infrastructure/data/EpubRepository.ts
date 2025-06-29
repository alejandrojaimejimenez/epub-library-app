import { IEpubRepository, IEpubFile } from '@repositories/IEpubRepository';
import { API_ENDPOINTS } from '@api/endpoints';
import { getAuthToken } from '@utils/authStorage';

export class EpubRepository implements IEpubRepository {
  async loadEpub(file: string): Promise<IEpubFile> {
    try {
      // Extraer el ID del libro de la ruta o del objeto libro
      const bookId = this.extractBookIdFromPath(file);
      
      if (!bookId) {
        throw new Error('No se pudo determinar el ID del libro');
      }
      
      console.log('Intentando cargar EPUB para el libro ID:', bookId);
      
      // Crear un controlador de tiempo de espera (timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos
      
      try {
        // Construir la URL de la API
        const epubUrl = API_ENDPOINTS.GET_EPUB(bookId);
        console.log('Solicitando EPUB desde:', epubUrl);
        
        // Obtener el token de autenticación
        const token = await getAuthToken();
        
        if (!token) {
          console.warn('No hay token de autenticación disponible para la solicitud de EPUB');
        } else {
          console.log('Token de autenticación disponible para solicitud de EPUB');
        }
        
        // Usar la API del backend para obtener el archivo EPUB
        const response = await fetch(epubUrl, {
          signal: controller.signal,
          // Configurar caché para evitar descargar el mismo libro varias veces
          cache: 'force-cache',
          headers: {
            'Accept': 'application/epub+zip',
            // Incluir el token de autenticación
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        
        // Limpiar el timeout ya que la solicitud se completó
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Error al cargar archivo EPUB: ${response.status} - ${response.statusText}`);
        }
        
        // Verificar que se recibió un tipo de contenido válido
        const contentType = response.headers.get('content-type');
        console.log('Tipo de contenido recibido:', contentType);
        
        if (!contentType || (!contentType.includes('application/epub+zip') && !contentType.includes('application/octet-stream'))) {
          console.warn(`Tipo de contenido inesperado: ${contentType}. Se esperaba application/epub+zip`);
        }
          // Obtener el blob del EPUB
        const blob = await response.blob();
        console.log('EPUB recibido como blob, tamaño:', blob.size, 'bytes, tipo:', blob.type);
        
        if (blob.size === 0) {
          throw new Error('El archivo EPUB recibido está vacío');
        }
        
        if (blob.size < 1000) {
          console.warn('El archivo EPUB es sospechosamente pequeño:', blob.size, 'bytes');
          // A pesar de la advertencia, continuamos para ver si es válido
        }
        
        // Validar tipo MIME y contenido
        let mimeType = blob.type;
        if (!mimeType || 
            (!mimeType.includes('application/epub+zip') && 
             !mimeType.includes('application/octet-stream') && 
             !mimeType.includes('application/x-cbz'))) {
          console.warn(`Tipo MIME no reconocido: ${mimeType}. Forzando tipo a application/epub+zip`);
          mimeType = 'application/epub+zip';
        }
        
        // Crear una URL para el blob con el tipo MIME correcto
        const blobUrl = URL.createObjectURL(new Blob([blob], { type: mimeType }));
        console.log('Blob URL creada:', blobUrl.substring(0, 50), '...');
        
        // Devolver objeto con URL y blob para el EPUB
        return {
          url: blobUrl,
          blob: blob,
          arrayBuffer: await blob.arrayBuffer()
        };
      } catch (fetchError: unknown) {
        // Limpiar el timeout en caso de error
        clearTimeout(timeoutId);
        
        // Verificar si el error fue por timeout
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('La descarga del EPUB ha excedido el tiempo de espera (60 segundos)');
        }
        
        // Reenviar el error original
        throw fetchError;
      }
    } catch (error) {
      console.error('Error al cargar el EPUB:', error);
      throw new Error(`Error loading EPUB file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extrae el ID del libro de diferentes formatos de entrada
   * @param path Puede ser un ID directo, una ruta, o un objeto con ID
   */
  extractBookIdFromPath(path: string): string | null {
    // Si es una ruta completa, intentamos extraer el ID
    if (path && typeof path === 'string') {
      // Si es un ID numérico directamente
      if (/^\d+$/.test(path)) {
        console.log(`extractBookIdFromPath: Identificado ID numérico directo: ${path}`);
        return path;
      }
      
      // Buscar patrones comunes en rutas
      const patterns = [
        /\/books\/(\d+)/, // Ejemplo: /api/books/123
        /book[_-]?id=(\d+)/, // Ejemplo: ?book_id=123 o ?bookid=123
        /book\/(\d+)/, // Ejemplo: /book/123
        /\/(\d+)\.epub$/ // Ejemplo: /123.epub
      ];
      
      for (const pattern of patterns) {
        const match = path.match(pattern);
        if (match && match[1]) {
          console.log(`extractBookIdFromPath: ID extraído con patrón ${pattern}: ${match[1]}`);
          return match[1];
        }
      }
    }
    
    console.warn('extractBookIdFromPath: No se pudo extraer ID del libro:', path);
    return null;
  }
}
