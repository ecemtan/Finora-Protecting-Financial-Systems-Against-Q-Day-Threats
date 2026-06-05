FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy all source files first
COPY . .

# Generate correct go.sum dynamically within the builder container
RUN go mod tidy

# Build standard static Go binary
RUN CGO_ENABLED=0 GOOS=linux go build -o /finora-gateway ./gateway/main.go

FROM alpine:latest

WORKDIR /

COPY --from=builder /finora-gateway /finora-gateway

EXPOSE 8443

ENTRYPOINT ["/finora-gateway"]
