// Archivo para facilitar la migración a TypeScript
// Guarda este archivo como migratets.js en la raíz del proyecto
// Ejecuta con: node migratets.js

import * as fs from 'fs';
import * as path from 'path';

// Extensiones a procesar
const jsExtensions: string[] = ['.js', '.jsx'];
const tsExtensions: string[] = ['.ts', '.tsx'];

// Directorios a excluir
const excludeDirs: string[] = ['node_modules', '.git', 'build', 'dist'];

interface RenameResult {
  old: string;
  new: string;
}

// Función para recorrer directorios recursivamente
function walkDir(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach((file: string) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !excludeDirs.includes(file)) {
      // Si es un directorio, recorremos recursivamente
      results = results.concat(walkDir(filePath));
    } else {
      // Si es un archivo, verificamos la extensión
      const ext = path.extname(file);
      if (jsExtensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Función para renombrar archivos de JS a TS
function renameFile(filePath: string): RenameResult | null {
  const ext = path.extname(filePath);
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  
  let newExt: string;
  if (ext === '.js') {
    newExt = '.ts';
  } else if (ext === '.jsx') {
    newExt = '.tsx';
  } else {
    return null;
  }
  
  const newPath = path.join(dir, baseName + newExt);
  
  try {
    fs.renameSync(filePath, newPath);
    return { old: filePath, new: newPath };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error renaming ${filePath}: ${errorMessage}`);
    return null;
  }
}

// Función principal
function migrateToTypeScript(rootDir: string): void {
  console.log('Iniciando migración a TypeScript...');
  
  // Encontrar todos los archivos JS/JSX
  const jsFiles = walkDir(rootDir);
  console.log(`Encontrados ${jsFiles.length} archivos JS/JSX para migrar.`);
  
  // Renombrar archivos
  const renamed = jsFiles.map(renameFile).filter((result): result is RenameResult => result !== null);
  
  console.log(`Migración completada. ${renamed.length} archivos renombrados.`);
  renamed.forEach(file => {
    console.log(`  ${file.old} -> ${file.new}`);
  });
}

// Ejecutar la migración desde el directorio raíz del proyecto
migrateToTypeScript(path.resolve('.'));
