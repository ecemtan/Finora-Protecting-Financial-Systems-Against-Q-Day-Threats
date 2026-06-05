import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'gold' | 'red' | 'green' | 'blue' | 'orange';
  subtitle?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export default function StatCard({ title, value, icon, color = 'gold', subtitle, trend, trendDirection = 'neutral' }: StatCardProps) {
  const colorMap: Record<string, string> = {
    gold: 'var(--gold)',
    red: 'var(--red)',
    green: 'var(--green)',
    blue: 'var(--blue)',
    orange: '#ff8c00',
  };

  const glowMap: Record<string, string> = {
    gold: 'var(--gold-glow)',
    red: 'var(--red-glow)',
    green: 'var(--green-glow)',
    blue: 'rgba(0, 216, 255, 0.15)',
    orange: 'rgba(255, 140, 0, 0.15)',
  };

  const accentColor = colorMap[color] || colorMap.gold;
  const glowColor = glowMap[color] || glowMap.gold;

  return (
    <div className="panel-card kpi-card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="kpi-title" style={{ marginBottom: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>{title}</div>
          <div className="kpi-value" style={{ color: accentColor, fontSize: '28px', fontWeight: 600, lineHeight: 1.1 }}>{value}</div>
          {subtitle && <div className="kpi-subtext" style={{ marginTop: '8px' }}>{subtitle}</div>}
        </div>
        {icon && (
          <div style={{
            width: '44px', height: '44px', borderRadius: '10px',
            background: glowColor, border: `1px solid ${accentColor}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accentColor, flexShrink: 0,
          }}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`kpi-trend ${trendDirection}`} style={{ marginTop: '12px' }}>
          {trend}
        </div>
      )}
    </div>
  );
}
