import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@epub_library_books';

const storageService = {
  saveBooks: async (books) => {
    try {
      const jsonValue = JSON.stringify(books);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving books to storage', e);
    }
  },

  getBooks: async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error retrieving books from storage', e);
      return [];
    }
  },

  clearBooks: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Error clearing books from storage', e);
    }
  },
};

export default storageService;