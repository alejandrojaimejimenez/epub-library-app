#!/bin/bash

# Script de configuración para la aplicación de biblioteca EPUB

# Colores para la salida
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

echo -e "${YELLOW}=== Configuración del entorno EPUB Library App ===${NC}"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker no está instalado. Por favor, instala Docker primero.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker está instalado.${NC}"

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose no está instalado. Por favor, instala Docker Compose primero.${NC}"
    exit 1
fi

echo -e "${GREEN}Docker Compose está instalado.${NC}"

# Crear la estructura de directorios necesaria
echo -e "${YELLOW}Creando estructura de directorios...${NC}"

# Verificar que exista el directorio de libros
if [ ! -d "books" ]; then
    echo -e "${RED}Error: No se encontró el directorio 'books'. Asegúrate de tener tus libros de Calibre en este directorio.${NC}"
    exit 1
fi

# Verificar que exista el archivo de base de datos
if [ ! -f "db/metadata.db" ]; then
    echo -e "${RED}Error: No se encontró el archivo 'db/metadata.db'. Asegúrate de tener la base de datos de Calibre en este directorio.${NC}"
    exit 1
fi

echo -e "${GREEN}Estructura de directorios verificada.${NC}"

# Iniciar los servicios con Docker Compose
echo -e "${YELLOW}Iniciando servicios con Docker Compose...${NC}"
docker-compose up -d

# Verificar si los servicios están corriendo
if [ $? -eq 0 ]; then
    echo -e "${GREEN}¡Servicios iniciados correctamente!${NC}"
    echo -e "${YELLOW}La aplicación está disponible en:${NC}"
    echo -e "${GREEN}Frontend: http://localhost:19006${NC}"
    echo -e "${GREEN}API: http://localhost:3000/api${NC}"
else
    echo -e "${RED}Error al iniciar los servicios. Revisa los logs con 'docker-compose logs'.${NC}"
    exit 1
fi

echo -e "${YELLOW}=== Configuración completada ===${NC}"
