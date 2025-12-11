# Multi-stage build for efficient image size

# Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --production
COPY backend/ ./

# Final production image
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend /app/backend

# Copy frontend build to be served by backend (optional static serving)
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Expose port
EXPOSE 3001

# Set working directory to backend
WORKDIR /app/backend

# Start the server
CMD ["node", "server.js"]
