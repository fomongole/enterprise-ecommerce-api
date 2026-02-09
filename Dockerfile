# ---------------------------------------
# Stage 1: Base (Shared dependencies)
# ---------------------------------------
FROM node:20-alpine AS base

# Install specific system dependencies
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package definitions
COPY package*.json ./

# ---------------------------------------
# Stage 2: Development (Local Dev)
# ---------------------------------------
FROM base AS development

# Install ALL dependencies
RUN npm install

# Note: No 'npx prisma generate' needed anymore!

COPY . .

CMD ["npm", "run", "start:dev"]

# ---------------------------------------
# Stage 3: Builder (Compiles for Prod)
# ---------------------------------------
FROM base AS builder

# Clean install for build stability
RUN npm ci

COPY . .

# Build the NestJS app
RUN npm run build

# ---------------------------------------
# Stage 4: Production (Minimal Image)
# ---------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets and modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]