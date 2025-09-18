# Simple single-stage Dockerfile
FROM node:18
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# migrate db
RUN npx prisma migrate

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "run", "start"]