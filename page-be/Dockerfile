# Dockerfile - BE
FROM oven/bun:1

# Tạo thư mục app
WORKDIR /app

# Copy package + lock file trước
COPY package*.json ./
RUN bun install

# Copy toàn bộ project vào container
COPY . .

EXPOSE 5000

CMD ["bun", "run", "src/server.ts"]