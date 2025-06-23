import { ApiResponse, ApiError } from '@models/Api';

/**
 * Extrae los datos de una respuesta de API
 */
export function extractApiResponse<T>(response: ApiResponse<T> | T): T {
  // Si la respuesta ya es del tipo T o no tiene la propiedad 'success' 
  // (como en el caso de autenticación), devolvemos directamente
  if (!response || typeof response !== 'object' || !('success' in response)) {
    return response as T;
  }
  
  // Si es una respuesta ApiResponse estándar
  const apiResponse = response as ApiResponse<T>;
  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'Error en la respuesta de la API');
  }
  return apiResponse.data;
}

/**
 * Maneja errores de la API y los convierte en errores más amigables
 */
export function handleApiError(error: any): Error {
  console.error('API Error:', error);
  
  if (error.response) {
    // Error de respuesta del servidor
    const status = error.response.status;
    const message = error.response.data?.message || `Error ${status}`;
    
    // Crear un error más descriptivo según el código de estado
    switch (status) {
      case 400:
        return new Error(`Solicitud incorrecta: ${message}`);
      case 401:
        return new Error('No autorizado: Por favor inicie sesión');
      case 403:
        return new Error('Acceso prohibido: No tiene permisos para esta acción');
      case 404:
        return new Error('Recurso no encontrado');
      case 500:
        return new Error('Error interno del servidor');
      default:
        return new Error(`Error en la solicitud: ${message}`);
    }
  } else if (error.request) {
    // Error de red (sin respuesta)
    return new Error('No se pudo conectar con el servidor. Verifique su conexión a Internet.');
  } else {
    // Error desconocido
    return new Error(error.message || 'Error desconocido');
  }
}
