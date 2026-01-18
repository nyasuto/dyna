# Build Stage
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Copy go mod and sum files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
# CGO_ENABLED=1 is required for go-sqlite3
RUN CGO_ENABLED=1 GOOS=linux go build -o main .

# Runtime Stage
FROM alpine:latest

WORKDIR /app

# Install runtime dependencies for sqlite (if needed, usually static linking covers it but alpine is safer)
RUN apk add --no-cache sqlite-libs ca-certificates

# Create data directory
RUN mkdir -p /app/data

COPY --from=builder /app/main .
COPY --from=builder /app/.env.example .env

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./main"]
