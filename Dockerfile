# FROM node:18-bullseye as bot
# WORKDIR /app
# COPY package*.json ./
# RUN npm i
# COPY . .
# ARG RAILWAY_STATIC_URL
# ARG PUBLIC_URL
# ARG PORT
# CMD ["npm", "start"]
Etapa de construcción
FROM node:21-alpine3.18 AS builder

Establece el directorio de trabajo en la imagen de construcción
WORKDIR /app

Habilita corepack y prepara pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

Copia los archivos de configuración y la carpeta src
COPY package.json ./
COPY src ./src

Instala las dependencias
RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && apk add --no-cache git \
    && pnpm install \
    && apk del .gyp

Etapa de despliegue
FROM node:21-alpine3.18 AS deploy

Establece el directorio de trabajo en la imagen de despliegue
WORKDIR /app

Define el puerto que se expondrá
ARG PORT
ENV PORT=$PORT
EXPOSE $PORT

Copia la carpeta src y los archivos de configuración desde la imagen de construcción
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

Habilita corepack y prepara pnpm para la imagen de despliegue
RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin

Limpia la caché de npm e instala solo las dependencias de producción
RUN npm cache clean --force && pnpm install --production --ignore-scripts \
    && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
    && rm -rf $PNPM_HOME/.npm $PNPM_HOME/.node-gyp

Comando para iniciar la aplicación
CMD ["npm", "start"]