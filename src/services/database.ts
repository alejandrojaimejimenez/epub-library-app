import { Book } from '../types';
import * as API from '../api/client';

// Obtener libros
export const getBooks = async (callback: (books: Book[]) => void): Promise<void> => {
  try {
    const books = await API.getBooks();
    callback(books);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    callback([]);
  }
};

// Obtener un libro por ID
export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const book = await API.getBookById(id);
    return book || null;
  } catch (error) {
    console.error(`Error al obtener libro con ID ${id}:`, error);
    return null;
  }
};

// Buscar libros por título, autor o etiquetas
export const searchBooks = async (searchTerm: string): Promise<Book[]> => {
  try {
    const books = await API.searchBooks(searchTerm);
    return books;
  } catch (error) {
    console.error('Error al buscar libros:', error);
    return [];
  }
};

// Obtener libros por autor
export const getBooksByAuthor = async (authorName: string): Promise<Book[]> => {
  try {
    const books = await API.getBooksByAuthor(authorName);
    return books;
  } catch (error) {
    console.error(`Error al obtener libros del autor ${authorName}:`, error);
    return [];
  }
};

// Obtener todos los autores
export const getAuthors = async (): Promise<{id: string, name: string}[]> => {
  try {
    const authors = await API.getAuthors();
    return authors;
  } catch (error) {
    console.error('Error al obtener autores:', error);
    return [];
  }
};

// Obtener todos los géneros/etiquetas
export const getTags = async (): Promise<{id: string, name: string}[]> => {
  try {
    const tags = await API.getTags();
    return tags;
  } catch (error) {
    console.error('Error al obtener etiquetas:', error);
    return [];
  }
};

// Obtener libros por etiqueta/género
export const getBooksByTag = async (tagName: string): Promise<Book[]> => {
  try {
    const books = await API.getBooksByTag(tagName);
    return books;
  } catch (error) {
    console.error(`Error al obtener libros con etiqueta ${tagName}:`, error);
    return [];
  }
};

// Actualizar la última posición de lectura de un libro
export const updateLastReadPosition = async (bookId: string, position: number): Promise<void> => {
  try {
    await API.updateReadPosition(bookId, position);
    console.log(`Posición de lectura actualizada para el libro ${bookId}: ${position}`);
  } catch (error) {
    console.error(`Error al actualizar posición de lectura del libro ${bookId}:`, error);
    throw error;
  }
};

// Esta función ya no es necesaria porque no hay conexión directa a la base de datos
export const closeDatabase = (): void => {
  // No hace nada, se mantiene por compatibilidad
};