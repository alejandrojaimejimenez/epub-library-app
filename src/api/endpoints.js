import { API_BASE_URL } from '../constants/config';

export const API_ENDPOINTS = {
  GET_BOOKS: `${API_BASE_URL}/books`,
  GET_BOOK: (id) => `${API_BASE_URL}/books/${id}`,
  ADD_BOOK: `${API_BASE_URL}/books`,
  UPDATE_BOOK: (id) => `${API_BASE_URL}/books/${id}`,
  DELETE_BOOK: (id) => `${API_BASE_URL}/books/${id}`,
};