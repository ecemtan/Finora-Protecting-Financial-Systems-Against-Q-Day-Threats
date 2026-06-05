package proxy

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/finora/mvp/gateway/crypto"
	"github.com/finora/mvp/gateway/telemetry"
)

type GatewayProxy struct {
	proxy    *httputil.ReverseProxy
	reporter *telemetry.MetricsReporter
}

func NewGatewayProxy(targetURL string, reporter *telemetry.MetricsReporter) (*GatewayProxy, error) {
	target, err := url.Parse(targetURL)
	if err != nil {
		return nil, err
	}

	// Create a standard HTTP single-host reverse proxy
	revProxy := httputil.NewSingleHostReverseProxy(target)

	// Custom Director modification if needed to adjust headers
	originalDirector := revProxy.Director
	revProxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Header.Set("X-Forwarded-Proto", "https")
		req.Header.Set("X-Finora-Proxy", "Hybrid-Gateway-PQC")
	}

	return &GatewayProxy{
		proxy:    revProxy,
		reporter: reporter,
	}, nil
}

// ServeHTTP acts as the proxy entry point.
// On every request, it simulates a hybrid key encapsulation operation (X25519 + Kyber768),
// publishes telemetry parameters to Redis Stream, and proxies the HTTP payload downstream.
func (gp *GatewayProxy) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Skip proxy logs for health-checks
	if r.URL.Path == "/health" {
		gp.proxy.ServeHTTP(w, r)
		return
	}

	/*
	   TODO: Real TLS Integration
	   To transition from this MVP simulation to a full production TLS deployment:
	   1. Implement a custom net.Listener wrapping crypto/tls.
	   2. Leverage Go's crypto/tls Config.GetConfigForClient hook.
	   3. Link Cloudflare CIRCL's hybrid key share structures directly into the TLS Config
	      SupportedCurves list once Go natively supports custom hybrid TLS curves.
	   4. Retrieve client certificate ML-DSA signatures to validate identity via mutual TLS (mTLS).
	*/

	// 1. Run real cryptographic key encapsulation simulation
	result, err := crypto.SimulateHybridHandshake()
	if err != nil {
		log.Printf("[ERROR] Gateway hybrid key exchange simulation failed: %v", err)
		// Do not block client request on simulation failure, fail gracefully
	} else {
		// 2. Publish handshake parameters to the Redis Stream
		gp.reporter.ReportHandshake(r.Context(), result)
	}

	// 3. Proxy request downstream to the target backend server
	gp.proxy.ServeHTTP(w, r)
}
