package static

import (
	"bufio"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

type ScanResult struct {
	FilePath      string
	AlgorithmUsed string
	Category      string
	IsQuantumSafe bool
	Severity      string
	Description   string
}

// ScanDirectory walks the filesystem and checks files for weak cryptography signatures.
func ScanDirectory(rootPath string) ([]ScanResult, error) {
	var results []ScanResult

	log.Printf("[INFO] Commencing static scan of directory: %s", rootPath)

	err := filepath.WalkDir(rootPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// Skip hidden folders (e.g., .git) and binary directories
		if d.IsDir() {
			if strings.HasPrefix(d.Name(), ".") || d.Name() == "node_modules" || d.Name() == "vendor" {
				return filepath.SkipDir
			}
			return nil
		}

		// Only scan source/config code files
		ext := strings.ToLower(filepath.Ext(path))
		if ext == ".go" || ext == ".py" || ext == ".java" || ext == ".js" || ext == ".ts" || ext == ".json" || ext == ".yml" || ext == ".yaml" {
			fileResults, err := scanFile(path)
			if err != nil {
				log.Printf("[WARNING] Failed to scan file %s: %v", path, err)
				return nil // Skip file on error, do not fail entire scan
			}
			results = append(results, fileResults...)
		}

		return nil
	})

	return results, err
}

func scanFile(filePath string) ([]ScanResult, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var results []ScanResult
	scanner := bufio.NewScanner(file)
	lineNumber := 0

	for scanner.Scan() {
		lineNumber++
		line := scanner.Text()

		// 1. Detect MD5 usage
		if strings.Contains(line, "crypto/md5") || strings.Contains(line, "md5.New") || strings.Contains(line, "hash/md5") {
			results = append(results, ScanResult{
				FilePath:      filePath,
				AlgorithmUsed: "MD5",
				Category:      "hashing",
				IsQuantumSafe: false,
				Severity:      "medium",
				Description:   "Weak cryptographic hash function MD5 detected on line " + strconv.Itoa(lineNumber) + ". Vulnerable to collision attacks.",
			})
		}

		// 2. Detect SHA1 usage
		if strings.Contains(line, "crypto/sha1") || strings.Contains(line, "sha1.New") || strings.Contains(line, "hash/sha1") {
			results = append(results, ScanResult{
				FilePath:      filePath,
				AlgorithmUsed: "SHA1",
				Category:      "hashing",
				IsQuantumSafe: false,
				Severity:      "medium",
				Description:   "Outdated cryptographic hash function SHA1 detected on line " + strconv.Itoa(lineNumber) + ". Vulnerable to collision attacks.",
			})
		}

		// 3. Detect RSA usage (vulnerable to Shor's algorithm)
		if strings.Contains(line, "crypto/rsa") || strings.Contains(line, "rsa.GenerateKey") || strings.Contains(line, "BEGIN RSA PRIVATE KEY") {
			results = append(results, ScanResult{
				FilePath:      filePath,
				AlgorithmUsed: "RSA",
				Category:      "asymmetric_encryption",
				IsQuantumSafe: false,
				Severity:      "high",
				Description:   "Classical asymmetric algorithm RSA detected on line " + strconv.Itoa(lineNumber) + ". Vulnerable to quantum decrypt-later attacks.",
			})
		}

		// 4. Detect ECDSA usage (vulnerable to Shor's algorithm)
		if strings.Contains(line, "crypto/ecdsa") || strings.Contains(line, "ecdsa.GenerateKey") || strings.Contains(line, "elliptic.P256") {
			results = append(results, ScanResult{
				FilePath:      filePath,
				AlgorithmUsed: "ECDSA",
				Category:      "digital_signature",
				IsQuantumSafe: false,
				Severity:      "critical",
				Description:   "Classical elliptic curve algorithm ECDSA detected on line " + strconv.Itoa(lineNumber) + ". Vulnerable to quantum key cracking and forgery.",
			})
		}

		// 5. Detect weak TLS configs
		if strings.Contains(line, "VersionTLS10") || strings.Contains(line, "VersionTLS11") || strings.Contains(line, "VersionTLS12") || strings.Contains(line, "SSLv3") {
			results = append(results, ScanResult{
				FilePath:      filePath,
				AlgorithmUsed: "Weak TLS Version",
				Category:      "protocol_security",
				IsQuantumSafe: false,
				Severity:      "high",
				Description:   "Insecure/Classical protocol configurations (SSLv3/TLS1.0/TLS1.1/TLS1.2) detected on line " + strconv.Itoa(lineNumber) + ". Upgrade to hybrid TLS 1.3.",
			})
		}
	}

	return results, scanner.Err()
}
