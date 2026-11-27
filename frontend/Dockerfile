
# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Update Alpine security packages
RUN apk update && apk upgrade --no-cache

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve using non-root Nginx
FROM nginxinc/nginx-unprivileged:alpine

# Temporarily use root for OS package updates
USER root
RUN apk update && apk upgrade --no-cache

# Copy React production build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

# Run Nginx as non-root user
USER 101

CMD ["nginx", "-g", "daemon off;"]
