"use client";

import React from 'react';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import {
  Server, Globe, Shield, Database, Layers, Network,
  Cloud, Lock, Cpu, HardDrive, ArrowRight, Hexagon
} from 'lucide-react';

const layers = [
  {
    name: 'Client Layer',
    icon: Globe,
    color: 'var(--blue)',
    description: 'Web & mobile clients with hybrid TLS 1.3 connections using ML-KEM key exchange.',
    components: ['React Dashboard', 'Mobile SDK', 'REST Client', 'WebSocket Client'],
  },
  {
    name: 'API Gateway',
    icon: Network,
    color: 'var(--gold)',
    description: 'Nginx-based gateway with PQC-enabled TLS termination, rate limiting, and request routing.',
    components: ['TLS Terminator', 'Rate Limiter', 'Auth Proxy', 'Load Balancer'],
  },
  {
    name: 'Core Services',
    icon: Cpu,
    color: 'var(--green)',
    description: 'Go microservices handling scanning, benchmarking, readiness assessment, and SOC operations.',
    components: ['Scanner Engine', 'Benchmark Runner', 'Readiness Analyzer', 'Alert Engine'],
  },
  {
    name: 'Security Layer',
    icon: Shield,
    color: 'var(--red)',
    description: 'Post-quantum cryptographic operations: key management, signature verification, and certificate handling.',
    components: ['PQC Key Manager', 'Certificate Authority', 'HSM Integration', 'KEM/DSA Engine'],
  },
  {
    name: 'Data Layer',
    icon: Database,
    color: '#ff8c00',
    description: 'PostgreSQL with AES-256-GCM encryption at rest, Redis for caching, and S3-compatible object storage.',
    components: ['PostgreSQL', 'Redis Cache', 'Object Storage', 'Backup Vault'],
  },
];

const techStack = [
  { category: 'Frontend', technology: 'Next.js 15 + React 19', purpose: 'Dashboard UI', status: 'Production' },
  { category: 'Backend', technology: 'Go 1.22', purpose: 'API & Services', status: 'Production' },
  { category: 'Crypto Library', technology: 'liboqs + Go bindings', purpose: 'PQC Operations', status: 'Production' },
  { category: 'Database', technology: 'PostgreSQL 16', purpose: 'Persistent Storage', status: 'Production' },
  { category: 'Cache', technology: 'Redis 7', purpose: 'Session & Cache', status: 'Production' },
  { category: 'Gateway', technology: 'Nginx + OpenSSL 3.2', purpose: 'TLS Termination', status: 'Production' },
  { category: 'Container', technology: 'Docker + K8s', purpose: 'Orchestration', status: 'Staging' },
  { category: 'Monitoring', technology: 'Prometheus + Grafana', purpose: 'Observability', status: 'Production' },
];

const dataFlow = [
  { label: 'Client', icon: Globe },
  { label: 'TLS 1.3 + ML-KEM', icon: Lock },
  { label: 'API Gateway', icon: Network },
  { label: 'Auth & Rate Limit', icon: Shield },
  { label: 'Core Services', icon: Cpu },
  { label: 'PQC Engine', icon: Hexagon },
  { label: 'Data Store', icon: Database },
];

export default function ArchitecturePage() {
  return (
    <div className="dashboard-layout">
      <SectionHeader
        title="System Architecture"
        subtitle="Finora platform architecture overview and component topology."
      />

      {/* KPI Row */}
      <div className="kpi-row">
        <StatCard title="Total Services" value="12" icon={<Server size={22} />} color="gold" subtitle="Microservices" />
        <StatCard title="API Endpoints" value="48" icon={<Globe size={22} />} color="blue" subtitle="REST + WebSocket" />
        <StatCard title="Data Stores" value="3" icon={<HardDrive size={22} />} color="green" subtitle="PostgreSQL, Redis, S3" />
        <StatCard title="Security Layers" value="4" icon={<Shield size={22} />} color="red" subtitle="Defense in depth" />
        <StatCard title="PQC Algorithms" value="6" icon={<Layers size={22} />} color="gold" subtitle="KEM + DSA" />
      </div>

      {/* Data Flow Stepper */}
      <div className="panel-card">
        <h2 className="panel-title" style={{ marginBottom: '24px' }}>Data Flow</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', flexWrap: 'wrap' }}>
          {dataFlow.map((step, i) => (
            <React.Fragment key={step.label}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                padding: '16px 20px', background: 'var(--bg-app)', borderRadius: '10px',
                border: '1px solid var(--border-gold)', minWidth: '110px',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--gold-glow)', border: '1px solid var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)',
                }}>
                  <step.icon size={20} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-main)', textAlign: 'center' }}>{step.label}</span>
              </div>
              {i < dataFlow.length - 1 && (
                <ArrowRight size={20} style={{ color: 'var(--gold)', margin: '0 4px', flexShrink: 0 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Layer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
        {layers.map(layer => (
          <div key={layer.name} className="panel-card" style={{ borderColor: layer.color, borderWidth: '1px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: `${layer.color}15`, border: `1px solid ${layer.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: layer.color,
              }}>
                <layer.icon size={20} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: layer.color }}>{layer.name}</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>{layer.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {layer.components.map(comp => (
                <span key={comp} style={{
                  padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
                  color: 'var(--text-main)', background: 'var(--bg-app)', border: '1px solid var(--border-color)',
                }}>
                  {comp}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Technology Stack Table */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '16px' }}>
          <h2 className="panel-title">Technology Stack</h2>
        </div>
        <table className="data-table">
          <thead style={{ background: 'var(--bg-app)' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Technology</th>
              <th style={{ padding: '12px 16px' }}>Purpose</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {techStack.map(row => (
              <tr key={row.category}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--gold)' }}>{row.category}</td>
                <td style={{ padding: '12px 16px' }}>{row.technology}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{row.purpose}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
                    color: row.status === 'Production' ? 'var(--green)' : 'var(--gold)',
                    background: row.status === 'Production' ? 'rgba(82,196,26,0.1)' : 'rgba(255,215,0,0.1)',
                    border: `1px solid ${row.status === 'Production' ? 'rgba(82,196,26,0.2)' : 'rgba(255,215,0,0.2)'}`,
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
