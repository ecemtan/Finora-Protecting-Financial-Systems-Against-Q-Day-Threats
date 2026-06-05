import React from 'react';

interface GlassCardProps {
  title?: string;
  value?: number | string;
  suffix?: string;
  description?: string;
}

export default function GlassCard({ title, value, suffix, description }: GlassCardProps) {
  return (
    <div className="bg-[var(--panel-soft)] backdrop-filter backdrop-blur-lg rounded-xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-shadow">
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>
      )}
      {(value !== undefined && value !== null) && (
        <p className="text-3xl font-bold text-gold mb-2">{value}{suffix}</p>
      )}
      {description && (
        <p className="text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
