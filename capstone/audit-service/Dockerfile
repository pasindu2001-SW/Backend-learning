FROM oven/bun:alpine
WORKDIR /app

#Copy package files and install dependcies via bun
# * ensures Docker doesn't throw a build error if bun.lock or bun.lockb does not exist yet.
COPY package.json bun.lock* ./  
RUN bun install

#copy soucre code
COPY . .

EXPOSE 3002

# start Hono on Bun
CMD ["bun", "run", "src/index.ts"]