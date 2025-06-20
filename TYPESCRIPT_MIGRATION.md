# Guía de Migración a TypeScript

Este documento proporciona instrucciones para completar la migración de JavaScript a TypeScript en el proyecto Epub Library App.

## Pasos Completados

1. Se ha añadido TypeScript al proyecto con la configuración básica.
2. Se han creado definiciones de tipos en `src/types/index.ts`.
3. Se han convertido algunos archivos clave a TypeScript.
4. Se ha añadido un archivo de declaraciones en `src/types/declarations.d.ts` para facilitar la transición.

## Pasos Pendientes

### 1. Instalar Dependencias

Primero, instala todas las dependencias necesarias:

```bash
npm install --save-dev typescript @types/react @types/react-native @types/react-dom @types/node @types/epub @babel/core --legacy-peer-deps
```

### 2. Corregir Dependencias en package.json

Asegúrate de que las dependencias en package.json estén correctamente configuradas:

```json
"dependencies": {
  "expo": "~48.0.0",
  "react": "18.0.0",
  "react-dom": "18.0.0",
  "react-native": "0.71.0",
  "@react-navigation/native": "^6.0.0",
  "@react-navigation/stack": "^6.0.0",
  "axios": "^0.27.2",
  "epub": "^0.2.2"
},
"devDependencies": {
  "babel-preset-expo": "~9.2.0",
  "typescript": "^5.0.0",
  "@types/react": "~18.0.0",
  "@types/react-native": "~0.71.0",
  "@types/react-dom": "~18.0.0",
  "@babel/core": "^7.20.0",
  "@types/node": "^20.0.0"
}
```

### 3. Utilizar Script de Migración Automática

Para renombrar automáticamente los archivos JS/JSX a TS/TSX:

```bash
node migratets.js
```

### 4. Actualizar Importaciones

Después de renombrar, debes actualizar las importaciones en los archivos:

- Cambia las extensiones en las importaciones de `.js` a `.ts` y de `.jsx` a `.tsx`.
- Puedes omitir las extensiones en las importaciones con la configuración adecuada en tsconfig.json.

### 5. Añadir Tipos Gradualmente

Para cada archivo TypeScript, añade tipos gradualmente:

1. Añade tipos a los parámetros de funciones y componentes.
2. Define interfaces para props de componentes.
3. Añade tipos de retorno a las funciones.
4. Utiliza tipos genéricos cuando sea apropiado.

### 6. Consejos para la Migración

- **Enfoque Incremental**: Convierte un archivo a la vez, empezando por los más sencillos.
- **Usa any Temporalmente**: Si no tienes claro el tipo, usa `any` temporalmente y refina después.
- **Prueba Regularmente**: Ejecuta `npx tsc --noEmit` para verificar errores de tipo.
- **Usa Extensiones de VS Code**: Instala extensiones como ESLint y TypeScript para mejorar el desarrollo.

## Problemas Comunes y Soluciones

### Error: Cannot find module 'X' or its corresponding type declarations

Solución: Instala los tipos correspondientes o crea declaraciones personalizadas en `declarations.d.ts`.

### Error: Property 'X' does not exist on type 'Y'

Solución: Amplía la interfaz existente o crea una nueva que incluya la propiedad.

### Error: Type 'X' is not assignable to type 'Y'

Solución: Verifica que los tipos sean compatibles o usa type assertions (conversiones de tipo) cuando sea necesario.

## Recursos Adicionales

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
