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
   - **`mqtt/`**: Comunicación en tiempo real.
     - **`Listeners/`**: Escuchadores de eventos MQTT.
   - **`notifications/`**: Gestión de notificaciones push.
   - **`storage/`**: Almacenamiento local persistente.

#### 4. **`presentation/`** 
Contiene toda la capa de presentación y componentes de UI.
   - **`components/`**: Componentes React organizados según Atomic Design.
     - **`atoms/`**: Componentes básicos e indivisibles.
       - `Button`: Botón reutilizable con varios estilos.
       - `Loading`: Indicador de carga.
       - `LoadingIndicator`: Indicador de carga simple.
       - `DebugInfo`: Panel de depuración para desarrollo.
     - **`molecules/`**: Componentes que combinan átomos.
       - `BookCard`: Tarjeta que muestra información de un libro.
       - `Header`: Encabezado de la aplicación.
       - `LogoutButton`: Botón para cerrar sesión.
     - **`organisms/`**: Componentes más complejos que combinan moléculas.
       - `BookList`: Lista de libros con funcionalidad completa.     - **`features/`**: Características completas de la aplicación.
       - `EpubReader/`: Característica completa del lector EPUB.
         - `components/`: Componentes específicos del lector.
           - `EpubReader.tsx`: Componente principal que selecciona el lector adecuado.
           - `EpubReaderDevices.tsx`: Implementación para dispositivos móviles.
           - `EpubReaderWeb/`: Implementación para entorno web.
             - `EpubReaderWeb.tsx`: Componente principal.
             - `EpubReaderWebContainer.tsx`: Lógica del componente.
             - `EpubReaderWebView.tsx`: Vista del componente.
             - `styles.ts`: Estilos.
             - `types.ts`: Tipos e interfaces.
         - `hooks/`: Hooks personalizados para el lector.
           - `useEpubReader.ts`: Hook principal para gestionar el lector.
           - `useBookReader.ts`: Hook para gestionar libros.
   - **`navigation/`**: Configuración y componentes de navegación.
   - **`screens/`**: Pantallas principales de la aplicación.
   - **`theme/`**: Definición del tema visual (colores, tipografía, espaciado).

### Guía de Desarrollo de Componentes

#### Estructura de un Componente

Cada componente debería seguir esta estructura de carpetas:

```
ComponentName/
  - ComponentName.tsx       # Implementación del componente
  - index.tsx               # Archivo de exportación
  - ComponentName.test.tsx  # Pruebas (opcional)
  - styles.ts               # Estilos (opcional)
  - types.ts                # Tipos e interfaces (opcional)
```

#### Reglas para el Desarrollo de Componentes

1. **Separación de Responsabilidades**:
   - Los componentes deben tener una única responsabilidad.
   - Componentes con más de 150 líneas deberían subdividirse.

2. **Tipado Estricto**:
   - Todas las props deben estar correctamente tipadas.
   - Evitar el uso de `any`.

3. **Uso del Theme**:
   - Usar `useTheme()` para acceder a colores, espaciado y tipografía.
   - Evitar valores hardcodeados.

4. **Patrones de Importación**:
   - Usar imports con alias para mejorar la legibilidad.
   - Ejemplo: `import { Button } from '@components/atoms';`

5. **Componentes Reutilizables**:
   - Los componentes básicos deben ser altamente reutilizables.
   - Utilizar props para personalizar apariencia y comportamiento.

6. **Dependencias entre Capas**:
   - Átomos: No pueden depender de otros componentes.
   - Moléculas: Pueden usar átomos, pero no organismos ni features.
   - Organismos: Pueden usar átomos y moléculas.
   - Features: Pueden usar cualquier componente.

7. **Pruebas**:
   - Componentes críticos deben tener pruebas unitarias.
   - Enfocarse en probar comportamiento, no implementación.

## Guías de Implementación

### Dirección de Dependencias
Las dependencias siempre deben apuntar hacia el centro (desde infraestructura hacia dominio), nunca al revés.

### Importaciones Permitidas
- **Dominio**: Solo puede importar de domain y shared.
- **Aplicación**: Puede importar de domain, application y shared.
- **Infraestructura**: Puede importar de domain, application, infrastructure y shared.
- **Presentación**: Puede importar de cualquier capa.
- **Shared**: Solo debe importar dentro de shared.

### Convenciones de Nombrado
- **Servicios**: Prefijo S (ej: SBookService)
- **Modelos**: Prefijo M (ej: MBook)
- **Interfaces**: Prefijo I (ej: IBookRepository)
- **Componentes React**: PascalCase sin prefijo
- **Constantes**: UPPER_CASE

### Diseño de Componentes
- Usar el patrón Container/Presentational para componentes complejos
- Seguir el principio de responsabilidad única
- Utilizar el sistema de temas para estilos consistentes
- Mantener componentes por debajo de 200 líneas

### Estilos
- Utilizar `useTheme()` para acceder a variables de tema
- Evitar valores hardcodeados de colores, espaciados, etc.
- Definir estilos en archivos separados

### Estado
- Estado local simple: `useState`
- Estado complejo: `useReducer`
- Estado global: Contextos en `@context`

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

## Migración Completada

Se ha completado la migración de los componentes a la nueva estructura de Atomic Design. Los cambios principales son:

1. **Estructura de Carpetas**:
   - `atoms/`: Componentes básicos (Button, Loading, DebugInfo...)
   - `molecules/`: Componentes compuestos (BookCard, Header, LogoutButton...)
   - `organisms/`: Componentes complejos (BookList...)
   - `features/`: Características completas (EpubReader...)

2. **EpubReader Feature**:
   - Ahora sigue un patrón bien organizado:
     - `EpubReader/`
       - `components/`: Componentes específicos
         - `EpubReader.tsx`: Componente principal
         - `EpubReaderDevices.tsx`: Implementación para dispositivos móviles
         - `EpubReaderWeb/`: Implementación para web
           - `EpubReaderWeb.tsx`: Componente principal
           - `EpubReaderWebContainer.tsx`: Lógica
           - `EpubReaderWebView.tsx`: Presentación
           - `styles.ts`: Estilos
           - `types.ts`: Interfaces y tipos
       - `hooks/`: Hooks personalizados
         - `useEpubReader.ts`: Lógica de carga y manejo del libro

3. **Mejoras**:
   - Uso consistente de `useTheme()` para acceder a colores, espaciado y tipografía
   - Mejor separación de responsabilidades
   - Props tipadas correctamente
   - Patrón Container/Presentational aplicado donde corresponde