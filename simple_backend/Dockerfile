# Stage 1: Development/Build
FROM node:20-alpine AS builder
WORKDIR /app
# Copy locks for faster, deterministic installs
COPY package*.json pnpm-lock.yaml* ./
RUN npm install
COPY . .

EXPOSE 5000

# Dev mode (matches your current compose setup)
CMD ["npm", "run", "dev"]
