import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-[var(--color-card-bg)] backdrop-filter backdrop-blur-lg rounded-xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-shadow">
      {title && <h2 className="text-lg font-semibold mb-4 text-primary">{title}</h2>}
      {children}
    </div>
  );
}
