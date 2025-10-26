#!/bin/sh
set -e

echo "Rodando migrations do Prisma..."
npx prisma migrate dev

echo "Rodando seed do Prisma..."
npx prisma db seed

echo "Iniciando NestJS..."
node dist/main.js
