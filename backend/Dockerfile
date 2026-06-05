FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy all source files first
COPY . .

# Generate correct go.sum dynamically within the builder container
RUN go mod tidy

# Build standard static Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /finora-backend ./backend/main.go

FROM alpine:latest

WORKDIR /

COPY --from=builder /finora-backend /finora-backend

EXPOSE 8080 9090

ENTRYPOINT ["/finora-backend"]
