package telemetry

import (
	"context"
	"log"
	"strconv"
	"time"

	"github.com/finora/mvp/gateway/crypto"
	"github.com/go-redis/redis/v8"
)

type MetricsReporter struct {
	rdb *redis.Client
}

func NewMetricsReporter(redisAddr string) *MetricsReporter {
	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	// Perform dry-run ping verification
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("[WARNING] Gateway failed to ping Redis at startup: %v. Telemetry will retry connection.", err)
	}

	return &MetricsReporter{rdb: rdb}
}

func (mr *MetricsReporter) ReportHandshake(ctx context.Context, result *crypto.HandshakeResult) {
	// Format values to match stream expectation
	values := map[string]interface{}{
		"client_ip":             "127.0.0.1", // In real deployment, this represents the client's public IP
		"protocol_version":      "TLS_1.3",
		"key_exchange_type":     result.ClassicalCipher + "_" + result.PqcCipher,
		"handshake_duration_ms": strconv.FormatFloat(result.DurationMs, 'f', 4, 64),
		"bytes_sent":            strconv.Itoa(result.BytesSent),
		"bytes_received":        strconv.Itoa(result.BytesReceived),
		"packet_fragmented":     strconv.FormatBool(result.PacketFragmented),
		"timestamp":             time.Now().Format(time.RFC3339),
	}

	err := mr.rdb.XAdd(ctx, &redis.XAddArgs{
		Stream: "telemetry:handshakes",
		MaxLen: 1000, // Keep stream bounded to prevent leaks
		Approx: true,
		Values: values,
	}).Err()

	if err != nil {
		log.Printf("[ERROR] Gateway failed to publish handshake to Redis Stream: %v", err)
	} else {
		log.Printf("[INFO] Gateway published telemetry: %s_%s | Duration: %.4f ms", 
			result.ClassicalCipher, result.PqcCipher, result.DurationMs)
	}
}

func (mr *MetricsReporter) Close() {
	if mr.rdb != nil {
		mr.rdb.Close()
	}
}
