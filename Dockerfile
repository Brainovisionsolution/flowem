# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production Server Environment
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install openssl for Prisma Client on Alpine Linux
RUN apk add --no-cache openssl

# Install server production dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy server application code and schema
COPY server/ ./

# Generate Prisma Client for MySQL
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy built frontend assets to public directory
COPY --from=frontend-builder /build/dist ./public

EXPOSE 5000

CMD ["node", "src/server.js"]
