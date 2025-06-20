import { useState, useRef } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import API_ENDPOINTS from '../api/endpoints';
import { loadEpub as serviceLoadEpub } from '../services/epubService';

interface EpubContent {
  metadata: {
    title: string;
    creator: string;
    description?: string;
    publisher?: string;
    pubdate?: string;
  };
  content: string; // Contenido simple del EPUB
  url?: string; // URL para el visor web de EPUB
  blob?: Blob; // Blob para el visor web de EPUB
  arrayBuffer?: ArrayBuffer; // ArrayBuffer para opciones alternativas
}

interface UseEpubParserReturn {
  content: EpubContent | null;
  error: string | null;
  loading: boolean;
  loadEpub: (fileUri: string) => Promise<void>;
}

// Función para extraer el ID del libro de una URL o ruta
const extractBookIdFromPath = (path: string): string | null => {
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

// Implementación simplificada para la primera versión
const useEpubParser = (): UseEpubParserReturn => {
    const [content, setContent] = useState<EpubContent | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const loadingRef = useRef<boolean>(false);
    
    const loadEpub = async (fileUri: string): Promise<void> => {
        // Evitar cargar si ya está cargando
        if (loadingRef.current) {
            return;
        }
        
        loadingRef.current = true;
        setLoading(true);
        setError(null);
        
        try {
            console.log('Loading EPUB from:', fileUri);
            
            // Extraer el ID del libro (si es posible)
            const bookId = extractBookIdFromPath(fileUri);
              // Obtener datos del libro según la plataforma
            if (Platform.OS === 'web') {            try {
                // En web, usamos la API directamente y configuramos para el visor web
                const epubData = await serviceLoadEpub(fileUri);
                const mockTitle = bookId ? `Libro #${bookId}` : 'Libro EPUB';
                const mockAuthor = 'Autor del libro';
                  // Importante: asegurarnos que la URL del blob es válida
                if (!epubData.url || typeof epubData.url !== 'string') {
                    throw new Error('No se pudo obtener una URL válida para el EPUB');
                }
                
                console.log('EPUB URL generada para web:', epubData.url);
                
                // Devolvemos objeto con URL para el visor web y el blob
                setContent({
                    metadata: {
                        title: mockTitle,
                        creator: mockAuthor,
                        description: 'Visor de EPUB en web'
                    },
                    content: `
                        EPUB cargado correctamente. 
                        Se está utilizando el visor web de EPUB.
                        
                        URL: ${epubData.url}
                    `,
                    url: epubData.url, // URL que usará el componente WebEpubReader
                    blob: epubData.blob, // Blob que usará el componente WebEpubReader
                    arrayBuffer: epubData.arrayBuffer // ArrayBuffer para opciones alternativas
                });
                
                console.log('EPUB URL para web configurada:', epubData.url);
            } catch (webError) {
                    console.error('Error processing EPUB in web:', webError);
                    throw new Error('Error al procesar EPUB en versión web');
                }
            } else {
                // En móvil, podemos extraer más información del archivo local
                // Extraer la carpeta donde está el epub
                const folderPath = fileUri.substring(0, fileUri.lastIndexOf('/'));
                
                // Intentar leer el archivo metadata.opf para obtener los metadatos
                const metadataPath = `${folderPath}/metadata.opf`;
                let metadataContent = '';
                
                try {
                    metadataContent = await FileSystem.readAsStringAsync(metadataPath);
                } catch (opfError) {
                    console.error('Error reading metadata.opf:', opfError);
                    throw new Error('No se pudo leer el archivo de metadatos');
                }
                
                // Extraer datos básicos del OPF
                const titleMatch = metadataContent.match(/<dc:title[^>]*>(.*?)<\/dc:title>/s);
                const creatorMatch = metadataContent.match(/<dc:creator[^>]*>(.*?)<\/dc:creator>/s);
                const descriptionMatch = metadataContent.match(/<dc:description[^>]*>(.*?)<\/dc:description>/s);
                
                // Para contenido simple, solo mostramos información del libro
                const title = titleMatch ? titleMatch[1] : 'Título desconocido';
                const creator = creatorMatch ? creatorMatch[1] : 'Autor desconocido';
                const description = descriptionMatch ? descriptionMatch[1] : '';
                
                const sampleContent = `
                    Este es un visor EPUB simplificado. 
                    Para esta primera versión, solo mostramos información básica del libro.
                    
                    Título: ${title}
                    Autor: ${creator}
                    
                    ${description ? 'Descripción: ' + description : ''}
                    
                    El archivo está ubicado en: ${fileUri}
                    
                    En próximas versiones implementaremos la lectura completa del contenido.
                `;
                
                setContent({
                    metadata: {
                        title,
                        creator,
                        description,
                    },
                    content: sampleContent,
                    url: fileUri // Para móvil, usamos la ruta del archivo
                });
            }
        } catch (err) {
            console.error('Error parsing EPUB:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar el EPUB');
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    };

    return { content, error, loading, loadEpub };
};

export default useEpubParser;