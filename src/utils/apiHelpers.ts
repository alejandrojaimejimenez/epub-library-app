import { ApiError } from '../types';
import { handleError } from './typeHelpers';

/**
 * Función para manejar errores de la API de manera tipada
 */
export function handleApiError(error: unknown): ApiError {
  // Si ya es un ApiError, lo devolvemos
  if (typeof error === 'object' && error !== null && 'status' in error && 'message' in error) {
    return error as ApiError;
  }

  // Si es un error de Axios o similar con una estructura de respuesta
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as any;
    if (axiosError.response && axiosError.response.data) {
      return {
        status: axiosError.response.status || 500,
        message: axiosError.response.data.message || 'Error en la respuesta del servidor',
        errors: axiosError.response.data.errors
      };
    }
  }

  // Caso por defecto para otros tipos de errores
  const generalError = handleError(error);
  return {
    status: 500,
    message: generalError.message || 'Error desconocido en la comunicación con el servidor'
  };
}

/**
 * Función para extraer los datos de una respuesta, o lanzar un error si hay algún problema
 */
export function extractApiResponse<T>(response: any): T {
  // Si la respuesta tiene la estructura esperada con success y data
  if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
    if (response.success === true) {
      return response.data as T;
    } else {
      throw new Error(response.message || 'Error en la respuesta de la API');
    }
  }
  
  // Formato anterior - Si la respuesta tiene solo data
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data as T;
  }
  
  // Si la respuesta en sí misma es lo que queremos devolver
  if (response !== undefined && response !== null) {
    return response as T;
  }
  
  throw new Error('La respuesta de la API no tiene el formato esperado');
}

/**
 * Función para convertir un error en un mensaje legible para el usuario
 */
export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  return apiError.message;
}
