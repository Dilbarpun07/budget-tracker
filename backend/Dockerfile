FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install

# Copy source and migrations
COPY tsconfig.json ./
COPY src/ ./src/
COPY migrations/ ./migrations/

# Compile TypeScript to JavaScript
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
