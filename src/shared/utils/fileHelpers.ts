import * as FileSystem from 'expo-file-system';
import Epub from 'epubjs';

export const readFile = async (fileUri: string): Promise<string> => {
    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
};

export const writeFile = async (fileUri: string, content: string): Promise<void> => {
    try {
        await FileSystem.writeAsStringAsync(fileUri, content);
    } catch (error) {
        console.error("Error writing file:", error);
        throw error;
    }
};

export const deleteFile = async (fileUri: string): Promise<void> => {
    try {
        await FileSystem.deleteAsync(fileUri);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};

export const parseEpub = async (fileUri: string): Promise<any> => {
    try {
        // Verificamos que el archivo exista
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
            throw new Error(`El archivo no existe: ${fileUri}`);
        }
          // Usamos epubjs para parsear el archivo
        const book = Epub(fileUri);
        await book.ready;
        
        // Extraemos información básica
        const metadata = book.loaded.metadata;
        const navigation = await book.loaded.navigation;
        const toc = navigation.toc;
        
        return {
            metadata,
            toc,
            fileUri
        };
    } catch (error) {
        console.error("Error parsing EPUB:", error);
        throw error;
    }
};
