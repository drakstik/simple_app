# NOTE: This multi-stage build approach reduces surface attack of containers. By splitting the builder and runtime containers, we are making sure production only has compiled JS (/dist) and production dependencies. No compilter, no source maps and fewer binaries for an attacker to exploit. This achieves a significantly smaller image size by essentially only including executable code and no other development-related dependencies with `COPY --from=builder /app/dist ./dist`

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
# Only install production dependencies (skips typescript, @types, etc)
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 5000
# This command will run when you run the image
CMD ["node", "dist/index.js"]