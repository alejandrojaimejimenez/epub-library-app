import { Book, ApiResponse } from '../types';
import API_ENDPOINTS from '../api/endpoints';
import * as API from '../api/client';

// Carga un EPUB para lectura
export const loadEpub = async (file: string): Promise<any> => {
    try {
        // Extraer el ID del libro de la ruta o del objeto libro
        const bookId = extractBookIdFromPath(file);
        
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
            
            // Siempre usar la API del backend para obtener el archivo EPUB
            const response = await fetch(epubUrl, {
                signal: controller.signal,
                // Configurar caché para evitar descargar el mismo libro varias veces
                cache: 'force-cache',
                headers: {
                    'Accept': 'application/epub+zip'
                }
            });
            
            // Limpiar el timeout ya que la solicitud se completó
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Error loading EPUB file: ${response.status} - ${response.statusText}`);
            }
            
            // Verificar que se recibió un tipo de contenido válido
            const contentType = response.headers.get('content-type');
            console.log('Tipo de contenido recibido:', contentType);
            
            // Obtener el blob del EPUB
            const blob = await response.blob();
            console.log('EPUB recibido como blob, tamaño:', blob.size);
            
            if (blob.size === 0) {
                throw new Error('El archivo EPUB recibido está vacío');
            }
              // Crear una URL para el blob
            const blobUrl = URL.createObjectURL(blob);
            console.log('Blob URL creada:', blobUrl);
            
            // Devolver objeto con URL y blob para el EPUB
            return {
                url: blobUrl,
                blob: blob,
                arrayBuffer: await blob.arrayBuffer() // Añadimos arrayBuffer para más opciones
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
};

// Extraer el ID del libro de la ruta del archivo
const extractBookIdFromPath = (path: string): string | null => {
    // Si es una ruta completa, intentamos extraer el ID
    if (path && typeof path === 'string') {
        // Si la ruta ya tiene un ID formateado
        if (path.includes('/books/') && /\/books\/\d+\//.test(path)) {
            const match = path.match(/\/books\/(\d+)\//);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        // Si es una URL directa de la API
        if (path.includes('/api/books/')) {
            const match = path.match(/\/api\/books\/(\d+)(\/epub)?/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        // Si solo es un ID
        if (/^\d+$/.test(path)) {
            return path;
        }
    }
    return null;
};

// Guardar un EPUB
export const saveEpub = async (file: string): Promise<any> => {
    try {
        // Implementar lógica para guardar un EPUB a través de la API
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(API_ENDPOINTS.ADD_BOOK, {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`Error saving EPUB file: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`Error saving EPUB file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// Obtener lista de EPUBs
export const getEpubs = async (): Promise<ApiResponse<Book[]>> => {
    try {
        const books = await API.getBooks();
        // Convertimos la respuesta al formato ApiResponse
        return {
            success: true,
            data: books
        };
    } catch (error) {
        throw new Error(`Error fetching EPUBs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// Obtener la URL de portada para un libro
export const getBookCoverUrl = (book: Book): string => {
    // Siempre usar la API del backend para obtener la portada
    return book.id ? API_ENDPOINTS.GET_COVER(book.id.toString()) : '';
};

// Obtener la URL del archivo EPUB
export const getBookFileUrl = (book: Book): string => {
    // Siempre usar la API del backend para obtener el EPUB
    return book.id ? API_ENDPOINTS.GET_EPUB(book.id.toString()) : '';
};