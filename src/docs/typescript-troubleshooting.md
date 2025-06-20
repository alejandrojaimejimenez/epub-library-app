# Guía para Solucionar Problemas Comunes de TypeScript

Esta guía te ayudará a resolver los problemas más comunes que encontrarás al migrar de JavaScript a TypeScript.

## Problemas con Variables Implícitas

### Problema: "Parameter 'x' implicitly has an 'any' type"

Este error ocurre cuando una función tiene parámetros sin tipo definido.

```typescript
// Incorrecto
function procesarLibro(libro) { }

// Correcto
function procesarLibro(libro: Book) { }
```

### Problema: "Variable 'x' implicitly has type 'any'"

Ocurre cuando declaras una variable sin tipo y sin inicialización.

```typescript
// Incorrecto
let titulo;

// Correcto
let titulo: string;
// o
let titulo = '';
```

## Problemas con Objetos y Propiedades

### Problema: "Property 'x' does not exist on type 'y'"

Sucede cuando intentas acceder a una propiedad que no está definida en el tipo.

```typescript
// Incorrecto
interface User { name: string; }
const user: User = { name: 'John' };
console.log(user.age); // Error

// Correcto
interface User { name: string; age?: number; }
const user: User = { name: 'John' };
console.log(user.age); // OK (undefined)
```

### Problema: "Object is possibly 'undefined'"

Ocurre cuando intentas acceder a propiedades de un objeto que podría ser undefined.

```typescript
// Incorrecto
const book = books.find(b => b.id === '123');
console.log(book.title); // Error

// Correcto
const book = books.find(b => b.id === '123');
console.log(book?.title); // Usando optional chaining
// o
if (book) {
  console.log(book.title);
}
```

## Problemas con Arrays

### Problema: "Object is possibly 'null'"

Ocurre al acceder a métodos de un array que podría ser null.

```typescript
// Incorrecto
const data = getBooks();
data.forEach(book => { }); // Error si data puede ser null

// Correcto
const data = getBooks() || [];
data.forEach(book => { });
```

## Problemas con Promesas y Async/Await

### Problema: "Property 'then' does not exist on type 'void'"

Ocurre cuando intentas usar .then() en una función que no devuelve una promesa.

```typescript
// Incorrecto
function getBook() { } // Sin return
getBook().then(book => {}); // Error

// Correcto
function getBook(): Promise<Book> {
  return fetch('/api/books/1').then(res => res.json());
}
```

## Soluciones Recomendadas

1. **Usa Type Assertions con precaución**:
   ```typescript
   // Sólo cuando estés seguro del tipo
   const user = data as User;
   ```

2. **Utiliza el operador de Optional Chaining (?.)** para propiedades que podrían no existir:
   ```typescript
   console.log(user?.address?.street);
   ```

3. **Utiliza el operador de Nullish Coalescing (??)** para proporcionar valores por defecto:
   ```typescript
   const name = user.name ?? 'Usuario anónimo';
   ```

4. **Usa el Type Guard para verificar tipos**:
   ```typescript
   if ('title' in item) {
     // item tiene la propiedad title
   }
   ```

5. **Define interfaces exhaustivas** para evitar propiedades faltantes:
   ```typescript
   interface Book {
     id: string;
     title: string;
     author: string;
     // otras propiedades
   }
   ```

## Recursos Útiles

- Archivo de ayudantes de tipos: `src/utils/typeHelpers.ts`
- Funciones para manejar errores de API: `src/utils/apiHelpers.ts`
- Documentación oficial de TypeScript: [typescriptlang.org](https://www.typescriptlang.org/docs/)
