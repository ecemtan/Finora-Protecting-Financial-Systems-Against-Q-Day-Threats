"use client";

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
  Bell, User, ShieldCheck, ShieldAlert, Download, Crown, Hourglass
} from 'lucide-react';

const prioritiesData = [
  { id: 1, name: 'Core Banking System', sub: 'Payment Processing', risk: 'Critical', impact: 'High', effort: 'High' },
  { id: 2, name: 'Customer Data Service', sub: 'Data Management', risk: 'High', impact: 'High', effort: 'Medium' },
  { id: 3, name: 'Auth Service', sub: 'Authentication', risk: 'High', impact: 'Medium', effort: 'Low' },
  { id: 4, name: 'Trade Matching Engine', sub: 'Trading System', risk: 'Medium', impact: 'High', effort: 'Medium' },
  { id: 5, name: 'Reporting Service', sub: 'Analytics & Reports', risk: 'Medium', impact: 'Medium', effort: 'Low' }
];

const distributionData = [
  { name: 'Critical Assets', value: 33.33, color: 'var(--red)' },
  { name: 'Vulnerable Assets', value: 66.67, color: 'var(--gold)' },
  { name: 'Safe Assets', value: 0, color: 'var(--green)' }
];

const scatterData = [
  { name: 'Core Banking System', x: 2.8, y: 2.8, risk: 'Critical' },
  { name: 'Customer Data Service', x: 2.2, y: 2.8, risk: 'High' },
  { name: 'Auth Service', x: 0.5, y: 2.0, risk: 'High' },
  { name: 'Trade Matching Engine', x: 1.8, y: 1.8, risk: 'Medium' },
  { name: 'Reporting Service', x: 0.8, y: 1.2, risk: 'Medium' }
];

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Critical': return 'var(--red)';
    case 'High': return '#ff8c00'; // Orange
    case 'Medium': return 'var(--gold)';
    case 'Low': return 'var(--green)';
    default: return 'var(--text-muted)';
  }
};

export default function ReadinessPage() {
  const [time, setTime] = useState('12:45:32 UTC');

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toISOString().substring(11, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Top Bar */}
      <div className="topbar">
        <div>
          <h1>Quantum Migration Readiness</h1>
          <p>Assess your organization's quantum readiness and migration progress</p>
        </div>
        <div className="topbar-actions">
          <div className="system-status">
            <div className="status-dot"></div>
            <span>System Status: All Systems Operational</span>
          </div>
          <div className="clock">{time}</div>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="profile-btn">
            <div className="profile-avatar"><User size={18} /></div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 500 }}>Admin</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Finora Team</div>
            </div>
          </button>
        </div>
      </div>

      {/* Top KPI Row */}
      <div className="kpi-row">
        {/* Gauge Card */}
        <div className="panel-card kpi-card" style={{ gridColumn: 'span 1' }}>
          <div className="kpi-title">Quantum Readiness Score</div>
          <div style={{ height: '120px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={120} style={{ position: 'absolute', top: 0 }}>
              <PieChart>
                <Pie
                  data={[{ value: 33.33 }, { value: 66.67 }]}
                  cx="50%" cy="100%"
                  startAngle={180} endAngle={0}
                  innerRadius={45} outerRadius={55}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="var(--gold)" />
                  <Cell fill="var(--bg-app)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '40px', textAlign: 'center', zIndex: 10 }}>
              <div style={{ fontSize: '28px', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1 }}>33.33<span style={{ fontSize: '16px' }}>%</span></div>
              <div style={{ fontSize: '10px', color: 'var(--gold)', fontWeight: 600, marginTop: '4px' }}>MEDIUM RISK</div>
            </div>
            {/* Gauge Labels */}
            <div style={{ position: 'absolute', bottom: '0', left: '10%', fontSize: '9px', color: 'var(--text-muted)' }}>0%</div>
            <div style={{ position: 'absolute', bottom: '0', right: '10%', fontSize: '9px', color: 'var(--text-muted)' }}>100%</div>
          </div>
          <div className="kpi-trend up">↑ 4.25% vs last week</div>
        </div>

        {/* Migration Progress */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Migration Progress</div>
          <div className="kpi-content" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <div className="kpi-value-container">
              <div className="kpi-value text-gold">0<span style={{fontSize:'18px'}}>%</span></div>
            </div>
          </div>
          <div className="kpi-trend up">↑ 0% vs last week</div>
        </div>

        {/* Safe Assets */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Safe Assets <ShieldCheck size={20} className="text-green" /></div>
          <div className="kpi-content" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <div className="kpi-value-container">
              <div className="kpi-value text-green">0</div>
              <div className="kpi-subtext">0 / 24 assets</div>
            </div>
          </div>
          <div className="kpi-trend up">0% of total assets</div>
        </div>

        {/* Critical Assets */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Critical Assets <ShieldAlert size={20} className="text-red" /></div>
          <div className="kpi-content" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
            <div className="kpi-value-container">
              <div className="kpi-value text-red">8</div>
              <div className="kpi-subtext">8 / 24 assets</div>
            </div>
          </div>
          <div className="kpi-trend down">33.33% of total assets</div>
        </div>

        {/* Q-Day Risk Estimation */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Q-Day Risk Estimation</div>
          <div className="kpi-content" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '12px', marginTop: 'auto', marginBottom: 'auto' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Q-Day</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-main)' }}>2032 - 2035</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Exposure</div>
              <span className="risk-badge critical" style={{ marginTop: '4px' }}>HIGH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '16px' }}>
        {/* Asset Readiness Distribution */}
        <div className="panel-card">
          <h2 className="panel-title mb-4">Asset Readiness Distribution</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '220px' }}>
            <div style={{ width: '180px', height: '180px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={distributionData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} dataKey="value" stroke="none">
                    {distributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '10px', color: 'var(--text-main)', textAlign: 'center' }}>
                <span className="text-muted">Total</span><br/>24
              </div>
              <div style={{ position: 'absolute', top: '15%', right: '10%', fontSize: '9px', color: 'var(--text-main)' }}>33.63%</div>
              <div style={{ position: 'absolute', bottom: '15%', left: '35%', fontSize: '9px', color: 'var(--text-main)' }}>66.67%</div>
              <div style={{ position: 'absolute', top: '45%', left: '10%', fontSize: '9px', color: 'var(--text-main)' }}>0%</div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-main)' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--green)', borderRadius: '50%' }}></div>
                  Safe Assets
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '14px' }}>0 (0%)</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-main)' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--gold)', borderRadius: '50%' }}></div>
                  Vulnerable Assets
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-main)', marginLeft: '14px' }}>16 (66.67%)</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-main)' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--red)', borderRadius: '50%' }}></div>
                  Critical Assets
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-main)', marginLeft: '14px' }}>8 (33.33%)</div>
              </div>
              
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-main)' }}>
                <span>Total Assets</span>
                <span>24</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Migration Priorities */}
        <div className="panel-card">
          <div className="panel-header mb-4">
            <h2 className="panel-title">Top Migration Priorities</h2>
            <button style={{ background: 'transparent', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>View Full Plan</button>
          </div>
          <table className="data-table" style={{ marginTop: '-8px' }}>
            <thead>
              <tr>
                <th style={{ width: '60px', textAlign: 'center' }}>Priority</th>
                <th>Asset / System</th>
                <th>Risk Level</th>
                <th>Impact</th>
                <th>Effort</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {prioritiesData.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', 
                      backgroundColor: item.id <= 2 ? 'var(--red)' : '#d97706', 
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', margin: '0 auto' 
                    }}>
                      {item.id}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </td>
                  <td style={{ color: getRiskColor(item.risk) }}>{item.risk}</td>
                  <td style={{ color: getRiskColor(item.impact) }}>{item.impact}</td>
                  <td style={{ color: getRiskColor(item.effort === 'High' ? 'Critical' : item.effort === 'Medium' ? 'Medium' : 'Low') }}>{item.effort}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button style={{ background: 'transparent', border: '1px solid var(--border-gold)', color: 'var(--gold)', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}>Plan Migration</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px' }}>
        {/* Migration Priority Matrix */}
        <div className="panel-card">
          <div className="panel-header mb-4">
            <h2 className="panel-title">Migration Priority Matrix</h2>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid var(--text-muted)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'help' }}>i</div>
          </div>
          
          <div style={{ height: '220px', paddingLeft: '10px', paddingBottom: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis type="number" dataKey="x" name="Effort" domain={[0, 3]} ticks={[0.5, 1.5, 2.5]} tickFormatter={(v) => v === 0.5 ? 'Low' : v === 1.5 ? 'Medium\nMigration Effort' : 'High'} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={false} />
                <YAxis type="number" dataKey="y" name="Impact" domain={[0, 3]} ticks={[0.5, 1.5, 2.5]} tickFormatter={(v) => v === 0.5 ? 'Low' : v === 1.5 ? 'Medium' : 'High'} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border-color)' }} tickLine={false} label={{ value: 'Business Impact', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'var(--text-muted)' }} />
                <ZAxis type="number" range={[100, 100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--bg-panel-hover)', borderColor: 'var(--border-color)' }} />
                <Scatter name="Assets" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            {/* Custom Labels overlay since recharts scatter labels are tricky to position perfectly */}
            <div style={{ position: 'relative', width: '100%', height: '0' }}>
              <div style={{ position: 'absolute', top: '-185px', left: '85%', fontSize: '9px', color: 'var(--text-main)' }}>Core Banking System</div>
              <div style={{ position: 'absolute', top: '-185px', left: '60%', fontSize: '9px', color: 'var(--text-main)' }}>Customer Data Service</div>
              <div style={{ position: 'absolute', top: '-135px', left: '15%', fontSize: '9px', color: 'var(--text-main)' }}>Auth Service</div>
              <div style={{ position: 'absolute', top: '-120px', left: '50%', fontSize: '9px', color: 'var(--text-main)' }}>Trade Matching Engine</div>
              <div style={{ position: 'absolute', top: '-85px', left: '25%', fontSize: '9px', color: 'var(--text-main)' }}>Reporting Service</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '10px', color: 'var(--text-main)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--green)' }}></div> Low Priority</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--gold)' }}></div> Medium Priority</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ff8c00' }}></div> High Priority</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--red)' }}></div> Critical Priority</span>
          </div>
        </div>

        {/* Mosca Theorem */}
        <div className="panel-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <h2 className="panel-title mb-4">Mosca Theorem</h2>
          <div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--gold)', marginBottom: '16px', letterSpacing: '2px' }}>D + T &gt; Y</div>
          <p style={{ fontSize: '11px', color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.5, maxWidth: '70%' }}>
            If the asset satisfies D + T &gt; Y,<br/>it is quantum-vulnerable and requires migration.
          </p>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            <div>D = Data sensitivity (1-10)</div>
            <div>T = Threat exposure (1-10)</div>
            <div>Y = Time until quantum capability (years)</div>
          </div>
          <div style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.8 }}>
            <Hourglass size={100} strokeWidth={1} color="var(--gold)" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }} />
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="panel-card" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', border: '1px solid var(--border-gold)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={20} className="text-gold" />
          </div>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--gold)', marginBottom: '4px' }}>Executive Recommendation</div>
            <div style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 500, marginBottom: '2px' }}>8 critical assets require immediate attention.</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Focus on high impact and long lifetime assets to reduce quantum risk.</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', color: 'var(--red)', fontWeight: 600 }}>8</span>
            <span style={{ fontSize: '10px', color: 'var(--text-main)' }}>Critical Assets</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Require Migration</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', color: 'var(--gold)', fontWeight: 600 }}>16</span>
            <span style={{ fontSize: '10px', color: 'var(--text-main)' }}>Vulnerable Assets</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Plan Migration</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '20px', color: 'var(--green)', fontWeight: 600 }}>0</span>
            <span style={{ fontSize: '10px', color: 'var(--text-main)' }}>Safe Assets</span>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>No Action Needed</span>
          </div>
          
          <button style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            padding: '10px 16px', borderRadius: '6px', 
            background: 'transparent', border: '1px solid var(--gold)', 
            color: 'var(--gold)', fontSize: '12px', fontWeight: 500,
            cursor: 'pointer', marginLeft: '16px'
          }}>
            <Download size={16} /> Download Readiness Report
          </button>
        </div>
      </div>
    </div>
  );
}
