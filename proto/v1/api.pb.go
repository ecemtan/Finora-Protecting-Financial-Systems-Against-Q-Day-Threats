package v1

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// CbomItem represents an item in the CBOM
type CbomItem struct {
	FilePathOrUrl        string `json:"file_path_or_url,omitempty"`
	Category             string `json:"category,omitempty"`
	AlgorithmUsed        string `json:"algorithm_used,omitempty"`
	IsQuantumSafe        bool   `json:"is_quantum_safe,omitempty"`
	ViolationSeverity    string `json:"violation_severity,omitempty"`
	ViolationDescription string `json:"violation_description,omitempty"`
}

// ScanReportRequest is the payload for ReportScanResults
type ScanReportRequest struct {
	AssetId string      `json:"asset_id,omitempty"`
	Items   []*CbomItem `json:"items,omitempty"`
}

// ScanReportResponse is the response for ReportScanResults
type ScanReportResponse struct {
	Success            bool  `json:"success,omitempty"`
	ViolationsRecorded int32 `json:"violations_recorded,omitempty"`
}

// GatewayConfigRequest is the query for gateway configs
type GatewayConfigRequest struct {
	GatewayId string `json:"gateway_id,omitempty"`
}

// GatewayConfigResponse is the return payload for gateway configs
type GatewayConfigResponse struct {
	PolicyName    string `json:"policy_name,omitempty"`
	EnforceHybrid bool   `json:"enforce_hybrid,omitempty"`
	MtuLimit      int32  `json:"mtu_limit,omitempty"`
}

// TelemetryServiceClient is the client API for TelemetryService service.
type TelemetryServiceClient interface {
	ReportScanResults(ctx context.Context, in *ScanReportRequest, opts ...grpc.CallOption) (*ScanReportResponse, error)
	GetGatewayConfig(ctx context.Context, in *GatewayConfigRequest, opts ...grpc.CallOption) (*GatewayConfigResponse, error)
}

type telemetryServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewTelemetryServiceClient(cc grpc.ClientConnInterface) TelemetryServiceClient {
	return &telemetryServiceClient{cc}
}

func (c *telemetryServiceClient) ReportScanResults(ctx context.Context, in *ScanReportRequest, opts ...grpc.CallOption) (*ScanReportResponse, error) {
	out := new(ScanReportResponse)
	err := c.cc.Invoke(ctx, "/finora.mvp.v1.TelemetryService/ReportScanResults", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *telemetryServiceClient) GetGatewayConfig(ctx context.Context, in *GatewayConfigRequest, opts ...grpc.CallOption) (*GatewayConfigResponse, error) {
	out := new(GatewayConfigResponse)
	err := c.cc.Invoke(ctx, "/finora.mvp.v1.TelemetryService/GetGatewayConfig", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// TelemetryServiceServer is the server API for TelemetryService service.
type TelemetryServiceServer interface {
	ReportScanResults(context.Context, *ScanReportRequest) (*ScanReportResponse, error)
	GetGatewayConfig(context.Context, *GatewayConfigRequest) (*GatewayConfigResponse, error)
}

// UnimplementedTelemetryServiceServer must be embedded to have forward compatible implementations.
type UnimplementedTelemetryServiceServer struct{}

func (UnimplementedTelemetryServiceServer) ReportScanResults(context.Context, *ScanReportRequest) (*ScanReportResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method ReportScanResults not implemented")
}

func (UnimplementedTelemetryServiceServer) GetGatewayConfig(context.Context, *GatewayConfigRequest) (*GatewayConfigResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetGatewayConfig not implemented")
}

func RegisterTelemetryServiceServer(s grpc.ServiceRegistrar, srv TelemetryServiceServer) {
	s.RegisterService(&TelemetryService_ServiceDesc, srv)
}

func _TelemetryService_ReportScanResults_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ScanReportRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TelemetryServiceServer).ReportScanResults(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/finora.mvp.v1.TelemetryService/ReportScanResults",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TelemetryServiceServer).ReportScanResults(ctx, req.(*ScanReportRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _TelemetryService_GetGatewayConfig_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GatewayConfigRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(TelemetryServiceServer).GetGatewayConfig(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/finora.mvp.v1.TelemetryService/GetGatewayConfig",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(TelemetryServiceServer).GetGatewayConfig(ctx, req.(*GatewayConfigRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var TelemetryService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "finora.mvp.v1.TelemetryService",
	HandlerType: (*TelemetryServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "ReportScanResults",
			Handler:    _TelemetryService_ReportScanResults_Handler,
		},
		{
			MethodName: "GetGatewayConfig",
			Handler:    _TelemetryService_GetGatewayConfig_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "proto/api.proto",
}
