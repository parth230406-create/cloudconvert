# ============================================
# Stage 1: Build the React Frontend
# ============================================
FROM node:18-alpine AS client-build

WORKDIR /app/client

COPY client/package.json client/package-lock.json* ./
RUN npm install

COPY client/ ./
RUN npm run build

# ============================================
# Stage 2: Build the Production Server
# ============================================
FROM node:18-alpine

WORKDIR /app

# Install server dependencies
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --production

# Copy server source code
COPY server/ ./server/

# Copy React build from Stage 1
COPY --from=client-build /app/client/build ./client/build

# Create required directories
RUN mkdir -p /app/server/uploads \
             /app/server/outputs \
             /app/server/logs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV MAX_FILE_SIZE=26214400

# Expose port
EXPOSE 10000

# Start the server
CMD ["node", "server/server.js"]
