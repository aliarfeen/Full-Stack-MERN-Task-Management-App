# Stage 1 — Build client
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2 — Build server
FROM node:22-alpine AS server-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build:server

# Stage 3 — Production runtime
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=server-build /app/dist ./dist
COPY --from=client-build /app/client/dist ./client/dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
