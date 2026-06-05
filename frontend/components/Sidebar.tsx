"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShieldCheck, 
  Database, 
  ScanSearch, 
  Gauge, 
  Activity, 
  Network,
  FileText,
  Settings,
  Hexagon
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/readiness', label: 'Readiness Center', icon: ShieldCheck },
  { href: '/assets', label: 'Assets Inventory', icon: Database },
  { href: '/scanner', label: 'Scanner Results', icon: ScanSearch },
  { href: '/benchmark', label: 'Benchmark Center', icon: Gauge },
  { href: '/soc', label: 'Live Monitor (SOC)', icon: Activity },
  { href: '/architecture', label: 'Architecture', icon: Network },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo Area */}
      <div className="sidebar-logo">
        <Hexagon size={28} className="text-gold" strokeWidth={1.5} />
        <span className="sidebar-logo-text">FINORA</span>
      </div>
      <div className="sidebar-subtitle">
        Post-Quantum Financial<br />Security Platform
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Protection Card */}
      <div className="sidebar-protection-card">
        <Hexagon size={24} className="text-gold" style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--bg-sidebar)', padding: '2px' }} />
        <h4 className="text-gold" style={{ fontSize: '11px', fontWeight: 600, margin: '12px 0 8px 0', letterSpacing: '0.5px' }}>FINORA PROTECTION</h4>
        <p style={{ fontSize: '10px', color: 'var(--text-main)', marginBottom: '12px', lineHeight: 1.4 }}>
          Protecting Financial Systems<br />Against Q-Day Threats
        </p>
        <p style={{ fontSize: '9px', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.4 }}>
          "Harvest Now, Decrypt Later"<br />is not a future risk.<br />It's a present danger.
        </p>
        <p className="text-gold" style={{ fontSize: '10px', fontWeight: 500 }}>
          Secure Today. For Tomorrow.
        </p>
      </div>

      <div className="sidebar-footer">
        © 2025 Finora Platform<br />All rights reserved.
      </div>
    </aside>
  );
}
