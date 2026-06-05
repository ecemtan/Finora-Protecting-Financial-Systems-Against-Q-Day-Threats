"use client";

import React from 'react';
import StatCard from '@/components/StatCard';
import RiskBadge from '@/components/RiskBadge';
import SectionHeader from '@/components/SectionHeader';
import {
  ScanSearch, ShieldAlert, AlertCircle, CheckCircle2,
  Wifi, Globe, Server, Clock, Play, Download
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';

const severityData = [
  { name: 'Critical', value: 4, color: 'var(--red)' },
  { name: 'High', value: 7, color: '#ff8c00' },
  { name: 'Medium', value: 12, color: 'var(--gold)' },
  { name: 'Low', value: 9, color: 'var(--green)' },
];

const scanTypesData = [
  { type: 'TLS/SSL', count: 42 },
  { type: 'Key Exchange', count: 28 },
  { type: 'Signatures', count: 35 },
  { type: 'Certificates', count: 51 },
  { type: 'Hashing', count: 19 },
];

const recentScans = [
  { id: 'SCN-001', target: 'api.finora.io', type: 'TLS/SSL', status: 'Completed', findings: 3, severity: 'critical' as const, date: '2025-06-05 14:32' },
  { id: 'SCN-002', target: 'payment.finora.io', type: 'Certificate', status: 'Completed', findings: 1, severity: 'high' as const, date: '2025-06-05 14:28' },
  { id: 'SCN-003', target: 'auth.finora.io', type: 'Key Exchange', status: 'Running', findings: 0, severity: 'info' as const, date: '2025-06-05 14:25' },
  { id: 'SCN-004', target: 'db.finora.io', type: 'Encryption', status: 'Completed', findings: 0, severity: 'safe' as const, date: '2025-06-05 14:20' },
  { id: 'SCN-005', target: 'vpn.finora.io', type: 'Key Exchange', status: 'Completed', findings: 2, severity: 'medium' as const, date: '2025-06-05 14:15' },
  { id: 'SCN-006', target: 'mail.finora.io', type: 'Certificate', status: 'Queued', findings: 0, severity: 'info' as const, date: '2025-06-05 14:10' },
];

const networkNodes = [
  { name: 'API Gateway', status: 'Secure', algo: 'ML-KEM-768', icon: Globe },
  { name: 'Load Balancer', status: 'Vulnerable', algo: 'RSA-2048', icon: Server },
  { name: 'Auth Service', status: 'Scanning', algo: 'ECDSA P-256', icon: ShieldAlert },
  { name: 'Database Proxy', status: 'Secure', algo: 'AES-256-GCM', icon: Server },
  { name: 'CDN Edge', status: 'Vulnerable', algo: 'RSA-2048', icon: Wifi },
  { name: 'Message Queue', status: 'Secure', algo: 'AES-256', icon: Server },
];

export default function ScannerPage() {
  return (
    <div className="dashboard-layout">
      <SectionHeader
        title="Scanner Results"
        subtitle="Real-time vulnerability scanning and cryptographic asset assessment."
        action={
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer' }}>
              <Download size={16} /> Export Report
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', border: 'none', borderRadius: '6px', padding: '10px 16px', color: 'black', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              <Play size={16} strokeWidth={3} /> New Scan
            </button>
          </div>
        }
      />

      {/* KPI Row */}
      <div className="kpi-row">
        <StatCard title="Scanner Status" value="Active" icon={<ScanSearch size={22} />} color="green" subtitle="3 agents running" trend="↑ All agents online" trendDirection="up" />
        <StatCard title="Scans Completed" value="156" icon={<CheckCircle2 size={22} />} color="gold" subtitle="Last 30 days" trend="↑ 12% vs last month" trendDirection="up" />
        <StatCard title="Vulnerabilities Found" value="32" icon={<ShieldAlert size={22} />} color="orange" subtitle="Across all targets" trend="↓ 8% vs last month" trendDirection="up" />
        <StatCard title="Critical Issues" value="4" icon={<AlertCircle size={22} />} color="red" subtitle="Requires immediate action" trend="♦ 2 new this week" trendDirection="down" />
        <StatCard title="Avg Scan Time" value="2.4m" icon={<Clock size={22} />} color="blue" subtitle="Per target" trend="↓ 15% faster" trendDirection="up" />
      </div>

      {/* Middle Row: Network Scan + Severity Breakdown */}
      <div className="middle-grid">
        {/* Network Scan Card */}
        <div className="panel-card" style={{ gridColumn: 'span 2' }}>
          <div className="panel-header">
            <h2 className="panel-title">Network Scan Overview</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>6 nodes scanned</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {networkNodes.map(node => {
              const statusColor = node.status === 'Secure' ? 'var(--green)' : node.status === 'Vulnerable' ? 'var(--red)' : 'var(--gold)';
              return (
                <div key={node.name} style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: statusColor }}>
                      <node.icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-main)' }}>{node.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{node.algo}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}></div>
                    <span style={{ fontSize: '11px', color: statusColor, fontWeight: 500 }}>{node.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity Breakdown */}
        <div className="panel-card">
          <h2 className="panel-title" style={{ marginBottom: '16px' }}>Severity Breakdown</h2>
          <div style={{ height: '140px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" stroke="none">
                  {severityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            {severityData.map(s => (
              <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }}></div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-main)', fontWeight: 500 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Scan Type Distribution + Recent Scans Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
        {/* Scan Type Distribution */}
        <div className="panel-card">
          <h2 className="panel-title" style={{ marginBottom: '16px' }}>Scan Type Distribution</h2>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanTypesData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="var(--gold)" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Scans Table */}
        <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="panel-header" style={{ padding: '16px' }}>
            <h2 className="panel-title">Recent Scans</h2>
            <span style={{ fontSize: '11px', color: 'var(--gold)', cursor: 'pointer' }}>View all →</span>
          </div>
          <table className="data-table">
            <thead style={{ background: 'var(--bg-app)' }}>
              <tr>
                <th style={{ padding: '12px 16px' }}>Scan ID</th>
                <th style={{ padding: '12px 16px' }}>Target</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Findings</th>
                <th style={{ padding: '12px 16px' }}>Severity</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentScans.map(scan => (
                <tr key={scan.id}>
                  <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--gold)' }}>{scan.id}</td>
                  <td style={{ padding: '12px 16px' }}>{scan.target}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{scan.type}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                      color: scan.status === 'Completed' ? 'var(--green)' : scan.status === 'Running' ? 'var(--gold)' : 'var(--text-muted)',
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: scan.status === 'Completed' ? 'var(--green)' : scan.status === 'Running' ? 'var(--gold)' : 'var(--text-muted)',
                      }}></div>
                      {scan.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: scan.findings > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>{scan.findings}</td>
                  <td style={{ padding: '12px 16px' }}><RiskBadge level={scan.severity} /></td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{scan.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
