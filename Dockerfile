FROM node:18-alpine

WORKDIR /app

# Instalar dependencias para construir la aplicación
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer puerto web
EXPOSE 19006

# Comando para iniciar la aplicación
CMD ["npm", "run", "web"]
