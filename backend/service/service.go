package service

import (
	"context"
	"fmt"

	"github.com/finora/mvp/backend/models"
	"github.com/finora/mvp/backend/repository"
)

type Service struct {
	repo *repository.Repository
}

func NewService(repo *repository.Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateAsset(ctx context.Context, name, assetType, zone string, shelfLife, migrationTime int) (*models.Asset, error) {
	if name == "" || assetType == "" || zone == "" {
		return nil, fmt.Errorf("name, type, and network zone are required fields")
	}
	return s.repo.CreateAsset(ctx, name, assetType, zone, shelfLife, migrationTime)
}

func (s *Service) GetAssets(ctx context.Context) ([]models.Asset, error) {
	return s.repo.GetAssets(ctx)
}

func (s *Service) RecordHandshakeLog(ctx context.Context, h *models.HandshakeLog) error {
	return s.repo.CreateHandshakeLog(ctx, h)
}

func (s *Service) SaveScanResults(ctx context.Context, assetID string, items []models.CbomComponent, violations []models.Violation) error {
	// 1. Double check asset exists
	asset, err := s.repo.GetAssetByID(ctx, assetID)
	if err != nil {
		return err
	}
	if asset == nil {
		return fmt.Errorf("target asset not found: %s", assetID)
	}

	// 2. Iterate and save CBOM entries and check if they lead to violations
	var unquantumSafeCount int
	for _, item := range items {
		item.AssetID = assetID
		err := s.repo.CreateCbomComponent(ctx, &item)
		if err != nil {
			return err
		}
		if !item.IsQuantumSafe {
			unquantumSafeCount++
		}
	}

	// 3. Save violations
	for _, v := range violations {
		v.AssetID = assetID
		err := s.repo.CreateViolation(ctx, &v)
		if err != nil {
			return err
		}
	}

	// 4. Update dynamic risk score. If there are violations, recalculate
	// Let's add weight based on violations severity
	baseRisk := repository.CalculateMoscaRisk(asset.DataShelfLifeYears, asset.MigrationTimeYears, asset.NetworkZone)
	
	// Add weighting per violation (10% extra per high/critical violation up to 100%)
	penalty := float64(unquantumSafeCount) * 15.0
	finalScore := baseRisk + penalty
	if finalScore > 100.00 {
		finalScore = 100.00
	}

	return s.repo.UpdateAssetRisk(ctx, assetID, finalScore)
}

func (s *Service) GetDashboardSummary(ctx context.Context) (*models.DashboardSummary, error) {
	return s.repo.GetDashboardSummary(ctx)
}

func (s *Service) SeedDemoData(ctx context.Context) error {
	return s.repo.SeedDemoData(ctx)
}
