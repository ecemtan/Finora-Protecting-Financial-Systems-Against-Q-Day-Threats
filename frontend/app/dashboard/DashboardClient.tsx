"use client";

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  Bell, User, Database, ShieldAlert, Timer, ShieldCheck, 
  Users, Handshake, HardDrive, ShieldX, Target, ScanSearch
} from 'lucide-react';

const readinessData = [
  { name: 'May 9', value: 25 }, { name: 'May 11', value: 38 },
  { name: 'May 13', value: 45 }, { name: 'May 15', value: 50 },
  { name: 'May 17', value: 48 }, { name: 'May 19', value: 60 },
  { name: 'May 21', value: 33.33 }
];

const latencyData = [
  { time: '12:30', value: 2.1 }, { time: '12:32', value: 1.8 },
  { time: '12:34', value: 2.0 }, { time: '12:36', value: 1.2 },
  { time: '12:38', value: 1.0 }, { time: '12:40', value: 1.5 },
  { time: '12:42', value: 1.1 }, { time: '12:45', value: 1.09 }
];

const riskData = [
  { name: 'High Risk', value: 8, color: 'var(--red)' },
  { name: 'Medium Risk', value: 9, color: 'var(--gold)' },
  { name: 'Low Risk', value: 7, color: 'var(--green)' }
];

const readinessByType = [
  { name: 'Payment Systems', value: 25 },
  { name: 'Core Banking', value: 40 },
  { name: 'Trading Systems', value: 30 },
  { name: 'Data Services', value: 35 },
  { name: 'Infrastructure', value: 50 }
];

const riskyAssets = [
  { name: 'Core Payment Gateway', score: 100, level: 'critical' },
  { name: 'Customer Data Service', score: 85, level: 'high' },
  { name: 'Legacy Auth Service', score: 75, level: 'high' },
  { name: 'Trade Matching Engine', score: 60, level: 'medium' },
  { name: 'Reporting Service', score: 45, level: 'medium' }
];

export default function DashboardClient() {
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
          <h1>Executive Dashboard</h1>
          <p>Real-time overview of your quantum readiness and security posture.</p>
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
          </div>
          <div className="kpi-trend up">↑ 4.25% vs last week</div>
        </div>

        {/* Total Assets */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Total Assets</div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper gold"><Database size={20} /></div>
            <div className="kpi-value-container">
              <div className="kpi-value">24</div>
              <div className="kpi-subtext">Monitored Assets</div>
            </div>
          </div>
          <div className="kpi-trend up">↑ 3 new this week</div>
        </div>

        {/* Vulnerable Assets */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Vulnerable Assets</div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper red"><ShieldAlert size={20} /></div>
            <div className="kpi-value-container">
              <div className="kpi-value">8</div>
              <div className="kpi-subtext">High Risk</div>
            </div>
          </div>
          <div className="kpi-trend down">♦ 2 new vulnerabilities</div>
        </div>

        {/* Avg Latency */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Avg. Handshake Latency</div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper gold"><Timer size={20} /></div>
            <div className="kpi-value-container">
              <div className="kpi-value">1.09 <span style={{fontSize:'16px'}}>ms</span></div>
              <div className="kpi-subtext">Hybrid Connection</div>
            </div>
          </div>
          <div className="kpi-trend up">↓ 12.3% vs last week</div>
        </div>

        {/* Gateway Status */}
        <div className="panel-card kpi-card">
          <div className="kpi-title">Gateway Status</div>
          <div className="kpi-content">
            <div className="kpi-icon-wrapper green"><ShieldCheck size={20} /></div>
            <div className="kpi-value-container">
              <div className="kpi-value" style={{fontSize: '24px'}}>Secure</div>
              <div className="kpi-subtext">Hybrid PQC Active</div>
            </div>
          </div>
          <div className="kpi-trend up">✓ All systems secure</div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="middle-grid">
        {/* Trend Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Quantum Readiness Trend</h2>
            <select style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '11px', outline: 'none' }}>
              <option>Last 14 Days</option>
            </select>
          </div>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readinessData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} ticks={[0, 25, 50, 75, 100]} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                <Line type="monotone" dataKey="value" stroke="var(--gold)" strokeWidth={2} dot={{ r: 3, fill: 'var(--gold)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Chart */}
        <div className="panel-card">
          <div className="panel-header">
            <h2 className="panel-title">Handshake Latency (ms)</h2>
            <select style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '11px', outline: 'none' }}>
              <option>Real-time</option>
            </select>
          </div>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} ticks={[0, 1, 2, 3, 4, 5]} tickFormatter={v => `${v} ms`} />
                <Tooltip contentStyle={{ background: 'var(--bg-panel-hover)', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                <Line type="monotone" dataKey="value" stroke="var(--red)" strokeWidth={2} dot={{ r: 3, fill: 'var(--red)' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="panel-card">
          <h2 className="panel-title" style={{marginBottom: '16px'}}>System Health</h2>
          <div className="list-item"><span className="text-muted text-sm flex gap-2 items-center"><Database size={14}/> Backend API</span><span className="text-green text-xs">Operational</span><span className="text-white text-xs">99.9%</span></div>
          <div className="list-item"><span className="text-muted text-sm flex gap-2 items-center"><ShieldCheck size={14}/> Hybrid PQC Gateway</span><span className="text-green text-xs">Operational</span><span className="text-white text-xs">99.9%</span></div>
          <div className="list-item"><span className="text-muted text-sm flex gap-2 items-center"><HardDrive size={14}/> PostgreSQL</span><span className="text-green text-xs">Operational</span><span className="text-white text-xs">99.8%</span></div>
          <div className="list-item"><span className="text-muted text-sm flex gap-2 items-center"><Database size={14}/> Redis</span><span className="text-green text-xs">Operational</span><span className="text-white text-xs">99.9%</span></div>
          <div className="list-item"><span className="text-muted text-sm flex gap-2 items-center"><ScanSearch size={14}/> Scanner</span><span className="text-green text-xs">Operational</span><span className="text-white text-xs">99.7%</span></div>
          <div className="list-item" style={{border: 'none'}}><span className="text-muted text-sm flex gap-2 items-center"><Target size={14}/> Benchmark Engine</span><span className="text-green text-xs">Operational</span><span className="text-white text-xs">99.8%</span></div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="bottom-grid">
        {/* Risk Distribution */}
        <div className="panel-card">
          <h2 className="panel-title mb-4">Risk Distribution</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '140px' }}>
            <div style={{ width: '120px', height: '120px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" stroke="none">
                    {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {riskData.map(r => (
                <div key={r.name} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-main)' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: r.color, borderRadius: '2px' }}></div>
                    {r.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '14px' }}>
                    {r.value} ({(r.value/24*100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Risky Assets */}
        <div className="panel-card">
          <h2 className="panel-title mb-4">Top Risky Assets</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {riskyAssets.map(a => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td className={a.score > 80 ? 'text-red' : 'text-gold'}>{a.score}</td>
                  <td><span className={`risk-badge ${a.level}`}>{a.level.charAt(0).toUpperCase() + a.level.slice(1)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <a href="/assets" style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}>View all assets →</a>
          </div>
        </div>

        {/* Readiness by Asset Type */}
        <div className="panel-card">
          <h2 className="panel-title mb-4">Readiness by Asset Type</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {readinessByType.map(t => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '100px', fontSize: '11px', color: 'var(--text-main)' }}>{t.name}</div>
                <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-app)', borderRadius: '3px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${t.value}%`, backgroundColor: 'var(--gold)', borderRadius: '3px' }}></div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', width: '30px', textAlign: 'right' }}>{t.value}%</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '112px', marginRight: '30px', fontSize: '9px', color: 'var(--text-muted)' }}>
              <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* Live Events Feed */}
        <div className="panel-card">
          <div className="panel-header mb-2">
            <h2 className="panel-title">Live Events Feed</h2>
            <a href="/soc" style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}>View all</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', width: '45px', marginTop: '2px' }}>12:45:21</div>
              <ShieldCheck size={14} className="text-green" style={{ marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>Hybrid handshake completed</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Gateway</div>
              </div>
              <span className="risk-badge info">Info</span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', width: '45px', marginTop: '2px' }}>12:45:19</div>
              <ScanSearch size={14} className="text-red" style={{ marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>New scan result: Core Payment Gateway</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Scanner</div>
              </div>
              <span className="risk-badge high">High</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', width: '45px', marginTop: '2px' }}>12:45:17</div>
              <Database size={14} className="text-gold" style={{ marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>Asset risk score updated</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Backend</div>
              </div>
              <span className="risk-badge medium">Medium</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', width: '45px', marginTop: '2px' }}>12:45:13</div>
              <HardDrive size={14} className="text-blue" style={{ marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>New asset registered: Settlement Service</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Backend</div>
              </div>
              <span className="risk-badge info">Info</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', width: '45px', marginTop: '2px' }}>12:45:09</div>
              <ShieldX size={14} className="text-red" style={{ marginTop: '1px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-main)' }}>High risk algorithm detected: RSA-2048</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Scanner</div>
              </div>
              <span className="risk-badge high">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer KPI Strip */}
      <div className="footer-kpi-row">
        <div className="panel-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '12px 16px' }}>
          <Users size={24} className="text-muted" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Sessions</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>128</span>
              <span className="text-green" style={{ fontSize: '10px' }}>↑ 18 today</span>
            </div>
          </div>
        </div>
        
        <div className="panel-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '12px 16px' }}>
          <Handshake size={24} className="text-muted" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Hybrid Handshakes (Today)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>542</span>
              <span className="text-green" style={{ fontSize: '10px' }}>↑ 12.5%</span>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '12px 16px' }}>
          <Database size={24} className="text-muted" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Data Transferred</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>2.45 GB</span>
              <span className="text-green" style={{ fontSize: '10px' }}>↑ 8.7%</span>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '12px 16px' }}>
          <ShieldCheck size={24} className="text-red" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Threats Blocked</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)' }}>7</span>
              <span className="text-green" style={{ fontSize: '10px' }}>↑ 75%</span>
            </div>
          </div>
        </div>

        <div className="panel-card" style={{ flexDirection: 'row', alignItems: 'center', gap: '16px', padding: '12px 16px' }}>
          <Target size={24} className="text-gold" />
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>Q-Day Threat Level</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.5px' }}>MODERATE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
