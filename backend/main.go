package main

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/finora/mvp/backend/benchmark"
	"github.com/finora/mvp/backend/config"
	"github.com/finora/mvp/backend/db"
	"github.com/finora/mvp/backend/handlers"
	"github.com/finora/mvp/backend/repository"
	"github.com/finora/mvp/backend/service"
	pb "github.com/finora/mvp/proto/v1"
	"github.com/gin-gonic/gin"
	"google.golang.org/grpc"
)

func main() {
	log.Println("[INFO] Bootstrapping Finora Core Backend...")

	// 1. Load Configurations
	cfg := config.LoadConfig()

	// 2. Initialize PostgreSQL & Redis Datastores
	datastores, err := db.InitDatastores(cfg)
	if err != nil {
		log.Fatalf("[FATAL] Datastore initialization failed: %v", err)
	}
	defer datastores.Close()

	// 3. Setup Repositories and Services
	repo := repository.NewRepository(datastores.DB)
	svc := service.NewService(repo)

	// 4. Seed Demo Data for TEKNOFEST Review
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	err = svc.SeedDemoData(ctx)
	cancel()
	if err != nil {
		log.Printf("[WARNING] Seeding demo data encountered an error: %v", err)
	}

	// 5. Initialize & Launch gRPC Server
	grpcServer := grpc.NewServer()
	grpcHandler := handlers.NewGrpcHandler(svc)
	pb.RegisterTelemetryServiceServer(grpcServer, grpcHandler)

	lis, err := net.Listen("tcp", ":"+cfg.GRPCPort)
	if err != nil {
		log.Fatalf("[FATAL] Failed to bind gRPC port: %v", err)
	}

	go func() {
		log.Printf("[INFO] Launching gRPC Server on port %s...", cfg.GRPCPort)
		if err := grpcServer.Serve(lis); err != nil && err != grpc.ErrServerStopped {
			log.Printf("[ERROR] gRPC Server failed: %v", err)
		}
	}()

	// 6. Launch Benchmark Metrics stream worker
	workerCtx, workerCancel := context.WithCancel(context.Background())
	defer workerCancel()
	
	worker := benchmark.NewBenchmarkWorker(datastores.Redis, svc)
	go worker.Start(workerCtx)

	// 7. Register REST Handlers and Launch HTTP Server
	r := gin.Default()
	httpHandler := handlers.NewHttpHandler(svc)
	httpHandler.RegisterRoutes(r)

	srv := &http.Server{
		Addr:    ":" + cfg.HTTPPort,
		Handler: r,
	}

	go func() {
		log.Printf("[INFO] Launching REST HTTP Server on port %s...", cfg.HTTPPort)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Printf("[ERROR] REST Server failed: %v", err)
		}
	}()

	// 8. Graceful Shutdown Configuration
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[INFO] Shutting down Finora Core Backend...")

	// Terminate gRPC Server
	grpcServer.GracefulStop()

	// Stop metrics stream worker
	workerCancel()

	// Terminate HTTP Server
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Printf("[ERROR] HTTP Server forced shutdown: %v", err)
	}

	log.Println("[INFO] Finora Core Backend stopped gracefully.")
}
