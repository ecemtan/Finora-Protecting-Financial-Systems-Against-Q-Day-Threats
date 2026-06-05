package benchmark

import (
	"context"
	"log"
	"strconv"
	"time"

	"github.com/finora/mvp/backend/models"
	"github.com/finora/mvp/backend/service"
	"github.com/go-redis/redis/v8"
)

type BenchmarkWorker struct {
	rdb *redis.Client
	svc *service.Service
}

func NewBenchmarkWorker(rdb *redis.Client, svc *service.Service) *BenchmarkWorker {
	return &BenchmarkWorker{
		rdb: rdb,
		svc: svc,
	}
}

func (w *BenchmarkWorker) Start(ctx context.Context) {
	log.Println("[INFO] Starting Benchmark Worker metrics listener on Redis Stream 'telemetry:handshakes'...")

	lastID := "0" // Start reading from the beginning of the stream to capture backlogs

	// Ensure stream group or stream exists by making a dry run or just catching errors
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("[INFO] Stopping Benchmark Worker metrics listener...")
			return
		case <-ticker.C:
			// Read records from the Redis stream
			streams, err := w.rdb.XRead(ctx, &redis.XReadArgs{
				Streams: []string{"telemetry:handshakes", lastID},
				Count:   20,
				Block:   0, // Non-blocking read so we don't stall the loop select
			}).Result()

			if err != nil {
				if err == redis.Nil {
					// Stream is empty or no new items
					continue
				}
				log.Printf("[WARNING] Redis Stream read error: %v. Retrying...", err)
				time.Sleep(2 * time.Second) // Delay retry on Redis error
				continue
			}

			for _, stream := range streams {
				for _, message := range stream.Messages {
					lastID = message.ID // Keep track of progress

					hLog := w.parseMessage(message.Values)
					if hLog == nil {
						log.Printf("[WARNING] Skipping unparseable stream message ID: %s", message.ID)
						continue
					}

					err := w.svc.RecordHandshakeLog(ctx, hLog)
					if err != nil {
						log.Printf("[ERROR] Failed to save handshake log from stream to database: %v", err)
						continue
					}

					log.Printf("[INFO] Processed handshake log from stream: %s | Duration: %.2f ms", 
						hLog.KeyExchangeType, hLog.HandshakeDurationMs)

					// Optionally trim stream to avoid infinite memory growth
					_, _ = w.rdb.XDel(ctx, "telemetry:handshakes", message.ID).Result()
				}
			}
		}
	}
}

func (w *BenchmarkWorker) parseMessage(values map[string]interface{}) *models.HandshakeLog {
	clientIP, _ := values["client_ip"].(string)
	protocolVersion, _ := values["protocol_version"].(string)
	keyExchangeType, _ := values["key_exchange_type"].(string)

	if clientIP == "" || protocolVersion == "" || keyExchangeType == "" {
		return nil
	}

	var assetID *string
	if val, exists := values["asset_id"].(string); exists && val != "" {
		assetID = &val
	}

	hDuration, _ := strconv.ParseFloat(values["handshake_duration_ms"].(string), 64)
	bytesSent, _ := strconv.Atoi(values["bytes_sent"].(string))
	bytesReceived, _ := strconv.Atoi(values["bytes_received"].(string))
	packetFrag, _ := strconv.ParseBool(values["packet_fragmented"].(string))

	return &models.HandshakeLog{
		AssetID:             assetID,
		ClientIP:            clientIP,
		ProtocolVersion:     protocolVersion,
		KeyExchangeType:     keyExchangeType,
		HandshakeDurationMs: hDuration,
		BytesSent:           bytesSent,
		BytesReceived:       bytesReceived,
		PacketFragmented:    packetFrag,
	}
}
