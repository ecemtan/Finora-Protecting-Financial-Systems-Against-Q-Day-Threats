-- Finora MVP Database DDL Schema
-- Target: PostgreSQL 15+

BEGIN;

-- 1. Create Assets Table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'api_endpoint', 'source_repo', 'server'
    network_zone VARCHAR(50) NOT NULL, -- 'public', 'dmz', 'internal'
    data_shelf_life_years INT NOT NULL DEFAULT 5, -- D
    migration_time_years INT NOT NULL DEFAULT 2, -- T
    risk_score DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create CBOM Components Table
CREATE TABLE IF NOT EXISTS cbom_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    file_path_or_url VARCHAR(512) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'asymmetric_encryption', 'digital_signature'
    algorithm_used VARCHAR(100) NOT NULL, -- 'RSA-2048', 'ML-KEM-768'
    is_quantum_safe BOOLEAN NOT NULL DEFAULT FALSE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Violations Table
CREATE TABLE IF NOT EXISTS violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    cbom_component_id UUID REFERENCES cbom_components(id) ON DELETE SET NULL,
    severity VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unresolved', -- 'unresolved', 'resolved'
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create Handshake Telemetry Logs Table
CREATE TABLE IF NOT EXISTS handshake_logs (
    id BIGSERIAL PRIMARY KEY,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    client_ip VARCHAR(45) NOT NULL,
    protocol_version VARCHAR(20) NOT NULL, -- 'TLS_1.3'
    key_exchange_type VARCHAR(100) NOT NULL, -- 'hybrid_x25519_mlkem768'
    handshake_duration_ms DOUBLE PRECISION NOT NULL,
    bytes_sent INT NOT NULL,
    bytes_received INT NOT NULL,
    packet_fragmented BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for efficient queries from the Compliance Dashboard
CREATE INDEX IF NOT EXISTS idx_assets_risk_score ON assets(risk_score);
CREATE INDEX IF NOT EXISTS idx_cbom_asset_id ON cbom_components(asset_id);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations(status);
CREATE INDEX IF NOT EXISTS idx_handshake_logs_timestamp ON handshake_logs(timestamp);

COMMIT;
