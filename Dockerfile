# Development Dockerfile for Bricks AI Tycoon
FROM node:20-alpine

WORKDIR /app

# Install dependencies for node-gyp (some packages need it)
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]
