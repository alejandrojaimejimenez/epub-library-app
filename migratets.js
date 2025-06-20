// Archivo para facilitar la migración a TypeScript
// Guarda este archivo como migratots.js en la raíz del proyecto
// Ejecuta con: node migratets.js

const fs = require('fs');
const path = require('path');

// Extensiones a procesar
const jsExtensions = ['.js', '.jsx'];
const tsExtensions = ['.ts', '.tsx'];

// Directorios a excluir
const excludeDirs = ['node_modules', '.git', 'build', 'dist'];

// Función para recorrer directorios recursivamente
function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
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
function renameFile(filePath) {
  const ext = path.extname(filePath);
  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);
  
  let newExt;
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
  } catch (error) {
    console.error(`Error renaming ${filePath}: ${error.message}`);
    return null;
  }
}

// Función principal
function migrateToTypeScript(rootDir) {
  console.log('Iniciando migración a TypeScript...');
  
  // Encontrar todos los archivos JS/JSX
  const jsFiles = walkDir(rootDir);
  console.log(`Encontrados ${jsFiles.length} archivos JS/JSX para migrar.`);
  
  // Renombrar archivos
  const renamed = jsFiles.map(renameFile).filter(Boolean);
  
  console.log(`Migración completada. ${renamed.length} archivos renombrados.`);
  renamed.forEach(file => {
    console.log(`  ${file.old} -> ${file.new}`);
  });
}

// Ejecutar la migración desde el directorio raíz del proyecto
migrateToTypeScript(path.resolve('.'));
