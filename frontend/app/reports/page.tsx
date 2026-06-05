"use client";

import React from 'react';
import StatCard from '@/components/StatCard';
import RiskBadge from '@/components/RiskBadge';
import SectionHeader from '@/components/SectionHeader';
import {
  FileText, Download, Calendar, CheckCircle2, Clock, BarChart3,
  FileDown, Printer, Mail
} from 'lucide-react';

const generatedReports = [
  { id: 'RPT-001', name: 'Quantum Readiness Assessment Q2 2025', type: 'Assessment', date: '2025-06-05', status: 'completed', pages: 24 },
  { id: 'RPT-002', name: 'Cryptographic Asset Inventory Report', type: 'Inventory', date: '2025-06-04', status: 'completed', pages: 18 },
  { id: 'RPT-003', name: 'PQC Migration Progress Report', type: 'Migration', date: '2025-06-03', status: 'completed', pages: 32 },
  { id: 'RPT-004', name: 'Vulnerability Scan Summary – June 2025', type: 'Security', date: '2025-06-02', status: 'completed', pages: 12 },
  { id: 'RPT-005', name: 'Benchmark Performance Analysis', type: 'Performance', date: '2025-06-01', status: 'completed', pages: 15 },
  { id: 'RPT-006', name: 'SOC Monthly Threat Report', type: 'Threat', date: '2025-05-31', status: 'completed', pages: 28 },
  { id: 'RPT-007', name: 'Compliance Audit – NIST PQC Standards', type: 'Compliance', date: '2025-05-28', status: 'completed', pages: 40 },
  { id: 'RPT-008', name: 'Executive Summary – Board Presentation', type: 'Executive', date: '2025-05-25', status: 'generating', pages: 0 },
];

const quickReports = [
  { name: 'Readiness Summary', icon: BarChart3, description: 'Current quantum readiness score and risk overview' },
  { name: 'Asset Risk Report', icon: FileText, description: 'Full cryptographic asset inventory with risk levels' },
  { name: 'Scan Results', icon: FileDown, description: 'Latest vulnerability scan findings and recommendations' },
  { name: 'Compliance Status', icon: CheckCircle2, description: 'NIST PQC standards compliance checklist' },
];

export default function ReportsPage() {
  return (
    <div className="dashboard-layout">
      <SectionHeader
        title="Report Center"
        subtitle="Generate, view, and export security and compliance reports."
        action={
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--gold)', border: 'none', borderRadius: '6px', padding: '10px 16px', color: 'black', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            <FileText size={16} strokeWidth={3} /> Generate New Report
          </button>
        }
      />

      {/* KPI Row */}
      <div className="kpi-row">
        <StatCard title="Total Reports" value="42" icon={<FileText size={22} />} color="gold" subtitle="All time" trend="↑ 8 this month" trendDirection="up" />
        <StatCard title="Generated Today" value="3" icon={<Calendar size={22} />} color="blue" subtitle="Automated + manual" />
        <StatCard title="Avg Generation" value="12s" icon={<Clock size={22} />} color="green" subtitle="Per report" trend="↓ 23% faster" trendDirection="up" />
        <StatCard title="Exported" value="156" icon={<Download size={22} />} color="gold" subtitle="PDF + CSV downloads" />
        <StatCard title="Compliance Score" value="94%" icon={<CheckCircle2 size={22} />} color="green" subtitle="NIST PQC" trend="↑ 3% improvement" trendDirection="up" />
      </div>

      {/* Quick Report Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {quickReports.map(report => (
          <div key={report.name} className="panel-card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--border-color)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gold-glow)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
                <report.icon size={20} />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>{report.name}</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>{report.description}</p>
            <button style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border-gold)', borderRadius: '6px', color: 'var(--gold)', fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
              Generate Report
            </button>
          </div>
        ))}
      </div>

      {/* Report History Table */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="panel-header" style={{ padding: '16px' }}>
          <h2 className="panel-title">Report History</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 14px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>
              <Printer size={14} /> Print
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 14px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>
              <Mail size={14} /> Email
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead style={{ background: 'var(--bg-app)' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Report ID</th>
              <th style={{ padding: '12px 16px' }}>Report Name</th>
              <th style={{ padding: '12px 16px' }}>Type</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Pages</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {generatedReports.map(report => (
              <tr key={report.id}>
                <td style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--gold)' }}>{report.id}</td>
                <td style={{ padding: '12px 16px' }}>{report.name}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{report.type}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>{report.date}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{report.pages || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 500,
                    color: report.status === 'completed' ? 'var(--green)' : 'var(--gold)',
                    background: report.status === 'completed' ? 'rgba(82,196,26,0.1)' : 'rgba(255,215,0,0.1)',
                    border: `1px solid ${report.status === 'completed' ? 'rgba(82,196,26,0.2)' : 'rgba(255,215,0,0.2)'}`,
                  }}>
                    {report.status === 'completed' ? 'Completed' : 'Generating...'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {report.status === 'completed' ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 10px', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>
                        <Download size={12} /> PDF
                      </button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '4px 10px', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer' }}>
                        <Download size={12} /> CSV
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
