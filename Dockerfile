# Stage 1: Build an Angular Docker Image
FROM node:latest AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:latest
COPY --from=builder /app/dist/everkeep/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
