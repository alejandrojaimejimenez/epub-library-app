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

## Arquitectura del Proyecto

Este proyecto sigue una arquitectura de estilo Clean Architecture con la estructura en capas. Es una aplicación nativa multiplataforma compatible con Android, iOS y Web. El proyecto utiliza TypeScript para garantizar la seguridad de tipos.

### Estructura de carpetas en src:

#### 1. **`application/`** 
Esta carpeta contiene la lógica de aplicación y casos de uso.
   - **`services/`**: Servicios que implementan la lógica de negocio de la aplicación.
     - `books.ts`: Servicios relacionados con libros.
     - `epub.ts`: Servicios para manejo de archivos EPUB.
   - **`usecases/`**: Implementa los casos de uso específicos de la aplicación.
     - `book-usecases.ts`: Casos de uso para operaciones con libros.
     - `epub-usecases.ts`: Casos de uso para operaciones con EPUBs.

#### 2. **`domain/`** 
Contiene la lógica de negocio y las entidades principales independientes de cualquier framework.
   - **`interfaces/`**: Definiciones de interfaces que describen los contratos del dominio.
   - **`models/`**: Modelos de datos que representan las entidades del dominio.
     - `Book.ts`: Definición de libros, autores y etiquetas.
     - `Api.ts`: Definición de respuestas y errores de API.
   - **`repositories/`**: Interfaces para repositorios de datos.
     - `IBookRepository.ts`: Interfaz para el repositorio de libros.
     - `IEpubRepository.ts`: Interfaz para el repositorio de EPUBs.

#### 3. **`infrastructure/`** 
Contiene implementaciones técnicas y comunicación con servicios externos.
   - **`api/`**: Implementaciones de clientes API.
     - `client.ts`: Cliente de API general.
     - `endpoints.ts`: Definición de endpoints de la API.
   - **`core/`**: Componentes centrales como clases base y loggers.
   - **`data/`**: Capa de acceso a datos.
     - `BookRepository.ts`: Implementación del repositorio de libros.
     - `EpubRepository.ts`: Implementación del repositorio de EPUBs.
   - **`storage/`**: Almacenamiento local persistente.

#### 4. **`presentation/`** 
Contiene todos los componentes relacionados con la interfaz de usuario.
   - **`components/`**: Componentes reutilizables de UI.
     - `BookCard.tsx`: Tarjeta para mostrar información de un libro.
     - `BookList.tsx`: Lista de libros.
     - `EpubReader.tsx`: Componente para leer EPUBs.
     - `common/`: Componentes básicos reutilizables.
   - **`navigation/`**: Configuración de rutas y navegación.
     - `AppNavigator.tsx`: Navegador principal de la aplicación.
   - **`screens/`**: Pantallas principales de la aplicación.
     - `HomeScreen.tsx`: Pantalla principal.
     - `LibraryScreen.tsx`: Pantalla de biblioteca.
     - `BookDetailScreen.tsx`: Pantalla de detalle de libro.
     - `ReaderScreen.tsx`: Pantalla de lector de EPUB.
   - **`theme/`**: Definición de estilos, temas y configuración visual.
     - `colors.ts`: Paleta de colores de la aplicación.

#### 5. **`shared/`** 
Contiene utilidades y código compartido entre capas.
   - **`constants/`**: Constantes utilizadas en toda la aplicación.
   - **`context/`**: Contextos de React para el estado global.
     - `LibraryContext.tsx`: Contexto para gestionar la biblioteca de libros.
   - **`hooks/`**: Hooks personalizados de React.
     - `useBooks.ts`: Hook para operaciones con libros.
     - `useEpubParser.ts`: Hook para manejo de archivos EPUB.
   - **`types/`**: Definiciones de tipos TypeScript.
   - **`utils/`**: Funciones de utilidad genéricas.
     - `apiHelpers.ts`: Utilidades para manejar respuestas y errores de API.

## Arquitectura General

La aplicación utiliza una arquitectura cliente-servidor:

1. **Backend** (proyecto separado: epub-library-api)
   - Accede directamente a la base de datos SQLite de Calibre
   - Expone una API REST para obtener libros, autores, etc.
   - Sirve archivos EPUB y portadas

2. **Frontend** (este proyecto)
   - Consume la API del backend
   - Proporciona interfaz de usuario para navegación y lectura
   - Funciona en web y móvil con estructura Clean Architecture

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