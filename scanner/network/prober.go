package network

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"time"
)

type NetworkScanResult struct {
	TargetHost    string
	IsQuantumSafe bool
	CipherSuite   string
	TlsVersion    string
	Severity      string
	Description   string
}

// ProbeEndpoint establishes a TLS connection to check TLS version and cipher suites.
func ProbeEndpoint(host string, port string) (*NetworkScanResult, error) {
	address := net.JoinHostPort(host, port)
	log.Printf("[INFO] Auditing network TLS configuration for target: %s", address)

	dialer := &net.Dialer{
		Timeout: 5 * time.Second,
	}

	// Connect using standard client TLS configuration
	conn, err := tls.DialWithDialer(dialer, "tcp", address, &tls.Config{
		InsecureSkipVerify: true, // Audit connections even if self-signed cert is used
	})
	if err != nil {
		return &NetworkScanResult{
			TargetHost:    host,
			IsQuantumSafe: false,
			Severity:      "high",
			Description:   fmt.Sprintf("Failed to establish TLS connection: %v", err),
		}, nil
	}
	defer conn.Close()

	state := conn.ConnectionState()
	tlsVersionStr := getTLSVersionString(state.Version)
	cipherSuiteStr := tls.CipherSuiteName(state.CipherSuite)

	// Check if the connection uses a hybrid cipher suite (non-standard custom ciphers in MVP)
	isQuantumSafe := false
	description := fmt.Sprintf("Endpoint supports standard classical TLS version %s and cipher suite %s. Vulnerable to harvest-now-decrypt-later attacks.", tlsVersionStr, cipherSuiteStr)
	severity := "high"

	// If TLS version is less than TLS 1.3, raise severity
	if state.Version < tls.VersionTLS13 {
		severity = "critical"
		description = fmt.Sprintf("Endpoint uses outdated TLS protocol version %s. Highly vulnerable to handshake tampering.", tlsVersionStr)
	}

	return &NetworkScanResult{
		TargetHost:    host,
		IsQuantumSafe: isQuantumSafe,
		CipherSuite:   cipherSuiteStr,
		TlsVersion:    tlsVersionStr,
		Severity:      severity,
		Description:   description,
	}, nil
}

func getTLSVersionString(ver uint16) string {
	switch ver {
	case tls.VersionTLS10:
		return "TLS 1.0"
	case tls.VersionTLS11:
		return "TLS 1.1"
	case tls.VersionTLS12:
		return "TLS 1.2"
	case tls.VersionTLS13:
		return "TLS 1.3"
	default:
		return fmt.Sprintf("Unknown (%x)", ver)
	}
}
