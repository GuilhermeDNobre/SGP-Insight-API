FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Use env vars from docker-compose
EXPOSE 3000
CMD ["npm", "run", "start"]
