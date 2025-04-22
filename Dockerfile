FROM node:23-alpine AS builder

# Instalar openssl para start.sh
RUN apk add --no-cache openssl

# Establecer el directorio de trabajo
WORKDIR /app

#Codigo fuente de la aplicación
COPY ./API .
RUN npm ci

# Complar la aplicación 
RUN npm run build

# Script de inicio para manejar Certbot y la aplicación
COPY ./start.sh .
RUN chmod +x ./start.sh

# Exponer puertos necesarios
EXPOSE 80 443

# Comando de inicio
CMD ["./start.sh"]
