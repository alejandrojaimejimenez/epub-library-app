# Epub Library App

Epub Library App es una aplicación móvil y web desarrollada con React Native, TypeScript y Expo para gestionar una biblioteca de archivos EPUB integrada con Calibre. Permite a los usuarios visualizar y leer sus libros directamente desde la base de datos de Calibre.

## Características

- **Integración con Calibre**: Lee directamente la base de datos SQLite de Calibre (metadata.db).
- **Gestión de Libros**: Visualiza y organiza tus libros con la misma estructura que usa Calibre.
- **Lectura de EPUB**: Lee libros directamente en la aplicación con un lector integrado.
- **Búsqueda y Filtrado**: Busca libros por título, autor o etiquetas.
- **Arquitectura Cliente-Servidor**: Backend Node.js para acceso a SQLite y archivos, frontend React Native para la interfaz.
- **Versión Web y Móvil**: Funciona tanto en navegadores como en dispositivos móviles.
- **Dockerización**: Despliegue sencillo con Docker y Docker Compose.

## Estructura del Proyecto

El proyecto está organizado en varias carpetas y archivos, cada uno con una función específica:

- **src/api**: Configuración del cliente API y definición de endpoints.
- **src/components**: Componentes reutilizables de la interfaz de usuario.
- **src/constants**: Constantes utilizadas en la aplicación, como colores y configuraciones.
- **src/context**: Contexto para manejar el estado de la biblioteca.
- **src/hooks**: Hooks personalizados para manejar la lógica de libros y análisis de EPUB.
- **src/navigation**: Configuración de la navegación de la aplicación.
- **src/screens**: Pantallas principales de la aplicación.
- **src/services**: Servicios para manejar la conexión con la API del backend.
- **src/utils**: Funciones auxiliares para manejar archivos y formatear datos.

## Arquitectura

La aplicación utiliza una arquitectura cliente-servidor:

1. **Backend** (proyecto separado: epub-library-api)
   - Accede directamente a la base de datos SQLite de Calibre
   - Expone una API REST para obtener libros, autores, etc.
   - Sirve archivos EPUB y portadas

2. **Frontend** (este proyecto)
   - Consume la API del backend
   - Proporciona interfaz de usuario para navegación y lectura
   - Funciona en web y móvil

## Requisitos

- Node.js 16+
- Docker y Docker Compose (para despliegue)
- Estructura de biblioteca de Calibre:
  - Directorio `/books` con los archivos EPUB
  - Archivo `/db/metadata.db` con la base de datos de Calibre

## Configuración

### Desarrollo

1. Clona este repositorio
2. Instala las dependencias:
   ```
   npm install
   ```
3. Clona y configura el backend (ver proyecto epub-library-api)
4. Ejecuta la aplicación en modo desarrollo:
   ```
   npm start
   ```

### Producción con Docker

1. Asegúrate de tener tu directorio de libros de Calibre en la carpeta `/books`
2. Asegúrate de tener tu base de datos de Calibre en `/db/metadata.db`
3. Construye e inicia los contenedores:
   ```
   npm run docker:build
   npm run docker:up
   ```
4. La aplicación estará disponible en:
   - Frontend: http://localhost:19006
   - API: http://localhost:3000/api

## Comandos disponibles

- `npm start`: Inicia el servidor de desarrollo de Expo
- `npm run web`: Inicia la aplicación en modo web
- `npm run android`: Inicia la aplicación en Android
- `npm run ios`: Inicia la aplicación en iOS
- `npm run type-check`: Verifica los tipos de TypeScript
- `npm run docker:build`: Construye los contenedores Docker
- `npm run docker:up`: Inicia los servicios con Docker Compose
- `npm run docker:down`: Detiene los servicios
- `npm run docker:logs`: Muestra los logs de los contenedores

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.