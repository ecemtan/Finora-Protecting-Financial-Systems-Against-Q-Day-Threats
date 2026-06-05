package config

import (
	"fmt"
	"os"
)

type Config struct {
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	DBSSLMode     string
	RedisAddr     string
	HTTPPort      string
	GRPCPort      string
	GatewayPort   string
	BackendTarget string
}

func LoadConfig() *Config {
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "finora_user")
	dbPassword := getEnv("DB_PASSWORD", "finora_password")
	dbName := getEnv("DB_NAME", "finora")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	redisAddr := getEnv("REDIS_ADDR", "localhost:6379")
	httpPort := getEnv("HTTP_PORT", "8080")
	grpcPort := getEnv("GRPC_PORT", "9090")

	gatewayPort := getEnv("FINORA_GATEWAY_PORT", "8443")
	backendTarget := getEnv("FINORA_BACKEND_TARGET_URL", "http://localhost:8080")

	return &Config{
		DBHost:        dbHost,
		DBPort:        dbPort,
		DBUser:        dbUser,
		DBPassword:    dbPassword,
		DBName:        dbName,
		DBSSLMode:     dbSSLMode,
		RedisAddr:     redisAddr,
		HTTPPort:      httpPort,
		GRPCPort:      grpcPort,
		GatewayPort:   gatewayPort,
		BackendTarget: backendTarget,
	}
}

func (c *Config) DBConnString() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode)
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
