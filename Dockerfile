# Etapa 1: build
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Gera o Prisma Client para ambiente Linux-Alpine
RUN npx prisma generate

# Gera build do NestJS
RUN npm run build

# Etapa 2: execução
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production

CMD [ "sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js" ]
