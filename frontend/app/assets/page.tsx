"use client";

import React, { useState, useEffect } from 'react';
import { 
  Bell, User, Database, ShieldCheck, Atom, AlertTriangle, AlertCircle, 
  Search, ChevronDown, Download, Plus, Server, Key, Code, Lock, Shield, 
  Mail, Eye, MoreVertical
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  sub: string;
  type: string;
  algorithm: string;
  risk: 'Critical' | 'Safe' | 'Medium';
  priority: number;
  action: 'Replace' | 'None' | 'Migrate' | 'Plan Upgrade';
  lastSeen: string;
  icon: any;
}

const DEMO_ASSETS: Asset[] = [
  { id: '1', name: 'TLS Certificate – api.finora.io', sub: 'api.finora.io', type: 'Certificate', risk: 'Critical', priority: 95, algorithm: 'RSA-2048', action: 'Replace', lastSeen: '1h ago', icon: Server },
  { id: '2', name: 'HSM Key – Payment Gateway', sub: 'HSM Cluster 01', type: 'Symmetric Key', risk: 'Safe', priority: 10, algorithm: 'AES-256', action: 'None', lastSeen: '2h ago', icon: Key },
  { id: '3', name: 'Code Signing Key – CI/CD', sub: 'Jenkins / GitLab', type: 'Asymmetric Key', risk: 'Critical', priority: 88, algorithm: 'ECDSA P-256', action: 'Replace', lastSeen: '5h ago', icon: Code },
  { id: '4', name: 'Database Encryption – PostgreSQL', sub: 'UserDB Cluster', type: 'Symmetric Key', risk: 'Safe', priority: 15, algorithm: 'AES-256-GCM', action: 'Migrate', lastSeen: '3h ago', icon: Database },
  { id: '5', name: 'VPN Tunnel – Branch Office', sub: 'Istanbul Office', type: 'Key Exchange', risk: 'Medium', priority: 60, algorithm: 'DH-2048', action: 'Plan Upgrade', lastSeen: '6h ago', icon: Key },
  { id: '6', name: 'S/MIME – Corporate Email', sub: 'mail.finora.io', type: 'Certificate', risk: 'Medium', priority: 55, algorithm: 'RSA-2048', action: 'Replace', lastSeen: '4h ago', icon: Mail },
  { id: '7', name: 'JWT Signing – Auth Service', sub: 'auth.finora.io', type: 'Asymmetric Key', risk: 'Critical', priority: 92, algorithm: 'RSA-2048', action: 'Replace', lastSeen: '1h ago', icon: Lock },
  { id: '8', name: 'Backup Encryption Key', sub: 'Backup Vault', type: 'Symmetric Key', risk: 'Safe', priority: 5, algorithm: 'AES-256', action: 'None', lastSeen: '12h ago', icon: Shield },
];

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
  const [activeTab, setActiveTab] = useState('All');

  const distribution = { Safe: 3, QuantumResistant: 3, Medium: 2, Critical: 3, Total: 8 };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'var(--red)';
      case 'Medium': return '#ff8c00'; // Orange
      case 'Safe': return 'var(--green)';
      default: return 'var(--text-muted)';
    }
  };

  const getActionStyle = (action: string) => {
    switch (action) {
      case 'Replace': return { color: 'var(--red)', border: '1px solid rgba(255, 77, 79, 0.3)', background: 'rgba(255, 77, 79, 0.05)' };
      case 'Migrate': return { color: '#ff8c00', border: '1px solid rgba(255, 140, 0, 0.3)', background: 'rgba(255, 140, 0, 0.05)' };
      case 'Plan Upgrade': return { color: 'var(--gold)', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 215, 0, 0.05)' };
      case 'None': return { color: 'var(--green)', border: '1px solid rgba(82, 196, 26, 0.3)', background: 'rgba(82, 196, 26, 0.05)' };
      default: return {};
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <div className="topbar">
        <div>
          <h1>Assets Inventory</h1>
          <p>Discover, classify and assess cryptographic assets across your environment.</p>
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" aria-label="Notifications" style={{ position: 'relative' }}>
            <Bell size={18} />
            <div style={{ position: 'absolute', top: -4, right: -4, background: 'var(--gold)', color: 'black', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
          </button>
          <button className="profile-btn">
            <div className="profile-avatar"><User size={18} /></div>
            <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ fontSize: '12px', fontWeight: 500 }}>Security Admin</div>
              <ChevronDown size={14} className="text-muted" />
            </div>
          </button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="kpi-row">
        <div className="panel-card kpi-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <div className="kpi-title" style={{ marginBottom: '8px' }}>Total Assets</div>
            <div className="kpi-value">8</div>
            <div className="kpi-subtext" style={{ marginTop: '8px' }}>100% / 100%</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}>
            <Database size={24} />
          </div>
        </div>

        <div className="panel-card kpi-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <div className="kpi-title text-green" style={{ marginBottom: '8px', color: 'var(--green)' }}>Safe</div>
            <div className="kpi-value text-green" style={{ color: 'var(--green)' }}>3</div>
            <div className="kpi-subtext" style={{ marginTop: '8px' }}>37.5%</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--green)', color: 'var(--green)' }}>
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="panel-card kpi-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <div className="kpi-title" style={{ marginBottom: '8px', color: 'var(--blue)' }}>Quantum-resistant</div>
            <div className="kpi-value" style={{ color: 'var(--blue)' }}>3</div>
            <div className="kpi-subtext" style={{ marginTop: '8px' }}>37.5%</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--blue)', color: 'var(--blue)' }}>
            <Atom size={24} />
          </div>
        </div>

        <div className="panel-card kpi-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <div className="kpi-title" style={{ marginBottom: '8px', color: '#ff8c00' }}>Medium Risk</div>
            <div className="kpi-value" style={{ color: '#ff8c00' }}>2</div>
            <div className="kpi-subtext" style={{ marginTop: '8px' }}>25.0%</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid #ff8c00', color: '#ff8c00' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="panel-card kpi-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px' }}>
          <div>
            <div className="kpi-title" style={{ marginBottom: '8px', color: 'var(--red)' }}>Critical</div>
            <div className="kpi-value" style={{ color: 'var(--red)' }}>3</div>
            <div className="kpi-subtext" style={{ marginTop: '8px' }}>37.5%</div>
          </div>
          <div className="kpi-icon-wrapper" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)' }}>
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} className="text-muted" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search assets..." style={{ width: '100%', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 12px 10px 36px', color: 'var(--text-main)', fontSize: '13px', outline: 'none' }} />
          </div>
          
          {['All Types', 'All Algorithms', 'All Risk Levels', 'All Priorities', 'More Filters'].map(filter => (
            <button key={filter} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0 16px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>
              {filter} <ChevronDown size={14} />
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '10px 16px', color: 'var(--text-main)', fontSize: '13px', cursor: 'pointer' }}>
            <Download size={16} /> Export
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', border: 'none', borderRadius: '6px', padding: '10px 16px', color: 'black', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} strokeWidth={3} /> Add Asset
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '0 16px' }}>
          {[
            { id: 'All', label: 'All', count: distribution.Total, color: 'var(--gold)' },
            { id: 'Safe', label: 'Safe', count: distribution.Safe, color: 'var(--green)' },
            { id: 'Quantum-resistant', label: 'Quantum-resistant', count: distribution.QuantumResistant, color: 'var(--blue)' },
            { id: 'Medium', label: 'Medium', count: distribution.Medium, color: '#ff8c00' },
            { id: 'Critical', label: 'Critical', count: distribution.Critical, color: 'var(--red)' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent', border: 'none', padding: '16px 20px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                color: activeTab === tab.id ? tab.color : 'var(--text-muted)',
                borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Table */}
        <table className="data-table" style={{ width: '100%', tableLayout: 'auto' }}>
          <thead style={{ background: 'var(--bg-app)' }}>
            <tr>
              <th style={{ width: '40px', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}></th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Asset Name ↕</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Type ↕</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Algorithm ↕</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Risk Level</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Priority ↕</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Immediate Action</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Last Seen ↕</th>
              <th style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a, i) => (
              <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: i % 2 !== 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: getRiskColor(a.risk) }}>
                    <a.icon size={16} />
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500, marginBottom: '4px' }}>{a.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{a.sub}</div>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{a.type}</td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{a.algorithm}</td>
                <td style={{ padding: '16px' }}>
                  <span className="risk-badge" style={{ color: getRiskColor(a.risk), background: 'transparent', border: `1px solid ${getRiskColor(a.risk)}`, padding: '4px 10px', borderRadius: '4px' }}>
                    {a.risk}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{a.priority}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ ...getActionStyle(a.action), padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>
                    {a.action}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{a.lastSeen}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    <Eye size={16} style={{ cursor: 'pointer' }} />
                    <MoreVertical size={16} style={{ cursor: 'pointer' }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing 1 to 8 of 8 assets</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&lt;</button>
            <button style={{ width: '28px', height: '28px', background: 'var(--border-gold)', border: '1px solid var(--gold)', borderRadius: '4px', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 500 }}>1</button>
            <button style={{ width: '28px', height: '28px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
