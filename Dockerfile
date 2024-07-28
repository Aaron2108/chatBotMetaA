# FROM node:18-bullseye as bot
# WORKDIR /app
# COPY package*.json ./
# RUN npm i
# COPY . .
# ARG RAILWAY_STATIC_URL
# ARG PUBLIC_URL
# ARG PORT
# CMD ["npm", "start"]

FROM node:21-alpine3.18 AS builder


WORKDIR /app


RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin


COPY package.json ./
COPY src ./src


RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && apk add --no-cache git \
    && pnpm install \
    && apk del .gyp


FROM node:21-alpine3.18 AS deploy


WORKDIR /app


ARG PORT
ENV PORT=$PORT
EXPOSE $PORT


COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./


RUN corepack enable && corepack prepare pnpm@latest --activate
ENV PNPM_HOME=/usr/local/bin


RUN npm cache clean --force && pnpm install --production --ignore-scripts \
    && addgroup -g 1001 -S nodejs && adduser -S -u 1001 nodejs \
    && rm -rf $PNPM_HOME/.npm $PNPM_HOME/.node-gyp

CMD ["npm", "start"]