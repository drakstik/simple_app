# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM nginx:stable-alpine

# Copy the static build from the builder stage to Nginx's serve directory
# Vite typically outputs to the 'dist' folder
COPY --from=builder /app/dist/. /usr/share/nginx/html/

# Copy our custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Ensure cert directory exists (docker-compose will mount into this)
RUN mkdir -p /etc/nginx/certs

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
