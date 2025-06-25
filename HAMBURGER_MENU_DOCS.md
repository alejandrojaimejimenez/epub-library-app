# Hamburger Menu y Menú Lateral - Documentación

Este documento explica cómo usar el hamburger menu y el menú lateral implementados en el proyecto.

## Componentes Creados

### 1. HamburgerIcon (Atom)

Componente básico que muestra el icono de hamburger menu (tres líneas horizontales).

**Ubicación:** `src/presentation/components/atoms/HamburgerIcon/`

**Props:**
- `onPress: () => void` - Función a ejecutar cuando se presiona el icono
- `color?: string` - Color del icono (opcional)
- `size?: number` - Tamaño del icono en píxeles (default: 24)
- `disabled?: boolean` - Si el icono está deshabilitado (default: false)
- `testID?: string` - ID para pruebas (default: "hamburger-icon")

**Ejemplo de uso:**
```tsx
import { HamburgerIcon } from '@components/atoms';

<HamburgerIcon
  onPress={() => setMenuVisible(true)}
  color="white"
  size={28}
/>
```

### 2. SideMenu (Molecule)

Componente de menú lateral deslizable con animación de entrada/salida.

**Ubicación:** `src/presentation/components/molecules/SideMenu/`

**Props:**
- `isVisible: boolean` - Si el menú está visible
- `onClose: () => void` - Función para cerrar el menú
- `onBackdropPress?: () => void` - Función al presionar fuera del menú
- `width?: string | number` - Ancho del menú (default: '75%')
- `position?: 'left' | 'right'` - Posición del menú (default: 'left')
- `testID?: string` - ID para pruebas

**Características:**
- Animación suave de entrada/salida
- Soporte para backdrop (fondo semi-transparente)
- Manejo del botón atrás en Android
- Lista de elementos de menú configurables
- Diseño responsive

**Ejemplo de uso:**
```tsx
import { SideMenu } from '@components/molecules';
import { useSideMenu } from '@hooks/useSideMenu';

const MyComponent = () => {
  const { isVisible, openMenu, closeMenu } = useSideMenu();
  
  return (
    <SideMenu
      isVisible={isVisible}
      onClose={closeMenu}
      width="80%"
      position="left"
    />
  );
};
```

### 3. ScreenWithSideMenu (Template)

Template completo que combina Header con hamburger menu y SideMenu.

**Ubicación:** `src/presentation/components/templates/ScreenWithSideMenu/`

**Props:**
- `title: string` - Título del header
- `children: ReactNode` - Contenido principal de la pantalla
- `rightComponent?: ReactNode` - Componente opcional en la derecha del header
- `showBackButton?: boolean` - Mostrar botón de retroceso en lugar del hamburger
- `onBackPress?: () => void` - Función del botón de retroceso
- `menuWidth?: string | number` - Ancho del menú lateral (default: '75%')
- `menuPosition?: 'left' | 'right'` - Posición del menú (default: 'left')
- `testID?: string` - ID para pruebas

**Ejemplo de uso:**
```tsx
import { ScreenWithSideMenu } from '@components/templates';

const MyScreen = () => {
  return (
    <ScreenWithSideMenu 
      title="Mi Pantalla"
      rightComponent={<MyButton />}
    >
      <View>
        {/* Contenido de la pantalla */}
      </View>
    </ScreenWithSideMenu>
  );
};
```

### 4. useSideMenu Hook

Hook personalizado para manejar el estado del menú lateral.

**Ubicación:** `src/shared/hooks/useSideMenu.ts`

**Retorna:**
- `isVisible: boolean` - Estado actual del menú
- `openMenu: () => void` - Función para abrir el menú
- `closeMenu: () => void` - Función para cerrar el menú
- `toggleMenu: () => void` - Función para alternar el menú
- `setIsVisible: (visible: boolean) => void` - Función para establecer el estado directamente

**Ejemplo de uso:**
```tsx
import { useSideMenu } from '@hooks/useSideMenu';

const MyComponent = () => {
  const { isVisible, openMenu, closeMenu, toggleMenu } = useSideMenu();
  
  return (
    <TouchableOpacity onPress={toggleMenu}>
      <Text>Toggle Menu</Text>
    </TouchableOpacity>
  );
};
```

## Actualización del Header

El componente `Header` ahora soporta mostrar el hamburger menu:

**Nuevas props:**
- `showHamburgerMenu?: boolean` - Mostrar el icono hamburger (default: false)
- `onHamburgerPress?: () => void` - Función al presionar el hamburger

**Prioridad de componentes en la parte izquierda:**
1. `leftComponent` (si se proporciona)
2. `showBackButton` (si es true)
3. `showHamburgerMenu` (si es true)

## Implementación en Pantallas Existentes

### ✅ Pantallas Actualizadas

Las siguientes pantallas han sido actualizadas para usar el nuevo template `ScreenWithSideMenu`:

#### 🏠 **HomeScreen**
- **Cambio:** Reemplazado `Header` + `View` container por `ScreenWithSideMenu`
- **Funcionalidad:** Hamburger menu en la izquierda, botón "Ver todo" en la derecha
- **Navegación:** El botón de logout ahora está disponible en el menú lateral

```tsx
// Implementación actual
import { ScreenWithSideMenu } from '@components/templates';

return (
  <ScreenWithSideMenu
    title="Mi Biblioteca"
    rightComponent={
      <TouchableOpacity onPress={navigateToLibrary}>
        <Text style={styles.viewAllText}>Ver todo</Text>
      </TouchableOpacity>
    }
  >
    <ScrollView style={styles.scrollView}>
      {/* Contenido de la pantalla */}
    </ScrollView>
  </ScreenWithSideMenu>
);
```

#### 📚 **LibraryScreen**
- **Cambio:** Ya estaba actualizada con `ScreenWithSideMenu`
- **Funcionalidad:** Hamburger menu con filtros y ViewToggle en la derecha
- **Estado:** ✅ Completa y funcional

#### 📖 **BookDetailScreen**  
- **Cambio:** Ahora usa `ScreenWithSideMenu` con hamburger menu
- **Funcionalidad:** Hamburger menu a la derecha para acceso al menú lateral
- **Comportamiento:** Consistente con Home y Library screens

```tsx
// Implementación actual
return (
  <ScreenWithSideMenu
    title={book.title}
  >
    <ScrollView style={styles.scrollView}>
      {/* Contenido del libro */}
    </ScrollView>
  </ScreenWithSideMenu>
);
```

### 🔧 **Mejoras del SideMenu**

El componente `SideMenu` ha sido mejorado con:

1. **LogoutButton integrado** - Ahora incluye un botón de logout en el footer del menú
2. **Diseño mejorado** - Footer separado visualmente con borde superior
3. **Accesibilidad** - Mejor soporte para navegación por teclado y lectores de pantalla

#### Estructura del Menú:
```text
┌─────────────────────┐
│ ✕                   │ <- Botón cerrar
│                     │
│ Navegación          │ <- Header
│ Biblioteca EPUB     │
│ ________________    │
│                     │
│ 📚 Biblioteca       │ <- Elementos de menú
│ 📖 Lector          │
│ ⚙️  Configuración   │
│                     │
│ ________________    │
│                     │
│ 🚪 Cerrar Sesión    │ <- Footer con logout
└─────────────────────┘
```

## Personalización del Menú Lateral

### Elementos de Menú

Los elementos del menú están definidos en el componente `SideMenu`. Para personalizarlos en el futuro:

1. **Elementos dinámicos:** Pasar los elementos como props
2. **Navegación:** Integrar con React Navigation
3. **Iconos:** Usar una librería de iconos como react-native-vector-icons
4. **Configuración:** Permitir configuración por usuario

### Estructura actual de elementos:

```typescript
const menuItems: ISideMenuItem[] = [
  {
    id: 'library',
    label: 'Biblioteca',
    onPress: () => {
      onClose();
      // TODO: Navegación a biblioteca
    },
    active: false,
  },
  {
    id: 'reader',
    label: 'Lector',
    onPress: () => {
      onClose();
      // TODO: Navegación a lector
    },
    disabled: true,
  },
  {
    id: 'settings',
    label: 'Configuración',
    onPress: () => {
      onClose();
      // TODO: Navegación a configuración
    },
  },
];
```

## Próximos Pasos

1. **Integrar navegación:** Conectar los elementos del menú con React Navigation
2. **Agregar iconos:** Implementar iconos para cada elemento del menú
3. **Configuración dinámica:** Permitir configurar los elementos del menú desde las pantallas
4. **Más pantallas:** Aplicar el template a otras pantallas del proyecto
5. **Temas:** Asegurar que el menú respete el sistema de temas
6. **Accesibilidad:** Mejorar el soporte de accesibilidad
7. **Persistencia:** Recordar el estado del menú entre sesiones

## Arquitectura

La implementación sigue los principios de Clean Architecture:

- **Atoms:** Componentes básicos reutilizables (`HamburgerIcon`)
- **Molecules:** Componentes funcionales que combinan atoms (`SideMenu`)
- **Templates:** Estructuras de página completas (`ScreenWithSideMenu`)
- **Hooks:** Lógica de estado reutilizable (`useSideMenu`)

Esto permite:
- **Reutilización:** Los componentes pueden usarse en diferentes contextos
- **Mantenimiento:** Cambios centralizados afectan a toda la aplicación
- **Escalabilidad:** Fácil agregar nuevas funcionalidades
- **Testing:** Componentes aislados son más fáciles de probar

## 🔄 **Cambios de Posición - Hamburger Menu a la Derecha**

### ✅ **Nueva Configuración**

El hamburger menu ahora aparece **a la derecha del header** y el menú lateral se despliega **desde la derecha de la pantalla**.

#### 🎯 **Comportamiento del Header:**

1. **Sin hamburger menu:** 
   - `rightComponent` ocupa toda la zona derecha

2. **Con hamburger menu:**
   - `rightComponent` + `HamburgerIcon` se muestran juntos en la derecha
   - Separación automática con `marginLeft` cuando ambos están presentes

```tsx
// Ejemplo con rightComponent + hamburger
<ScreenWithSideMenu
  title="Mi Pantalla"
  rightComponent={<MyButton />}  // Se muestra a la izquierda del hamburger
>
  {/* Contenido */}
</ScreenWithSideMenu>
```

#### 🎨 **Disposición Visual:**
```text
┌─────────────────────────────────────────┐
│ ← Título de la Pantalla    [Btn] [☰]    │ <- Header
└─────────────────────────────────────────┘
│                                    ┌────┐
│ Contenido principal               │📚  │ <- Menú lateral
│                                    │📖  │    desde la derecha
│                                    │⚙️   │
│                                    │    │
│                                    │🚪  │
│                                    └────┘
```

#### 🔧 **Cambios Técnicos Realizados:**

1. **Header Component:**
   - Nueva función `renderRightComponent()` 
   - Estilo `rightComponentWithMenu` para layout horizontal
   - Hamburger menu movido de izquierda a derecha

2. **ScreenWithSideMenu Template:**
   - `position="right"` por defecto
   - `menuPosition` actualizado a `'right'`

3. **SideMenu Component:**
   - `position='right'` como valor por defecto
   - Animación adaptada para deslizamiento desde la derecha

### 🎯 **Ventajas de la Nueva Posición:**

- **Coherencia con estándares:** Muchas apps móviles usan hamburger menu a la derecha
- **Mejor ergonomía:** Más accesible para usuarios diestros en móviles
- **Espacio optimizado:** Permite mantener botones importantes en el header
- **Flujo natural:** El menú se despliega desde donde está el icono

### 🎯 **Menú Lateral Simplificado**

El menú lateral ahora tiene un diseño minimalista centrado solo en la función de logout:

#### 📍 **Estructura del Menú:**
```text
┌─────────────────────┐
│ ✕                   │ <- Botón cerrar
│                     │
│ Navegación          │ <- Header
│ Biblioteca EPUB     │
│ ________________    │
│                     │
│                     │ <- Área vacía (sin elementos)
│                     │    de navegación
│                     │
│ ________________    │
│                     │
│ 🚪 Cerrar Sesión    │ <- Footer con logout únicamente
└─────────────────────┘
```

#### 🔗 **Funcionalidad del Menú:**

**🚪 Cerrar Sesión** - Función principal del menú
- Usa `useAuth().logout()` para cerrar sesión
- Navegación automática gestionada por `AuthContext`
- Estilo diferenciado (texto en color error)
- Icono de puerta para mejor UX

#### 🎨 **Diseño Minimalista:**
- **Header informativo** con título y subtítulo
- **Área central limpia** sin elementos de navegación
- **Footer destacado** con la acción principal (logout)
- **Colores temáticos** respetando el sistema de diseño

#### 🔧 **Implementación Técnica:**
```tsx
// Sin elementos de navegación en el menú
const menuItems: ISideMenuItem[] = [];

// Función de logout como única funcionalidad
const handleLogout = async () => {
  try {
    onClose();
    await logout();
    // La navegación al login se manejará automáticamente por el AuthContext
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
```

#### ✨ **Ventajas del Diseño Simplificado:**
- **Enfoque claro** en la funcionalidad principal (logout)
- **Menos distracciones** para el usuario
- **Navegación más directa** usando el header de cada pantalla
- **Interfaz más limpia** y fácil de entender
- **Mantenimiento simplificado** con menos código
