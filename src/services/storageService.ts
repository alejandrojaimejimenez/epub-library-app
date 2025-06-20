import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const STORAGE_KEY = '@epub_library_books';

interface StorageService {
  saveBooks: (books: Book[]) => Promise<void>;
  getBooks: () => Promise<Book[]>;
  clearBooks: () => Promise<void>;
}

const storageService: StorageService = {
  saveBooks: async (books: Book[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(books);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving books to storage', e);
    }
  },

  getBooks: async (): Promise<Book[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error retrieving books from storage', e);
      return [];
    }
  },

  clearBooks: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing books from storage', e);
    }
  },
};

export default storageService;