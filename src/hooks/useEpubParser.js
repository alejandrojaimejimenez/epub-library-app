import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { parseEpub } from 'epub-parser'; // Asegúrate de tener una librería para analizar EPUB

const useEpubParser = () => {
    const [content, setContent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadEpub = async (fileUri) => {
        setLoading(true);
        setError(null);
        try {
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const parsedContent = await parseEpub(fileContent);
            setContent(parsedContent);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { content, error, loading, loadEpub };
};

export default useEpubParser;