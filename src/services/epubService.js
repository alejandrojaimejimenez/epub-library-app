import { parseEpub } from '../utils/fileHelpers';
import { uploadEpub, fetchEpubs } from '../api/endpoints';

export const loadEpub = async (file) => {
    try {
        const content = await parseEpub(file);
        return content;
    } catch (error) {
        throw new Error('Error loading EPUB file: ' + error.message);
    }
};

export const saveEpub = async (file) => {
    try {
        const response = await uploadEpub(file);
        return response.data;
    } catch (error) {
        throw new Error('Error saving EPUB file: ' + error.message);
    }
};

export const getEpubs = async () => {
    try {
        const response = await fetchEpubs();
        return response.data;
    } catch (error) {
        throw new Error('Error fetching EPUBs: ' + error.message);
    }
};