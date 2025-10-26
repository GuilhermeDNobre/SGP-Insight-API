FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install


COPY tsconfig.json ./

EXPOSE 3000

RUN npm run build
CMD ["sh", "-c", "npx prisma migrate dev && npx prisma db seed && npm run start"]
