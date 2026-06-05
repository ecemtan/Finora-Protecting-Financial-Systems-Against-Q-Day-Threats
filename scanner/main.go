package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/finora/mvp/scanner/network"
	"github.com/finora/mvp/scanner/static"
)

type ScanResultsPayload struct {
	AssetID    string          `json:"asset_id"`
	Components []CbomComponent `json:"components"`
	Violations []Violation     `json:"violations"`
}

type CbomComponent struct {
	FilePathOrUrl string `json:"file_path_or_url"`
	Category      string `json:"category"`
	AlgorithmUsed string `json:"algorithm_used"`
	IsQuantumSafe bool   `json:"is_quantum_safe"`
}

type Violation struct {
	Severity    string `json:"severity"`
	Description string `json:"description"`
	Status      string `json:"status"`
}

func main() {
	log.Println("[INFO] Launching Finora Quantum Readiness Scanner MVP...")

	pathPtr := flag.String("path", "", "Local path to scan for static cryptography files")
	hostPtr := flag.String("host", "", "Remote target hostname to audit TLS network configuration")
	portPtr := flag.String("port", "443", "Target network port")
	backendPtr := flag.String("backend", "http://localhost:8080", "Finora Backend API base URL")
	assetIdPtr := flag.String("asset-id", "", "ID of the registered asset to link scanner findings to")
	demoPtr := flag.Bool("demo", false, "Execute in self-contained demo mode (generates mock vulnerable codebase files)")

	flag.Parse()

	var assetID string
	if *assetIdPtr != "" {
		assetID = *assetIdPtr
	} else {
		// Try to fallback to dummy asset or fetch from backend
		assetID = "b1822c71-2e6f-4c9e-9d2a-8f5a43b10684" // Default dummy core asset ID
	}

	payload := ScanResultsPayload{
		AssetID: assetID,
	}

	if *demoPtr {
		log.Println("[INFO] Running in Demo Scan Mode...")
		// 1. Create a temporary folder and write mock vulnerable code files
		tempDir, err := ioutil.TempDir("", "finora-scanner-demo")
		if err != nil {
			log.Fatalf("[FATAL] Failed to create temp directory for demo: %v", err)
		}
		defer os.RemoveAll(tempDir)

		log.Printf("[INFO] Creating mock vulnerable assets inside temp folder: %s", tempDir)
		setupMockDemoFiles(tempDir)

		// 2. Scan temp folder
		staticResults, err := static.ScanDirectory(tempDir)
		if err != nil {
			log.Fatalf("[FATAL] Demo static scan failed: %v", err)
		}

		for _, res := range staticResults {
			// Clean up filepath so it looks nice
			displayPath := filepath.Base(res.FilePath)
			payload.Components = append(payload.Components, CbomComponent{
				FilePathOrUrl: "demo/" + displayPath,
				Category:      res.Category,
				AlgorithmUsed: res.AlgorithmUsed,
				IsQuantumSafe: res.IsQuantumSafe,
			})
			payload.Violations = append(payload.Violations, Violation{
				Severity:    res.Severity,
				Description: res.Description,
				Status:      "unresolved",
			})
		}
	} else {
		// Run Static Directory Scan if path is supplied
		if *pathPtr != "" {
			staticResults, err := static.ScanDirectory(*pathPtr)
			if err != nil {
				log.Fatalf("[FATAL] Static directory scan failed: %v", err)
			}

			for _, res := range staticResults {
				payload.Components = append(payload.Components, CbomComponent{
					FilePathOrUrl: res.FilePath,
					Category:      res.Category,
					AlgorithmUsed: res.AlgorithmUsed,
					IsQuantumSafe: res.IsQuantumSafe,
				})
				payload.Violations = append(payload.Violations, Violation{
					Severity:    res.Severity,
					Description: res.Description,
					Status:      "unresolved",
				})
			}
		}

		// Run Network Prober Scan if host is supplied
		if *hostPtr != "" {
			netResult, err := network.ProbeEndpoint(*hostPtr, *portPtr)
			if err != nil {
				log.Fatalf("[FATAL] Network endpoint probe failed: %v", err)
			}

			payload.Components = append(payload.Components, CbomComponent{
				FilePathOrUrl: fmt.Sprintf("https://%s:%s", *hostPtr, *portPtr),
				Category:      "network_protocol",
				AlgorithmUsed: netResult.CipherSuite,
				IsQuantumSafe: netResult.IsQuantumSafe,
			})
			payload.Violations = append(payload.Violations, Violation{
				Severity:    netResult.Severity,
				Description: netResult.Description,
				Status:      "unresolved",
			})
		}
	}

	// 3. Report findings back to Backend REST API
	if len(payload.Components) > 0 {
		reportScannerResults(*backendPtr, payload)
	} else {
		log.Println("[INFO] Scan completed. No cryptographic items found.")
	}
}

func setupMockDemoFiles(tempDir string) {
	// Vulnerable file 1: Go payment file containing MD5 and RSA
	goCode := `package payment
import (
	"crypto/md5"
	"crypto/rsa"
	"crypto/rand"
)
func SignPayment() {
	h := md5.New()
	h.Write([]byte("payment-data"))
	key, _ := rsa.GenerateKey(rand.Reader, 2048)
}
`
	_ = ioutil.WriteFile(filepath.Join(tempDir, "payment.go"), []byte(goCode), 0644)

	// Vulnerable file 2: Python signing service with ECDSA
	pythonCode := `import ecdsa
def sign_transaction():
    sk = ecdsa.SigningKey.generate(curve=ecdsa.NIST256p)
    vk = sk.verifying_key
`
	_ = ioutil.WriteFile(filepath.Join(tempDir, "signing_service.py"), []byte(pythonCode), 0644)

	// Vulnerable file 3: SSL configuration with TLS 1.0
	yamlConfig := `server:
  tls:
    min_version: VersionTLS10
    ciphers:
      - SSLv3
`
	_ = ioutil.WriteFile(filepath.Join(tempDir, "config.yaml"), []byte(yamlConfig), 0644)
}

func reportScannerResults(backendURL string, payload ScanResultsPayload) {
	apiURL := fmt.Sprintf("%s/api/v1/scanner/results", backendURL)
	log.Printf("[INFO] Reporting %d CBOM components and %d violations to backend: %s", 
		len(payload.Components), len(payload.Violations), apiURL)

	body, err := json.Marshal(payload)
	if err != nil {
		log.Fatalf("[FATAL] Failed to marshal scanner results: %v", err)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(body))
	if err != nil {
		log.Fatalf("[FATAL] Failed to create HTTP request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[ERROR] Backend REST API is unreachable: %v. Outputting results to stdout instead.", err)
		printResultsStdout(payload)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := ioutil.ReadAll(resp.Body)
		log.Printf("[ERROR] Backend rejected scanner reports (Status: %d): %s", resp.StatusCode, string(respBody))
		return
	}

	log.Println("[INFO] Successfully logged scanner results to backend database.")
}

func printResultsStdout(payload ScanResultsPayload) {
	fmt.Println("\n================= SCANNER REPORT (STDOUT FALLBACK) =================")
	fmt.Printf("Asset ID: %s\n\n", payload.AssetID)
	fmt.Println("--- Cryptographic Bill of Materials (CBOM) ---")
	for _, comp := range payload.Components {
		fmt.Printf("File/URL: %s | Algorithm: %s | Category: %s | Quantum Safe: %t\n",
			comp.FilePathOrUrl, comp.AlgorithmUsed, comp.Category, comp.IsQuantumSafe)
	}
	fmt.Println("\n--- Security Policy Violations ---")
	for _, viol := range payload.Violations {
		fmt.Printf("[%s] %s\n", strings.ToUpper(viol.Severity), viol.Description)
	}
	fmt.Println("====================================================================")
}
