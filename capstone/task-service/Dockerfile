# Stage 1 Builder

FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy packeges files and install dependecies
COPY package.json ./
RUN npm install

# Copys soucre code 
COPY . . 

# Stage 2 Production Runner
#  Spins up a clean, fresh Node environment.
FROM node:20-alpine AS runnner
WORKDIR /app
# WORKDIR /app =>  Creates a folder called /app

#Installs tsx to execute TypeScript without a separate build step.
RUN npm install -g tsx

# Multi-stage copy. Pulls the prepared /app directory directly from Stage 1 into Stage 2.
COPY --from=builder /app /app
#copy from my laptop from stage 1 /app

EXPOSE 3001

#Start the fasty server
CMD ["npx", "tsx", "src/server.ts"]
