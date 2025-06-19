import axios from 'axios';
import config from '../constants/config';

const apiClient = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBooks = async () => {
  try {
    const response = await apiClient.get('/books');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await apiClient.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await apiClient.post('/books', bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await apiClient.put(`/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    await apiClient.delete(`/books/${id}`);
  } catch (error) {
    throw error;
  }
};