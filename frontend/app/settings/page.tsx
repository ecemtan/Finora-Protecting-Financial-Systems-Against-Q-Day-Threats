"use client";

import React, { useState } from 'react';
import SectionHeader from '@/components/SectionHeader';
import {
  User, Shield, Server, Settings as SettingsIcon, Key, Globe,
  Bell, Eye, EyeOff, Save, RefreshCw, CheckCircle2
} from 'lucide-react';

interface ToggleProps {
  label: string;
  description: string;
  defaultChecked?: boolean;
}

function Toggle({ label, description, defaultChecked = false }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-color)' }}>
      <div>
        <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{description}</div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: checked ? 'var(--gold)' : 'var(--bg-panel-hover)',
          position: 'relative', transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: '18px', height: '18px', borderRadius: '50%', background: checked ? 'black' : 'var(--text-muted)',
          position: 'absolute', top: '3px', left: checked ? '23px' : '3px', transition: 'left 0.2s',
        }}></div>
      </button>
    </div>
  );
}

const apiEndpoints = [
  { name: 'Backend API', url: 'http://localhost:8080', status: 'Online', latency: '12ms' },
  { name: 'Scanner Service', url: 'http://localhost:8081', status: 'Online', latency: '8ms' },
  { name: 'Benchmark Engine', url: 'http://localhost:8082', status: 'Online', latency: '15ms' },
  { name: 'PQC Gateway', url: 'https://pqc.finora.io', status: 'Online', latency: '22ms' },
  { name: 'Alert Engine', url: 'http://localhost:8083', status: 'Offline', latency: '—' },
];

export default function SettingsPage() {
  return (
    <div className="dashboard-layout">
      <SectionHeader
        title="Platform Settings"
        subtitle="Configure platform preferences, security settings, and system parameters."
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', border: 'none', borderRadius: '6px', padding: '10px 16px', color: 'black', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <Save size={16} strokeWidth={3} /> Save Changes
          </button>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Profile Settings */}
        <div className="panel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gold-glow)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
              <User size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Profile Settings</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Display Name', value: 'Security Admin', type: 'text' },
              { label: 'Email', value: 'admin@finora.io', type: 'email' },
              { label: 'Role', value: 'Platform Administrator', type: 'text' },
              { label: 'Organization', value: 'Finora Financial', type: 'text' },
            ].map(field => (
              <div key={field.label}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  style={{
                    width: '100%', padding: '10px 12px', background: 'var(--bg-app)', border: '1px solid var(--border-color)',
                    borderRadius: '6px', color: 'var(--text-main)', fontSize: '13px', outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="panel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--red-glow)', border: '1px solid var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Security Settings</h3>
          </div>

          <Toggle label="Two-Factor Authentication" description="Require 2FA for all login sessions" defaultChecked={true} />
          <Toggle label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultChecked={true} />
          <Toggle label="IP Whitelisting" description="Restrict access to whitelisted IP addresses" defaultChecked={false} />
          <Toggle label="Audit Logging" description="Log all user actions for compliance" defaultChecked={true} />
          <Toggle label="API Key Rotation" description="Automatically rotate API keys every 90 days" defaultChecked={true} />
        </div>

        {/* System Configuration */}
        <div className="panel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,216,255,0.15)', border: '1px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
              <SettingsIcon size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>System Configuration</h3>
          </div>

          <Toggle label="Auto-Scan New Assets" description="Automatically scan newly registered assets" defaultChecked={true} />
          <Toggle label="Real-time Monitoring" description="Enable SOC live event streaming" defaultChecked={true} />
          <Toggle label="Email Notifications" description="Send email alerts for critical events" defaultChecked={true} />
          <Toggle label="Dark Mode" description="Use dark theme (default)" defaultChecked={true} />
          <Toggle label="Benchmark Auto-Run" description="Run benchmarks daily at 02:00 UTC" defaultChecked={false} />
        </div>

        {/* Notification Preferences */}
        <div className="panel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--green-glow)', border: '1px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
              <Bell size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>Notification Preferences</h3>
          </div>

          <Toggle label="Critical Alerts" description="Immediate notification for critical security events" defaultChecked={true} />
          <Toggle label="Scan Completion" description="Notify when vulnerability scans complete" defaultChecked={true} />
          <Toggle label="Weekly Digest" description="Receive weekly summary report via email" defaultChecked={false} />
          <Toggle label="Benchmark Results" description="Notify when benchmark runs complete" defaultChecked={true} />
          <Toggle label="System Updates" description="Notify when platform updates are available" defaultChecked={true} />
        </div>
      </div>

      {/* API Status Panel */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '16px' }}>
          <h2 className="panel-title">API & Service Status</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 14px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
        <table className="data-table">
          <thead style={{ background: 'var(--bg-app)' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Service</th>
              <th style={{ padding: '12px 16px' }}>URL</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Latency</th>
            </tr>
          </thead>
          <tbody>
            {apiEndpoints.map(ep => (
              <tr key={ep.name}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{ep.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '12px' }}>{ep.url}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px',
                    color: ep.status === 'Online' ? 'var(--green)' : 'var(--red)',
                  }}>
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: ep.status === 'Online' ? 'var(--green)' : 'var(--red)',
                      boxShadow: `0 0 6px ${ep.status === 'Online' ? 'var(--green)' : 'var(--red)'}`,
                    }}></div>
                    {ep.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{ep.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
