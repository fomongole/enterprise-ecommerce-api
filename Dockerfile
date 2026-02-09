# ---------------------------------------
# Stage 1: Base (Shared dependencies)
# ---------------------------------------
FROM node:20-alpine AS base

# Install specific system dependencies required for some native modules
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package definitions first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma/

# ---------------------------------------
# Stage 2: Development (Local Dev)
# ---------------------------------------
FROM base AS development

# Install ALL dependencies (including devDependencies)
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

COPY . .

# We don't build here; we run via command in docker-compose
CMD ["npm", "run", "start:dev"]

# ---------------------------------------
# Stage 3: Builder (Compiles for Prod)
# ---------------------------------------
FROM base AS builder

RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ---------------------------------------
# Stage 4: Production (Minimal Image)
# ---------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main"]