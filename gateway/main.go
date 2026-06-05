package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/finora/mvp/backend/config"
	"github.com/finora/mvp/gateway/proxy"
	"github.com/finora/mvp/gateway/telemetry"
)

func main() {
	log.Println("[INFO] Bootstrapping Finora Hybrid PQC Gateway MVP...")

	// 1. Load Configurations using the shared config loader
	cfg := config.LoadConfig()

	// 2. Initialize Telemetry Reporter
	reporter := telemetry.NewMetricsReporter(cfg.RedisAddr)
	defer reporter.Close()

	// 3. Initialize Gateway Proxy
	gp, err := proxy.NewGatewayProxy(cfg.BackendTarget, reporter)
	if err != nil {
		log.Fatalf("[FATAL] Failed to initialize Gateway Proxy: %v", err)
	}

	// 4. Start HTTP Server
	srv := &http.Server{
		Addr:    ":" + cfg.GatewayPort,
		Handler: gp,
	}

	go func() {
		log.Printf("[INFO] Launching Hybrid PQC Gateway on port %s forwarding to %s...", cfg.GatewayPort, cfg.BackendTarget)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("[ERROR] Gateway Server failed: %v", err)
		}
	}()

	// 5. Graceful Shutdown Configuration
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[INFO] Shutting down Finora Hybrid PQC Gateway...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("[ERROR] Gateway forced shutdown: %v", err)
	}

	log.Println("[INFO] Finora Hybrid PQC Gateway stopped gracefully.")
}
