import React from 'react';

interface RiskBadgeProps {
  level: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'safe' | 'warning';
  label?: string;
}

export default function RiskBadge({ level, label }: RiskBadgeProps) {
  const displayLabel = label || level.charAt(0).toUpperCase() + level.slice(1);
  return <span className={`risk-badge ${level}`}>{displayLabel}</span>;
}
