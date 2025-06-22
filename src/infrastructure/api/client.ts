import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../../domain/models/Api';
import { handleApiError, extractApiResponse } from '../../shared/utils/apiHelpers';
import { API_ENDPOINTS } from './endpoints';
import config, { API_BASE_URL } from '../../shared/constants/config';
import { getAuthToken } from '../../shared/utils/authStorage';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: config.timeout,
});

// Interceptor para añadir el token de autenticación a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class ApiClient {  static async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      console.log(`🌐 GET: ${url}`, params ? `Params: ${JSON.stringify(params)}` : '');
      const response = await apiClient.get<ApiResponse<T> | T>(url, { params });
      console.log(`✅ GET response: ${url}`, response.status);
      return extractApiResponse<T>(response.data);
    } catch (error) {
      console.error(`❌ GET error: ${url}`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
      }
      throw handleApiError(error);
    }
  }

  static async post<T>(url: string, data: any): Promise<T> {
    try {
      console.log(`🌐 POST: ${url}`, data ? `Data: ${JSON.stringify(data)}` : '');
      const response = await apiClient.post<ApiResponse<T> | T>(url, data);
      console.log(`✅ POST response: ${url}`, response.status);
      return extractApiResponse<T>(response.data);
    } catch (error) {
      console.error(`❌ POST error: ${url}`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(`Status: ${error.response.status}`, error.response.data);
      }
      throw handleApiError(error);
    }
  }
  static async put<T>(url: string, data: any): Promise<T> {
    try {
      const response = await apiClient.put<ApiResponse<T> | T>(url, data);
      return extractApiResponse<T>(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  static async delete<T>(url: string): Promise<T | void> {
    try {
      const response = await apiClient.delete<ApiResponse<T> | T>(url);
      return extractApiResponse<T>(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export { API_ENDPOINTS };
