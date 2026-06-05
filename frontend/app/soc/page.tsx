"use client";

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/StatCard';
import RiskBadge from '@/components/RiskBadge';
import SectionHeader from '@/components/SectionHeader';
import {
  AlertTriangle, AlertCircle, Bell, Info, Activity,
  Clock, Shield, Wifi, Server, Database, Eye
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';

const alertSeverityData = [
  { name: 'Critical', value: 3, color: 'var(--red)' },
  { name: 'Warning', value: 8, color: '#ff8c00' },
  { name: 'Informational', value: 24, color: 'var(--blue)' },
  { name: 'Low', value: 12, color: 'var(--green)' },
];

const eventTrend = [
  { time: '12:00', events: 45 }, { time: '12:05', events: 52 },
  { time: '12:10', events: 38 }, { time: '12:15', events: 67 },
  { time: '12:20', events: 43 }, { time: '12:25', events: 58 },
  { time: '12:30', events: 71 }, { time: '12:35', events: 49 },
  { time: '12:40', events: 62 }, { time: '12:45', events: 55 },
];

const liveEvents = [
  { time: '12:45:32', source: 'API Gateway', message: 'Hybrid TLS handshake completed – ML-KEM-768', severity: 'info' as const, icon: Shield },
  { time: '12:45:28', source: 'IDS Sensor', message: 'Unusual key exchange pattern detected on port 8443', severity: 'warning' as const, icon: AlertTriangle },
  { time: '12:45:21', source: 'Auth Service', message: 'Failed authentication attempt – legacy RSA token', severity: 'critical' as const, icon: AlertCircle },
  { time: '12:45:18', source: 'Scanner Agent', message: 'Vulnerability scan completed: payment.finora.io', severity: 'info' as const, icon: Activity },
  { time: '12:45:12', source: 'Firewall', message: 'Rate limit applied: 150 req/s from 10.0.3.42', severity: 'warning' as const, icon: Wifi },
  { time: '12:45:05', source: 'Database', message: 'Encryption key rotation successful – AES-256-GCM', severity: 'info' as const, icon: Database },
  { time: '12:44:58', source: 'VPN Tunnel', message: 'DH-2048 key exchange – quantum vulnerability alert', severity: 'critical' as const, icon: AlertCircle },
  { time: '12:44:51', source: 'Load Balancer', message: 'Health check passed – all backends responding', severity: 'low' as const, icon: Server },
];

const criticalAlerts = [
  { id: 'ALR-001', source: 'Auth Service', message: 'Failed authentication – legacy RSA token rejected', time: '12:45:21', status: 'Open' },
  { id: 'ALR-002', source: 'VPN Tunnel', message: 'DH-2048 key exchange – quantum vulnerable', time: '12:44:58', status: 'Open' },
  { id: 'ALR-003', source: 'Payment GW', message: 'Certificate expiry in 48 hours – RSA-2048', time: '12:40:15', status: 'Acknowledged' },
];

export default function SOCPage() {
  const [time, setTime] = useState('12:45:32');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toISOString().substring(11, 19));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-layout">
      <SectionHeader
        title="Live Monitor (SOC)"
        subtitle="Real-time security operations center and event monitoring."
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '12px', color: 'var(--green)' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--green)', borderRadius: '50%', boxShadow: '0 0 8px var(--green)' }}></div>
              Live Monitoring Active
            </div>
            <div style={{ padding: '6px 12px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              {time} UTC
            </div>
          </div>
        }
      />

      {/* KPI Row */}
      <div className="kpi-row">
        <StatCard title="Total Alerts" value="47" icon={<Bell size={22} />} color="gold" subtitle="Last 24 hours" trend="↑ 12 new today" trendDirection="neutral" />
        <StatCard title="Critical" value="3" icon={<AlertCircle size={22} />} color="red" subtitle="Requires action" trend="♦ 1 new in last hour" trendDirection="down" />
        <StatCard title="Warnings" value="8" icon={<AlertTriangle size={22} />} color="orange" subtitle="Under review" trend="↓ 3 resolved today" trendDirection="up" />
        <StatCard title="Informational" value="24" icon={<Info size={22} />} color="blue" subtitle="Logged" trend="↑ Normal activity" trendDirection="up" />
        <StatCard title="Avg Response" value="2.3m" icon={<Clock size={22} />} color="green" subtitle="Mean time to respond" trend="↓ 18% faster" trendDirection="up" />
      </div>

      {/* Middle Row: Live Events Feed + Severity + Event Trend */}
      <div className="middle-grid">
        {/* Live Events Feed */}
        <div className="panel-card" style={{ gridColumn: 'span 1', maxHeight: '400px', overflow: 'hidden' }}>
          <div className="panel-header">
            <h2 className="panel-title">Live Event Feed</h2>
            <span style={{ fontSize: '11px', color: 'var(--green)' }}>● Live</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '340px' }}>
            {liveEvents.map((evt, i) => {
              const severityColor = evt.severity === 'critical' ? 'var(--red)' : evt.severity === 'warning' ? '#ff8c00' : evt.severity === 'low' ? 'var(--green)' : 'var(--blue)';
              return (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '10px', background: 'var(--bg-app)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', width: '55px', marginTop: '2px', flexShrink: 0 }}>{evt.time}</div>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: severityColor, flexShrink: 0 }}>
                    <evt.icon size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-main)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evt.message}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{evt.source}</div>
                  </div>
                  <RiskBadge level={evt.severity} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Trend Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Event Volume</h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last 50 minutes</span>
          </div>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={eventTrend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="eventGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="events" stroke="var(--gold)" strokeWidth={2} fill="url(#eventGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <h2 className="panel-title" style={{ marginTop: '16px', marginBottom: '12px' }}>Severity Distribution</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '100px', height: '100px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={alertSeverityData} cx="50%" cy="50%" innerRadius={28} outerRadius={45} dataKey="value" stroke="none">
                    {alertSeverityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {alertSeverityData.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }}></div>
                  <span style={{ color: 'var(--text-muted)' }}>{s.name}</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status Panel */}
        <div className="panel-card">
          <h2 className="panel-title" style={{ marginBottom: '16px' }}>System Status</h2>
          {[
            { name: 'API Gateway', status: 'Online', uptime: '99.99%' },
            { name: 'IDS/IPS', status: 'Online', uptime: '99.95%' },
            { name: 'Firewall', status: 'Online', uptime: '99.99%' },
            { name: 'Scanner Agents', status: 'Online', uptime: '99.90%' },
            { name: 'Log Aggregator', status: 'Online', uptime: '99.97%' },
            { name: 'Alert Engine', status: 'Online', uptime: '99.98%' },
          ].map(sys => (
            <div key={sys.name} className="list-item">
              <span style={{ fontSize: '12px', color: 'var(--text-main)' }}>{sys.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--green)' }}>{sys.status}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sys.uptime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row: Critical Alerts Table */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '16px' }}>
          <h2 className="panel-title">Critical Alerts</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--red)', borderRadius: '6px', padding: '6px 14px', color: 'var(--red)', fontSize: '12px', cursor: 'pointer' }}>
            <Eye size={14} /> View All Alerts
          </button>
        </div>
        <table className="data-table">
          <thead style={{ background: 'var(--bg-app)' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Alert ID</th>
              <th style={{ padding: '12px 16px' }}>Source</th>
              <th style={{ padding: '12px 16px' }}>Message</th>
              <th style={{ padding: '12px 16px' }}>Time</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {criticalAlerts.map(alert => (
              <tr key={alert.id}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--red)' }}>{alert.id}</td>
                <td style={{ padding: '12px 16px' }}>{alert.source}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.message}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{alert.time}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', color: alert.status === 'Open' ? 'var(--red)' : 'var(--gold)', fontWeight: 500 }}>{alert.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}><RiskBadge level="critical" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
