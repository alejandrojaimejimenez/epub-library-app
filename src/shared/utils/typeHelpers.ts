// Estos son tipos auxiliares para trabajar con TypeScript en el proyecto

/**
 * Hace que todas las propiedades de un tipo sean opcionales en profundidad
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends Array<infer U>
      ? Array<DeepPartial<U>>
      : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
};

/**
 * Convierte un tipo a sólo lectura en profundidad
 */
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends Array<infer U>
      ? ReadonlyArray<DeepReadonly<U>>
      : T[P] extends object
      ? DeepReadonly<T[P]>
      : T[P]
};

/**
 * Extrae las claves de un tipo que tienen un tipo específico
 */
export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T];

/**
 * Excluye las propiedades null o undefined de un tipo
 */
export type NonNullableProperties<T> = {
    [P in keyof T]: NonNullable<T[P]>
};

/**
 * Obtiene el tipo de un elemento de un array
 */
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
