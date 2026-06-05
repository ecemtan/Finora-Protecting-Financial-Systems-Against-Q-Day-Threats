"use client";

import React from 'react';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import {
  Gauge, Zap, Clock, CheckCircle, TrendingUp, Download
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

const kemData = [
  { algo: 'ML-KEM-512', keygen: 0.12, encaps: 0.15, decaps: 0.18 },
  { algo: 'ML-KEM-768', keygen: 0.19, encaps: 0.22, decaps: 0.28 },
  { algo: 'ML-KEM-1024', keygen: 0.28, encaps: 0.31, decaps: 0.38 },
  { algo: 'BIKE-L1', keygen: 1.2, encaps: 0.45, decaps: 2.1 },
  { algo: 'HQC-128', keygen: 0.35, encaps: 0.52, decaps: 0.68 },
];

const sigData = [
  { algo: 'ML-DSA-44', keygen: 0.15, sign: 0.42, verify: 0.12 },
  { algo: 'ML-DSA-65', keygen: 0.22, sign: 0.58, verify: 0.18 },
  { algo: 'ML-DSA-87', keygen: 0.35, sign: 0.85, verify: 0.28 },
  { algo: 'SLH-DSA-128f', keygen: 0.08, sign: 12.5, verify: 0.45 },
  { algo: 'FALCON-512', keygen: 8.2, sign: 0.32, verify: 0.08 },
];

const throughputTrend = [
  { time: '00:00', ops: 1250 }, { time: '04:00', ops: 1180 },
  { time: '08:00', ops: 1420 }, { time: '12:00', ops: 1380 },
  { time: '16:00', ops: 1520 }, { time: '20:00', ops: 1450 },
  { time: '24:00', ops: 1490 },
];

const latencyComparison = [
  { name: 'RSA-2048', value: 0.89, color: 'var(--red)' },
  { name: 'ECDSA P-256', value: 0.34, color: '#ff8c00' },
  { name: 'ML-KEM-768', value: 0.22, color: 'var(--gold)' },
  { name: 'ML-DSA-65', value: 0.58, color: 'var(--blue)' },
  { name: 'AES-256', value: 0.02, color: 'var(--green)' },
];

export default function BenchmarkPage() {
  return (
    <div className="dashboard-layout">
      <SectionHeader
        title="Benchmark Center"
        subtitle="PQC algorithm performance benchmarks and comparison analysis."
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer' }}>
            <Download size={16} /> Export Results
          </button>
        }
      />

      {/* KPI Row */}
      <div className="kpi-row">
        <StatCard title="Benchmark Score" value="94.2" icon={<Gauge size={22} />} color="gold" subtitle="Overall performance" trend="↑ 2.1% vs baseline" trendDirection="up" />
        <StatCard title="Avg Throughput" value="1,490" icon={<Zap size={22} />} color="green" subtitle="Ops/sec" trend="↑ 8.3% improvement" trendDirection="up" />
        <StatCard title="Crypto Ops/sec" value="12.4K" icon={<TrendingUp size={22} />} color="blue" subtitle="Peak performance" trend="↑ 15% vs last run" trendDirection="up" />
        <StatCard title="Avg Latency" value="0.22ms" icon={<Clock size={22} />} color="gold" subtitle="ML-KEM-768" trend="↓ 12% faster" trendDirection="up" />
        <StatCard title="Success Rate" value="99.97%" icon={<CheckCircle size={22} />} color="green" subtitle="All algorithms" trend="✓ Stable" trendDirection="up" />
      </div>

      {/* Middle Row: KEM Performance + Signature Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* KEM Performance Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">KEM Performance (ms)</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Key Encapsulation Mechanisms</span>
          </div>
          <table className="data-table" style={{ marginBottom: '0' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 12px' }}>Algorithm</th>
                <th style={{ padding: '10px 12px' }}>KeyGen</th>
                <th style={{ padding: '10px 12px' }}>Encaps</th>
                <th style={{ padding: '10px 12px' }}>Decaps</th>
              </tr>
            </thead>
            <tbody>
              {kemData.map(row => (
                <tr key={row.algo}>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--gold)' }}>{row.algo}</td>
                  <td style={{ padding: '10px 12px', color: row.keygen < 0.3 ? 'var(--green)' : 'var(--red)' }}>{row.keygen}</td>
                  <td style={{ padding: '10px 12px', color: row.encaps < 0.4 ? 'var(--green)' : '#ff8c00' }}>{row.encaps}</td>
                  <td style={{ padding: '10px 12px', color: row.decaps < 0.5 ? 'var(--green)' : 'var(--red)' }}>{row.decaps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature Performance Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Signature Performance (ms)</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Digital Signature Algorithms</span>
          </div>
          <table className="data-table" style={{ marginBottom: '0' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 12px' }}>Algorithm</th>
                <th style={{ padding: '10px 12px' }}>KeyGen</th>
                <th style={{ padding: '10px 12px' }}>Sign</th>
                <th style={{ padding: '10px 12px' }}>Verify</th>
              </tr>
            </thead>
            <tbody>
              {sigData.map(row => (
                <tr key={row.algo}>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--gold)' }}>{row.algo}</td>
                  <td style={{ padding: '10px 12px', color: row.keygen < 0.5 ? 'var(--green)' : 'var(--red)' }}>{row.keygen}</td>
                  <td style={{ padding: '10px 12px', color: row.sign < 1 ? 'var(--green)' : 'var(--red)' }}>{row.sign}</td>
                  <td style={{ padding: '10px 12px', color: row.verify < 0.3 ? 'var(--green)' : '#ff8c00' }}>{row.verify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Throughput Trend + Latency Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
        {/* Throughput Trend */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Throughput Trend (Ops/sec)</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last 24 hours</span>
          </div>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="ops" stroke="var(--gold)" strokeWidth={2} dot={{ r: 3, fill: 'var(--gold)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Comparison */}
        <div className="panel-card">
          <h2 className="panel-title" style={{ marginBottom: '16px' }}>Algorithm Latency Comparison</h2>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyComparison} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} unit=" ms" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} />
                <Bar dataKey="value" barSize={14} radius={[0, 4, 4, 0]}>
                  {latencyComparison.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
