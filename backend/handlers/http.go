package handlers

import (
	"net/http"

	"github.com/finora/mvp/backend/models"
	"github.com/finora/mvp/backend/service"
	"github.com/gin-gonic/gin"
)

type HttpHandler struct {
	svc *service.Service
}

func NewHttpHandler(svc *service.Service) *HttpHandler {
	return &HttpHandler{svc: svc}
}

func (h *HttpHandler) RegisterRoutes(r *gin.Engine) {
	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health", h.HealthCheck)
	
	v1 := r.Group("/api/v1")
	{
		v1.GET("/dashboard/summary", h.GetDashboardSummary)
		v1.GET("/assets", h.GetAssets)
		v1.POST("/assets", h.CreateAsset)
		v1.POST("/scanner/results", h.SaveScanResults)
		v1.POST("/handshake/logs", h.SaveHandshakeLog)
	}
}

func (h *HttpHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status": "healthy",
	})
}

func (h *HttpHandler) GetDashboardSummary(c *gin.Context) {
	summary, err := h.svc.GetDashboardSummary(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, summary)
}

func (h *HttpHandler) GetAssets(c *gin.Context) {
	assets, err := h.svc.GetAssets(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, assets)
}

type CreateAssetRequest struct {
	Name               string `json:"name" binding:"required"`
	Type               string `json:"type" binding:"required"`
	NetworkZone        string `json:"network_zone" binding:"required"`
	DataShelfLifeYears int    `json:"data_shelf_life_years" binding:"required"`
	MigrationTimeYears int    `json:"migration_time_years" binding:"required"`
}

func (h *HttpHandler) CreateAsset(c *gin.Context) {
	var req CreateAssetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	asset, err := h.svc.CreateAsset(c.Request.Context(), req.Name, req.Type, req.NetworkZone, req.DataShelfLifeYears, req.MigrationTimeYears)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, asset)
}

type ScanResultsRequest struct {
	AssetID    string                 `json:"asset_id" binding:"required"`
	Components []models.CbomComponent `json:"components"`
	Violations []models.Violation     `json:"violations"`
}

func (h *HttpHandler) SaveScanResults(c *gin.Context) {
	var req ScanResultsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.svc.SaveScanResults(c.Request.Context(), req.AssetID, req.Components, req.Violations)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "results saved successfully"})
}

type HandshakeLogRequest struct {
	AssetID             *string `json:"asset_id"`
	ClientIP            string  `json:"client_ip" binding:"required"`
	ProtocolVersion     string  `json:"protocol_version" binding:"required"`
	KeyExchangeType     string  `json:"key_exchange_type" binding:"required"`
	HandshakeDurationMs float64 `json:"handshake_duration_ms" binding:"required"`
	BytesSent           int     `json:"bytes_sent" binding:"required"`
	BytesReceived       int     `json:"bytes_received" binding:"required"`
	PacketFragmented    bool    `json:"packet_fragmented"`
}

func (h *HttpHandler) SaveHandshakeLog(c *gin.Context) {
	var req HandshakeLogRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	logEntry := models.HandshakeLog{
		AssetID:             req.AssetID,
		ClientIP:            req.ClientIP,
		ProtocolVersion:     req.ProtocolVersion,
		KeyExchangeType:     req.KeyExchangeType,
		HandshakeDurationMs: req.HandshakeDurationMs,
		BytesSent:           req.BytesSent,
		BytesReceived:       req.BytesReceived,
		PacketFragmented:    req.PacketFragmented,
	}

	err := h.svc.RecordHandshakeLog(c.Request.Context(), &logEntry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, logEntry)
}
