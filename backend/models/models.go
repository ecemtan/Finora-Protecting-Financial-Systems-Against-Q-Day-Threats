package models

import "time"

type Asset struct {
	ID                  string    `json:"id" db:"id"`
	Name                string    `json:"name" db:"name"`
	Type                string    `json:"type" db:"type"` // 'api_endpoint', 'source_repo', 'server'
	NetworkZone         string    `json:"network_zone" db:"network_zone"` // 'public', 'dmz', 'internal'
	DataShelfLifeYears  int       `json:"data_shelf_life_years" db:"data_shelf_life_years"`
	MigrationTimeYears  int       `json:"migration_time_years" db:"migration_time_years"`
	RiskScore           float64   `json:"risk_score" db:"risk_score"`
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time `json:"updated_at" db:"updated_at"`
}

type CbomComponent struct {
	ID            string    `json:"id" db:"id"`
	AssetID       string    `json:"asset_id" db:"asset_id"`
	FilePathOrUrl string    `json:"file_path_or_url" db:"file_path_or_url"`
	Category      string    `json:"category" db:"category"` // 'asymmetric_encryption', 'digital_signature'
	AlgorithmUsed string    `json:"algorithm_used" db:"algorithm_used"`
	IsQuantumSafe bool      `json:"is_quantum_safe" db:"is_quantum_safe"`
	ScannedAt     time.Time `json:"scanned_at" db:"scanned_at"`
}

type Violation struct {
	ID              string     `json:"id" db:"id"`
	AssetID         string     `json:"asset_id" db:"asset_id"`
	CbomComponentID *string    `json:"cbom_component_id" db:"cbom_component_id"`
	Severity        string     `json:"severity" db:"severity"` // 'low', 'medium', 'high', 'critical'
	Description     string     `json:"description" db:"description"`
	Status          string     `json:"status" db:"status"` // 'unresolved', 'resolved'
	DetectedAt      time.Time  `json:"detected_at" db:"detected_at"`
	ResolvedAt      *time.Time `json:"resolved_at" db:"resolved_at"`
}

type HandshakeLog struct {
	ID                  int64     `json:"id" db:"id"`
	AssetID             *string   `json:"asset_id" db:"asset_id"`
	ClientIP            string    `json:"client_ip" db:"client_ip"`
	ProtocolVersion     string    `json:"protocol_version" db:"protocol_version"`
	KeyExchangeType     string    `json:"key_exchange_type" db:"key_exchange_type"`
	HandshakeDurationMs float64   `json:"handshake_duration_ms" db:"handshake_duration_ms"`
	BytesSent           int       `json:"bytes_sent" db:"bytes_sent"`
	BytesReceived       int       `json:"bytes_received" db:"bytes_received"`
	PacketFragmented    bool      `json:"packet_fragmented" db:"packet_fragmented"`
	Timestamp           time.Time `json:"timestamp" db:"timestamp"`
}

type DashboardSummary struct {
	ReadinessPercentage   float64            `json:"readiness_percentage"`
	VulnerableAssetsCount int                `json:"vulnerable_assets_count"`
	MonitoredAssetsCount  int                `json:"monitored_assets_count"`
	AverageHandshakeMs    float64            `json:"average_handshake_ms"`
	Timestamp             time.Time          `json:"timestamp"`
	HandshakeHistory      []HandshakeHistory `json:"handshake_history"`
}

type HandshakeHistory struct {
	Time                string  `json:"time"`
	HandshakeDurationMs float64 `json:"handshake_duration_ms"`
	BytesSent           int     `json:"bytes_sent"`
	BytesReceived       int     `json:"bytes_received"`
}
