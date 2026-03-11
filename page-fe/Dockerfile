# Dockerfile - FE
FROM oven/bun:1

# Làm việc trong /app
WORKDIR /app

# Copy file cần thiết và cài deps
COPY . .
RUN bun install

# Copy toàn bộ source vào
COPY . .

# Mở port Vite
EXPOSE 5173

# Chạy Vite dev
CMD ["bun", "dev"]
