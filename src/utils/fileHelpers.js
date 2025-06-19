import * as FileSystem from 'expo-file-system';

export const readFile = async (fileUri) => {
    try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        return content;
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
};

export const writeFile = async (fileUri, content) => {
    try {
        await FileSystem.writeAsStringAsync(fileUri, content);
    } catch (error) {
        console.error("Error writing file:", error);
        throw error;
    }
};

export const deleteFile = async (fileUri) => {
    try {
        await FileSystem.deleteAsync(fileUri);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
    }
};