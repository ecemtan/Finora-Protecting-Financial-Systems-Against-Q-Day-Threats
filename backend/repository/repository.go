package repository

import (
	"context"
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/finora/mvp/backend/models"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

// Assets logic
func (r *Repository) CreateAsset(ctx context.Context, name, assetType, zone string, shelfLife, migrationTime int) (*models.Asset, error) {
	// Calculate base risk score using Mosca's Theorem parameters
	riskScore := CalculateMoscaRisk(shelfLife, migrationTime, zone)

	query := `
		INSERT INTO assets (name, type, network_zone, data_shelf_life_years, migration_time_years, risk_score)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, name, type, network_zone, data_shelf_life_years, migration_time_years, risk_score, created_at, updated_at
	`

	var asset models.Asset
	err := r.db.QueryRowContext(ctx, query, name, assetType, zone, shelfLife, migrationTime, riskScore).Scan(
		&asset.ID, &asset.Name, &asset.Type, &asset.NetworkZone, &asset.DataShelfLifeYears,
		&asset.MigrationTimeYears, &asset.RiskScore, &asset.CreatedAt, &asset.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &asset, nil
}

func (r *Repository) GetAssets(ctx context.Context) ([]models.Asset, error) {
	query := `SELECT id, name, type, network_zone, data_shelf_life_years, migration_time_years, risk_score, created_at, updated_at FROM assets ORDER BY risk_score DESC`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var assets []models.Asset
	for rows.Next() {
		var a models.Asset
		err := rows.Scan(&a.ID, &a.Name, &a.Type, &a.NetworkZone, &a.DataShelfLifeYears, &a.MigrationTimeYears, &a.RiskScore, &a.CreatedAt, &a.UpdatedAt)
		if err != nil {
			return nil, err
		}
		assets = append(assets, a)
	}
	return assets, nil
}

func (r *Repository) GetAssetByID(ctx context.Context, id string) (*models.Asset, error) {
	query := `SELECT id, name, type, network_zone, data_shelf_life_years, migration_time_years, risk_score, created_at, updated_at FROM assets WHERE id = $1`
	var a models.Asset
	err := r.db.QueryRowContext(ctx, query, id).Scan(&a.ID, &a.Name, &a.Type, &a.NetworkZone, &a.DataShelfLifeYears, &a.MigrationTimeYears, &a.RiskScore, &a.CreatedAt, &a.UpdatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	return &a, nil
}

func (r *Repository) UpdateAssetRisk(ctx context.Context, id string, score float64) error {
	query := `UPDATE assets SET risk_score = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := r.db.ExecContext(ctx, query, score, id)
	return err
}

// CBOM & Violations logic
func (r *Repository) CreateCbomComponent(ctx context.Context, c *models.CbomComponent) error {
	query := `
		INSERT INTO cbom_components (asset_id, file_path_or_url, category, algorithm_used, is_quantum_safe)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, scanned_at
	`
	return r.db.QueryRowContext(ctx, query, c.AssetID, c.FilePathOrUrl, c.Category, c.AlgorithmUsed, c.IsQuantumSafe).Scan(&c.ID, &c.ScannedAt)
}

func (r *Repository) CreateViolation(ctx context.Context, v *models.Violation) error {
	query := `
		INSERT INTO violations (asset_id, cbom_component_id, severity, description, status)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, detected_at
	`
	return r.db.QueryRowContext(ctx, query, v.AssetID, v.CbomComponentID, v.Severity, v.Description, v.Status).Scan(&v.ID, &v.DetectedAt)
}

// Handshake Telemetry Logs logic
func (r *Repository) CreateHandshakeLog(ctx context.Context, h *models.HandshakeLog) error {
	query := `
		INSERT INTO handshake_logs (asset_id, client_ip, protocol_version, key_exchange_type, handshake_duration_ms, bytes_sent, bytes_received, packet_fragmented)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, timestamp
	`
	return r.db.QueryRowContext(ctx, query, h.AssetID, h.ClientIP, h.ProtocolVersion, h.KeyExchangeType, h.HandshakeDurationMs, h.BytesSent, h.BytesReceived, h.PacketFragmented).Scan(&h.ID, &h.Timestamp)
}

func (r *Repository) GetHandshakeLogs(ctx context.Context, limit int) ([]models.HandshakeLog, error) {
	query := `SELECT id, asset_id, client_ip, protocol_version, key_exchange_type, handshake_duration_ms, bytes_sent, bytes_received, packet_fragmented, timestamp FROM handshake_logs ORDER BY timestamp DESC LIMIT $1`
	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var logs []models.HandshakeLog
	for rows.Next() {
		var h models.HandshakeLog
		err := rows.Scan(&h.ID, &h.AssetID, &h.ClientIP, &h.ProtocolVersion, &h.KeyExchangeType, &h.HandshakeDurationMs, &h.BytesSent, &h.BytesReceived, &h.PacketFragmented, &h.Timestamp)
		if err != nil {
			return nil, err
		}
		logs = append(logs, h)
	}
	return logs, nil
}

// Get Dashboard Summary Stats
func (r *Repository) GetDashboardSummary(ctx context.Context) (*models.DashboardSummary, error) {
	var summary models.DashboardSummary
	summary.Timestamp = time.Now()

	// Total monitored assets
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM assets").Scan(&summary.MonitoredAssetsCount)
	if err != nil {
		return nil, err
	}

	// Vulnerable assets (Risk > 50 or has unresolved critical/high violations)
	err = r.db.QueryRowContext(ctx, `
		SELECT COUNT(DISTINCT assets.id) FROM assets 
		LEFT JOIN violations ON assets.id = violations.asset_id 
		WHERE assets.risk_score > 50.00 OR (violations.status = 'unresolved' AND violations.severity IN ('critical', 'high'))
	`).Scan(&summary.VulnerableAssetsCount)
	if err != nil {
		return nil, err
	}

	// Average Handshake latency
	var avgDuration sql.NullFloat64
	err = r.db.QueryRowContext(ctx, "SELECT AVG(handshake_duration_ms) FROM handshake_logs").Scan(&avgDuration)
	if err != nil {
		return nil, err
	}
	if avgDuration.Valid {
		summary.AverageHandshakeMs = avgDuration.Float64
	} else {
		summary.AverageHandshakeMs = 0.0
	}

	// Quantum readiness percentage = (Monitored - Vulnerable) / Monitored * 100
	if summary.MonitoredAssetsCount > 0 {
		summary.ReadinessPercentage = float64(summary.MonitoredAssetsCount-summary.VulnerableAssetsCount) / float64(summary.MonitoredAssetsCount) * 100.0
	} else {
		summary.ReadinessPercentage = 100.0
	}

	// Handshake History metrics for Recharts rendering
	historyQuery := `
		SELECT timestamp::text, handshake_duration_ms, bytes_sent, bytes_received 
		FROM handshake_logs 
		ORDER BY timestamp DESC LIMIT 20
	`
	rows, err := r.db.QueryContext(ctx, historyQuery)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var h models.HandshakeHistory
			var ts string
			if err := rows.Scan(&ts, &h.HandshakeDurationMs, &h.BytesSent, &h.BytesReceived); err == nil {
				h.Time = ts
				summary.HandshakeHistory = append(summary.HandshakeHistory, h)
			}
		}
	}

	return &summary, nil
}

// Mosca's Theorem Risk Calculator
// D: Data Shelf Life
// T: Migration Time
// Y: Years to collapse (Standardized at 10 years for TEKNOFEST)
func CalculateMoscaRisk(shelfLife, migrationTime int, zone string) float64 {
	yCollapse := 10.0
	dShelf := float64(shelfLife)
	tMigrate := float64(migrationTime)

	var exposure float64
	switch zone {
	case "public":
		exposure = 1.5
	case "dmz":
		exposure = 1.2
	case "internal":
		exposure = 0.8
	default:
		exposure = 1.0
	}

	// Mosca score ratio: (D + T) / Y
	ratio := (dShelf + tMigrate) / yCollapse
	score := ratio * 50.0 * exposure

	if score > 100.0 {
		return 100.0
	}
	if score < 0.0 {
		return 0.0
	}
	return score
}

// Seed Demo Data for TEKNOFEST Validation
func (r *Repository) SeedDemoData(ctx context.Context) error {
	var count int
	err := r.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM assets").Scan(&count)
	if err != nil {
		return err
	}
	if count > 0 {
		log.Println("[INFO] Assets table already contains records. Skipping database seeding.")
		return nil
	}

	log.Println("[INFO] Seeding database with demo financial assets...")

	// Create Demo Assets
	paymentGateway, err := r.CreateAsset(ctx, "Core Payment Gateway", "api_endpoint", "dmz", 10, 3)
	if err != nil {
		return err
	}
	swiftCore, err := r.CreateAsset(ctx, "SWIFT ISO-20022 Interface", "server", "internal", 15, 4)
	if err != nil {
		return err
	}
	ledgerRepo, err := r.CreateAsset(ctx, "Finora Core Ledger Repo", "source_repo", "internal", 5, 2)
	if err != nil {
		return err
	}

	// Seed CBOM & Violations for Core Payment Gateway (High Vulnerability)
	var comp1Id string
	q1 := `INSERT INTO cbom_components (asset_id, file_path_or_url, category, algorithm_used, is_quantum_safe) 
		   VALUES ($1, 'payments/gateway.go', 'asymmetric_encryption', 'RSA-2048', FALSE) RETURNING id`
	err = r.db.QueryRowContext(ctx, q1, paymentGateway.ID).Scan(&comp1Id)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO violations (asset_id, cbom_component_id, severity, description, status)
		VALUES ($1, $2, 'high', 'Vulnerable RSA-2048 key exchange algorithm detected. Needs upgrade to hybrid ML-KEM.', 'unresolved')
	`, paymentGateway.ID, comp1Id)
	if err != nil {
		return err
	}

	// Seed CBOM & Violations for SWIFT ISO-20022 Interface (Critical Vulnerability)
	var comp2Id string
	q2 := `INSERT INTO cbom_components (asset_id, file_path_or_url, category, algorithm_used, is_quantum_safe) 
		   VALUES ($1, 'swift/signing_service.py', 'digital_signature', 'ECDSA-P256', FALSE) RETURNING id`
	err = r.db.QueryRowContext(ctx, q2, swiftCore.ID).Scan(&comp2Id)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO violations (asset_id, cbom_component_id, severity, description, status)
		VALUES ($1, $2, 'critical', 'Legacy signature scheme ECDSA-P256 vulnerable to forgery. Upgrade required to ML-DSA.', 'unresolved')
	`, swiftCore.ID, comp2Id)
	if err != nil {
		return err
	}

	// Seed quantum-safe asset (Ledger Repo)
	_, err = r.db.ExecContext(ctx, `
		INSERT INTO cbom_components (asset_id, file_path_or_url, category, algorithm_used, is_quantum_safe)
		VALUES ($1, 'ledger/main.go', 'asymmetric_encryption', 'ML-KEM-768', TRUE)
	`, ledgerRepo.ID)
	if err != nil {
		return err
	}

	// Seed some starting handshake logs to fill telemetry charts
	ciphers := []struct {
		exchange string
		duration float64
		pSafe    bool
	}{
		{"hybrid_x25519_mlkem768", 1.82, false},
		{"hybrid_x25519_mlkem768", 1.45, false},
		{"ECDH-P256-RSA-AES256", 0.45, true},
		{"hybrid_x25519_mlkem768", 2.12, true},
		{"ECDH-P256-RSA-AES256", 0.38, false},
	}

	for i, c := range ciphers {
		logTimestamp := time.Now().Add(-time.Duration(i*30) * time.Minute)
		_, err = r.db.ExecContext(ctx, `
			INSERT INTO handshake_logs (asset_id, client_ip, protocol_version, key_exchange_type, handshake_duration_ms, bytes_sent, bytes_received, packet_fragmented, timestamp)
			VALUES ($1, '192.168.1.100', 'TLS_1.3', $2, $3, 2048, 1024, $4, $5)
		`, paymentGateway.ID, c.exchange, c.duration, c.pSafe, logTimestamp)
		if err != nil {
			return err
		}
	}

	log.Println("[INFO] Successfully seeded demo data.")
	return nil
}
