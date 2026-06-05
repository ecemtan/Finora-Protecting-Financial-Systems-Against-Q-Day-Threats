# Finora: TEKNOFEST MVP Architectural Specification & Roadmap
**Document Version:** 2.0.0-mvp  
**Role:** Lead Architect & CTO  
**Target:** 4-6 Week Implementable MVP by a Small Team  

---

## 1. System Overview & Core MVP Architecture

The Finora MVP is a simplified, high-fidelity security platform demonstrating the transition from classical cryptography to hybrid Post-Quantum Cryptography (PQC). It eliminates enterprise overhead (such as SGX/Nitro enclaves, DPDK, and multi-region synchronization) to focus on a functional containerized demonstration.

### 1.1 The Hybrid Cryptographic Paradigm
To secure data streams without violating current compliance guidelines, the **Hybrid PQC Gateway** executes a hybrid TLS handshake. It combines:
* **Classical**: `X25519` (ECDH Key Exchange)
* **Post-Quantum**: `ML-KEM-768` (Kyber-768 Key Encapsulation)

The shared secret $K_{session}$ is derived using the standard mixing function:
$$K_{session} = \text{HKDF-Extract}(\text{Salt}, SS_{X25519} \mathbin{\Vert} SS_{ML-KEM})$$

---

## 2. Module Specifications

```
                       [ Incoming Traffic ]
                                │
                                ▼
                   ┌──────────────────────────┐
                   │    Hybrid PQC Gateway    │
                   │ (Terminates X25519+MLKEM)│
                   └────────────┬─────────────┘
                                │
                                │ HTTP Proxy Request
                                ▼
                   ┌──────────────────────────┐
                   │   Downstream Backend     │
                   │  (Standard REST APIs)    │
                   └────────────┬─────────────┘
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
 ┌──────────────────────┐              ┌──────────────────────┐
 │    PostgreSQL DB     │              │     Redis Cluster    │
 │ (Assets & CBOM Viol) │              │  (Handshake Stream)  │
 └──────────────────────┘              └───────────┬──────────┘
                                                   │
                                                   ▼
                                       ┌──────────────────────┐
                                       │   Benchmark Engine   │
                                       │   (Stream Consumer)  │
                                       └──────────────────────┘
```

### 2.1 Hybrid PQC Gateway (HPG)
* **Responsibilities**:
  * Listen for incoming TLS connections.
  * Terminate hybrid handshakes (`X25519` + `ML-KEM-768`) using Cloudflare's `circl` library.
  * Proxy standard HTTP requests to internal/legacy backends (reverse proxy).
  * Record handshake parameters (timing, packet sizes, client IP) and write them to a Redis Stream (`telemetry:handshakes`).
* **Folder Structure**: `/gateway`
* **Development Order**: 1st (Core networking dependency).

### 2.2 Quantum Readiness Scanner (QRS)
* **Responsibilities**:
  * **Static Scanner**: Scan local source code folders to build an Abstract Syntax Tree (AST) of the files. Identify imports of non-quantum safe algorithms (e.g., Go's `crypto/rsa`, `crypto/dsa`, `crypto/ecdsa`) and catalog them.
  * **Network Scanner**: Probe target network endpoints by establishing connection handshakes. Audit the certificates and cipher suites supported, tagging them as vulnerable or quantum-safe.
  * Write scan summaries (CBOM - Cryptographic Bill of Materials) and violation logs to PostgreSQL via the Backend API.
* **Folder Structure**: `/scanner`
* **Development Order**: 3rd (Integrates after Backend DB routes are established).

### 2.3 Benchmark Engine (BE)
* **Responsibilities**:
  * Act as an out-of-band worker consuming metrics from the Redis Stream (`telemetry:handshakes`).
  * Process, aggregate, and write performance metrics to PostgreSQL (durations, packet size increases).
  * Calculate statistical deviations comparing classical vs hybrid handshakes.
* **Folder Structure**: Within `/backend/benchmark`
* **Development Order**: 2nd (Integrates directly into Backend logic).

### 2.4 Compliance Dashboard (CD)
* **Responsibilities**:
  * Display real-time telemetry (handshake times, classical vs hybrid traffic ratio).
  * Visualize Mosca's Theorem Risk scores for registered assets.
  * Trigger manual runs of the static and network scanners.
  * Provide configuration settings to hot-reload allowed gateway cipher policies.
* **Folder Structure**: `/frontend` (React + Next.js App Router).
* **Development Order**: 4th (Consumes finalized REST APIs).

---

## 3. Database Schema Proposal (PostgreSQL)

```sql
-- DDL Script: Finora TEKNOFEST MVP Schema
-- Database: PostgreSQL

BEGIN;

-- Assets inventory
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'api_endpoint', 'source_repo', 'server'
    network_zone VARCHAR(50) NOT NULL, -- 'public', 'dmz', 'internal'
    data_shelf_life_years INT NOT NULL DEFAULT 5, -- D
    migration_time_years INT NOT NULL DEFAULT 2, -- T
    risk_score DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cryptographic Bill of Materials (CBOM)
CREATE TABLE cbom_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    file_path_or_url VARCHAR(512) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'asymmetric_encryption', 'digital_signature'
    algorithm_used VARCHAR(100) NOT NULL, -- 'RSA-2048', 'ML-KEM-768'
    is_quantum_safe BOOLEAN NOT NULL DEFAULT FALSE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cryptographic Policy Violations
CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    cbom_component_id UUID REFERENCES cbom_components(id) ON DELETE SET NULL,
    severity VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unresolved', -- 'unresolved', 'resolved'
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Telemetry Logs from Gateway
CREATE TABLE handshake_logs (
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

-- Indexing for Dashboard Queries
CREATE INDEX idx_assets_risk ON assets(risk_score);
CREATE INDEX idx_violations_asset ON violations(asset_id);
CREATE INDEX idx_handshake_time ON handshake_logs(timestamp);

COMMIT;
```

---

## 4. API Design Proposal

### 4.1 REST APIs (Backend to Dashboard)

#### A. Fetch System Dashboard Summary
* **Endpoint**: `GET /api/v1/dashboard/summary`
* **Response (200 OK)**:
```json
{
  "readiness_percentage": 82.4,
  "vulnerable_assets_count": 3,
  "monitored_assets_count": 14,
  "average_handshake_ms": 1.45,
  "timestamp": "2026-06-05T20:00:00Z"
}
```

#### B. Fetch Registered Assets
* **Endpoint**: `GET /api/v1/assets`
* **Response (200 OK)**:
```json
[
  {
    "id": "c3d6e5a4-4f2a-8c9e-1d5b-21932483a992",
    "name": "payment-api-gateway",
    "type": "api_endpoint",
    "network_zone": "dmz",
    "risk_score": 12.50,
    "data_shelf_life_years": 5,
    "migration_time_years": 2
  }
]
```

#### C. Create Asset (Trigger Registry)
* **Endpoint**: `POST /api/v1/assets`
* **Request Payload**:
```json
{
  "name": "core-ledger-repo",
  "type": "source_repo",
  "network_zone": "internal",
  "data_shelf_life_years": 10,
  "migration_time_years": 3
}
```
* **Response (201 Created)**:
```json
{
  "id": "e4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
  "name": "core-ledger-repo",
  "risk_score": 0.00
}
```

#### D. Trigger Scanner
* **Endpoint**: `POST /api/v1/scanner/scan`
* **Request Payload**:
```json
{
  "asset_id": "e4f5a6b7-8c9d-0e1f-2a3b-4c5d6e7f8a9b",
  "scan_type": "static",
  "target_path": "./test/mock_repo"
}
```
* **Response (202 Accepted)**:
```json
{
  "scan_job_id": "f5a6b7c8-9d0e-1f2a-3b4c-5d6e7f8a9b0c",
  "status": "processing"
}
```

#### E. Fetch Benchmarking Metrics
* **Endpoint**: `GET /api/v1/benchmarks`
* **Response (200 OK)**:
```json
{
  "classical": {
    "avg_handshake_duration_ms": 0.45,
    "avg_payload_bytes": 256
  },
  "hybrid": {
    "avg_handshake_duration_ms": 1.62,
    "avg_payload_bytes": 2280
  }
}
```

---

### 4.2 gRPC API Specification (Gateway/Scanner to Backend)

```protobuf
syntax = "proto3";

package finora.mvp.v1;

option go_package = "github.com/finora/mvp/proto/v1;finorapb";

service TelemetryService {
  // Report static or network scanner findings
  rpc ReportScanResults(ScanReportRequest) returns (ScanReportResponse);

  // Read active security configuration for gateway nodes
  rpc GetGatewayConfig(GatewayConfigRequest) returns (GatewayConfigResponse);
}

message ScanReportRequest {
  string asset_id = 1;
  repeated CbomItem items = 2;
}

message CbomItem {
  string file_path_or_url = 1;
  string category = 2;
  string algorithm_used = 3;
  bool is_quantum_safe = 4;
  string violation_severity = 5;
  string violation_description = 6;
}

message ScanReportResponse {
  bool success = 1;
  int32 violations_recorded = 2;
}

message GatewayConfigRequest {
  string gateway_id = 1;
}

message GatewayConfigResponse {
  string policy_name = 1;
  bool enforce_hybrid = 2;
  int32 mtu_limit = 3;
}
```

---

## 5. Complete Repository Structure

```
finora/
├── go.mod                     # Root Go dependencies module
├── go.sum                     # Root Go checksums file
├── docker-compose.yml         # Dev cluster configs (DB, Redis, API)
│
├── sql/
│   └── schema.sql             # SQL DB tables definition
│
├── proto/
│   ├── build.sh               # Protobuf generation script
│   └── api.proto              # gRPC API schemas definitions
│
├── gateway/
│   ├── main.go                # Gateway service entrypoint
│   ├── proxy/
│   │   └── proxy.go           # Reverse Proxy HTTP middleware
│   ├── crypto/
│   │   └── circl_tls.go       # Cloudflare CIRCL custom TLS implementation
│   └── telemetry/
│       └── reporter.go        # Redis Stream metrics publisher
│
├── scanner/
│   ├── main.go                # Scanner service entrypoint
│   ├── static/
│   │   └── parser.go          # AST parser searching source files
│   └── network/
│       └── prober.go          # TCP/TLS network socket auditor
│
├── backend/
│   ├── main.go                # Backend service entrypoint
│   ├── handlers/
│   │   ├── http.go            # REST API endpoints (Dashboard UI controller)
│   │   └── grpc.go            # gRPC protocol buffer server
│   ├── database/
│   │   └── client.go          # PostgreSQL client setup & model handlers
│   └── benchmark/
│       └── worker.go          # Out-of-band Redis Stream metrics consumer
│
└── frontend/
    ├── package.json           # Next.js Node packages config
    ├── next.config.js         # Next.js web application router configuration
    ├── app/
    │   ├── layout.tsx         # Root UI Shell & CSS loading
    │   ├── page.tsx           # Dashboard main summary & charts
    │   ├── scanner/
    │   │   └── page.tsx       # Scanner trigger & CBOM results list
    │   └── gateway/
    │       └── page.tsx       # Gateway configs & cipher controls
    └── styles/
        └── globals.css        # Vanilla CSS layout theme
```

---

## 6. Frontend Pages (Next.js)

1. **Dashboard Home (`/dashboard` / `/`)**:
   * Overview cards displaying Compliance index (%), asset health metrics, and gateway statuses.
   * Real-time benchmark chart showing handshake latencies comparing standard classical curves and PQC-hybrid TLS tunnels.
2. **Scanner Management (`/scanner`)**:
   * Scan trigger form capturing target codebase directory or target network address/domain.
   * Visual table displaying the scan history, generating a Cryptographic Bill of Materials (CBOM), and listing flagged cryptographic vulnerabilities.
3. **Gateway Configuration (`/gateway`)**:
   * Policy management form toggling between active configurations (e.g., "Force Hybrid", "Allow Classical Fallback").
   * List of active gateway proxy nodes and total data volume telemetry.

---

## 7. Sprint Plan & Development Roadmap

```
Week 1: Core Cryptographic & Schema Setup
├─ Setup PostgreSQL schema & baseline Redis
├─ Implement cloudflare/circl hybrid handshake wrappers
└─ Build CLI-driven proxy server test to verify hybrid TLS works locally

Week 2: Backend Control Plane (Go REST + gRPC)
├─ Implement database client, CRUD routes for Assets & CBOM logs
├─ Implement gRPC server processing scanner submissions
└─ Create simple API test suite for dashboard endpoints

Week 3: Scanner Core & Benchmark Worker
├─ Build AST Static Code parser searching for legacy cryptographic imports
├─ Build Network Prober executing TLS handshakes
└─ Write the Out-of-band Benchmark worker reading telemetry from Redis Streams

Week 4: Frontend Development & Integration
├─ Build Next.js dashboards and CSS layout
├─ Connect Next.js APIs to Go backend REST endpoints
└─ Validate complete flow from Scanner trigger to Dashboard rendering
```

---

## 8. File-by-File Implementation Plan (MVP Execution Sequence)

To implement this systematically, here is the file-by-file roadmap:

### Phase A: Setup & Databases
1. **[sql/schema.sql](file:///c:/Users/tan/Desktop/Finora/sql/schema.sql)**: Write the base PostgreSQL DDL script.
2. **[docker-compose.yml](file:///c:/Users/tan/Desktop/Finora/docker-compose.yml)**: Define local Postgres, Redis, and application containers.
3. **[go.mod](file:///c:/Users/tan/Desktop/Finora/go.mod)**: Define dependency declarations.

### Phase B: Cryptography & Gateway
4. **[gateway/crypto/circl_tls.go](file:///c:/Users/tan/Desktop/Finora/gateway/crypto/circl_tls.go)**: Implement TLS wrapper configuring `X25519` + `ML-KEM-768` hybrid handshakes via `cloudflare/circl`.
5. **[gateway/proxy/proxy.go](file:///c:/Users/tan/Desktop/Finora/gateway/proxy/proxy.go)**: Set up the HTTP reverse proxy handler logic.
6. **[gateway/telemetry/reporter.go](file:///c:/Users/tan/Desktop/Finora/gateway/telemetry/reporter.go)**: Connect to Redis and configure `XADD` to stream metrics parameters to `telemetry:handshakes`.
7. **[gateway/main.go](file:///c:/Users/tan/Desktop/Finora/gateway/main.go)**: Set up the server bootstrapper reading local policy configurations.

### Phase C: Backend Management Core & Telemetry Worker
8. **[proto/api.proto](file:///c:/Users/tan/Desktop/Finora/proto/api.proto)**: Create the protobuf definitions for the Gateway and Scanner telemetry interfaces.
9. **[backend/database/client.go](file:///c:/Users/tan/Desktop/Finora/backend/database/client.go)**: Implement SQL connections and models mapping.
10. **[backend/benchmark/worker.go](file:///c:/Users/tan/Desktop/Finora/backend/benchmark/worker.go)**: Write the stream listener pulling records from Redis and writing aggregates to PostgreSQL.
11. **[backend/handlers/grpc.go](file:///c:/Users/tan/Desktop/Finora/backend/handlers/grpc.go)**: Define gRPC servers handling results reported by the scanner.
12. **[backend/handlers/http.go](file:///c:/Users/tan/Desktop/Finora/backend/handlers/http.go)**: Build standard REST handlers feeding data into the frontend.
13. **[backend/main.go](file:///c:/Users/tan/Desktop/Finora/backend/main.go)**: Instantiate database client, launch stream listener, and bind HTTP/gRPC services.

### Phase D: Scanner Execution Logic
14. **[scanner/static/parser.go](file:///c:/Users/tan/Desktop/Finora/scanner/static/parser.go)**: Code the AST static analyzer inspecting source repositories for cryptography usage.
15. **[scanner/network/prober.go](file:///c:/Users/tan/Desktop/Finora/scanner/network/prober.go)**: Code the TCP socket prober checking remote port certificates.
16. **[scanner/main.go](file:///c:/Users/tan/Desktop/Finora/scanner/main.go)**: Package the CLI parameters and bind client hooks reporting back to the core Backend.

### Phase E: Dashboard Frontend
17. **[frontend/styles/globals.css](file:///c:/Users/tan/Desktop/Finora/frontend/styles/globals.css)**: Set up the styling architecture and HSL colors for dark mode.
18. **[frontend/app/layout.tsx](file:///c:/Users/tan/Desktop/Finora/frontend/app/layout.tsx)**: Establish the master sidebar, header layout, and routing contexts.
19. **[frontend/app/page.tsx](file:///c:/Users/tan/Desktop/Finora/frontend/app/page.tsx)**: Core dashboard containing summary figures, Mosca risk visualizer, and Recharts graphs.
20. **[frontend/app/scanner/page.tsx](file:///c:/Users/tan/Desktop/Finora/frontend/app/scanner/page.tsx)**: Scanner execution controls and CBOM mapping tables UI.
21. **[frontend/app/gateway/page.tsx](file:///c:/Users/tan/Desktop/Finora/frontend/app/gateway/page.tsx)**: Gateway network performance logs and policy configuration interface.
