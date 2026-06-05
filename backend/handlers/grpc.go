package handlers

import (
	"context"
	"log"

	"github.com/finora/mvp/backend/models"
	"github.com/finora/mvp/backend/service"
	pb "github.com/finora/mvp/proto/v1"
)

type GrpcHandler struct {
	pb.UnimplementedTelemetryServiceServer
	svc *service.Service
}

func NewGrpcHandler(svc *service.Service) *GrpcHandler {
	return &GrpcHandler{svc: svc}
}

func (g *GrpcHandler) ReportScanResults(ctx context.Context, req *pb.ScanReportRequest) (*pb.ScanReportResponse, error) {
	log.Printf("[INFO] gRPC received scan report for asset: %s with %d findings", req.AssetId, len(req.Items))

	var components []models.CbomComponent
	var violations []models.Violation

	for _, item := range req.Items {
		comp := models.CbomComponent{
			AssetID:       req.AssetId,
			FilePathOrUrl: item.FilePathOrUrl,
			Category:      item.Category,
			AlgorithmUsed: item.AlgorithmUsed,
			IsQuantumSafe: item.IsQuantumSafe,
		}
		components = append(components, comp)

		if !item.IsQuantumSafe {
			viol := models.Violation{
				AssetID:     req.AssetId,
				Severity:    item.ViolationSeverity,
				Description: item.ViolationDescription,
				Status:      "unresolved",
			}
			violations = append(violations, viol)
		}
	}

	err := g.svc.SaveScanResults(ctx, req.AssetId, components, violations)
	if err != nil {
		log.Printf("[ERROR] Failed to save gRPC scan results: %v", err)
		return &pb.ScanReportResponse{Success: false, ViolationsRecorded: 0}, err
	}

	log.Printf("[INFO] gRPC scan results saved successfully. Violations recorded: %d", len(violations))
	return &pb.ScanReportResponse{
		Success:            true,
		ViolationsRecorded: int32(len(violations)),
	}, nil
}

func (g *GrpcHandler) GetGatewayConfig(ctx context.Context, req *pb.GatewayConfigRequest) (*pb.GatewayConfigResponse, error) {
	log.Printf("[INFO] gRPC received gateway config check for node: %s", req.GatewayId)

	// In MVP, we return a default hybrid configuration
	return &pb.GatewayConfigResponse{
		PolicyName:    "hybrid-default",
		EnforceHybrid: true,
		MtuLimit:      1400,
	}, nil
}
