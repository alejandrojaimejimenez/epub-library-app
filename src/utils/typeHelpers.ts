/* eslint-disable */
// Este archivo proporciona soluciones para errores comunes de TypeScript en el proyecto

// Función auxiliar para manejar errores de forma tipada
export function handleError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(typeof error === 'string' ? error : 'Se produjo un error desconocido');
}

// Utilidad para asegurar que un valor nunca es undefined
export function assertDefined<T>(value: T | undefined, message = 'Valor requerido pero no definido'): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}

// Utilidad para asegurar que un valor nunca es null
export function assertNotNull<T>(value: T | null, message = 'Valor requerido pero es null'): T {
  if (value === null) {
    throw new Error(message);
  }
  return value;
}

// Tipo utilitario para evitar cualquier propiedad
export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Tipo utilitario para hacer todas las propiedades opcionales profundamente
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

// Función para asegurarse de que un callback siempre recibe el tipo correcto
export function ensureType<T>(value: unknown, defaultValue: T): T {
  return (value as T) || defaultValue;
}

// Type guard útil para comprobar si un objeto tiene una propiedad específica
export function hasProperty<K extends string>(obj: unknown, prop: K): obj is Record<K, unknown> {
  return !!obj && typeof obj === 'object' && prop in obj;
}

// Función para convertir strings a números de forma segura
export function safeParseInt(value: string | undefined | null, defaultValue = 0): number {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// Función para convertir valores a booleanos de forma segura
export function safeParseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return !!value;
}
