package crypto

import (
	"crypto/ecdh"
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"time"

	"github.com/cloudflare/circl/kem/schemes"
)

type HandshakeResult struct {
	DurationMs       float64
	ClassicalCipher  string
	PqcCipher        string
	BytesSent        int
	BytesReceived    int
	PacketFragmented bool
}

// SimulateHybridHandshake runs a real X25519 ECDH and ML-KEM-768 (Kyber768)
// key generation, encapsulation, and decapsulation to measure exact timing.
func SimulateHybridHandshake() (*HandshakeResult, error) {
	start := time.Now()

	// 1. Classical: X25519 ECDH
	// Generate Server key pair
	serverClassicalPriv, err := ecdh.X25519().GenerateKey(rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("failed to generate X25519 key: %w", err)
	}
	serverClassicalPub := serverClassicalPriv.PublicKey().Bytes()

	// Generate Client key pair
	clientClassicalPriv, err := ecdh.X25519().GenerateKey(rand.Reader)
	if err != nil {
		return nil, fmt.Errorf("failed to generate X25519 key: %w", err)
	}
	clientClassicalPub := clientClassicalPriv.PublicKey().Bytes()

	// Compute shared secrets
	serverClassicalSecret, err := serverClassicalPriv.ECDH(clientClassicalPriv.PublicKey())
	if err != nil {
		return nil, fmt.Errorf("failed server classical ECDH: %w", err)
	}

	// 2. Post-Quantum: ML-KEM-768 (Kyber768)
	scheme := schemes.ByName("Kyber768")
	if scheme == nil {
		return nil, fmt.Errorf("Kyber768 scheme not found in CIRCL")
	}

	// Server generates ML-KEM key pair
	serverPqcPub, serverPqcPriv, err := scheme.GenerateKeyPair()
	if err != nil {
		return nil, fmt.Errorf("failed to generate Kyber768 keys: %w", err)
	}

	// Client encapsulates to server public key
	ciphertext, _, err := scheme.Encapsulate(serverPqcPub)
	if err != nil {
		return nil, fmt.Errorf("failed Kyber768 encapsulation: %w", err)
	}

	// Server decapsulates
	serverPqcSecret, err := scheme.Decapsulate(serverPqcPriv, ciphertext)
	if err != nil {
		return nil, fmt.Errorf("failed Kyber768 decapsulation: %w", err)
	}

	// 3. Simple HKDF Extract-and-Expand Mixing Function (simulating standard hybrid KDF)
	combinedSecret := append(serverClassicalSecret, serverPqcSecret...)
	salt := []byte("finora-hybrid-salt")
	
	// HKDF-Extract
	hExtract := hmac.New(sha256.New, salt)
	hExtract.Write(combinedSecret)
	prk := hExtract.Sum(nil)

	// HKDF-Expand (derive 32-byte session key)
	hExpand := hmac.New(sha256.New, prk)
	hExpand.Write([]byte("finora-session-key-expansion-v1\x01"))
	sessionKey := hExpand.Sum(nil)

	_ = sessionKey // Session key is derived successfully!

	duration := time.Since(start).Seconds() * 1000.0 // Convert to milliseconds

	// Payload Byte size calculation:
	// - Client -> Server: Client X25519 Pub (32 B) + Client Kyber768 Ciphertext (1088 B) = 1120 B
	// - Server -> Client: Server X25519 Pub (32 B) + Server Kyber768 Pub (1184 B) = 1216 B
	bytesSent := len(serverClassicalPub) + scheme.PublicKeySize()
	bytesReceived := len(clientClassicalPub) + scheme.CiphertextSize()

	// Packet fragmentation check:
	// Standard Ethernet MTU is 1500 bytes. The handshake public key or certificate structures
	// in PQC will easily exceed MTU if certificates are signed with ML-DSA (3k+ bytes).
	// In ML-KEM key exchange alone, the packets are close to MTU, but with headers they may fragment.
	// For simulation, we flag true if packet size exceeds 1400 bytes.
	packetFragmented := (bytesSent > 1400) || (bytesReceived > 1400)

	return &HandshakeResult{
		DurationMs:       duration,
		ClassicalCipher:  "X25519",
		PqcCipher:        "ML-KEM-768",
		BytesSent:        bytesSent,
		BytesReceived:    bytesReceived,
		PacketFragmented: packetFragmented,
	}, nil
}
