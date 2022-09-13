# Stage 1: Build an Angular Docker Image
# Set base image
FROM node:latest as node
# Set the working directory
WORKDIR /app
# Add the source code
COPY . .
# Install all the dependencies
RUN npm install
RUN npm run build --prod

# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=node /app/dist/everkeep /usr/share/nginx/html