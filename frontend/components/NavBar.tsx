"use client";
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const pages = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/readiness', label: 'Readiness' },
  { href: '/assets', label: 'Assets' },
  { href: '/scanner', label: 'Scanner' },
  { href: '/benchmark', label: 'Benchmark' },
  { href: '/soc', label: 'SOC' },
  { href: '/architecture', label: 'Architecture' },
];

export default function NavBar() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
  }, [dark]);

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-3 bg-[#0a0e1a]/80 backdrop-blur-md shadow-md z-50 border-b border-white/10">
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-primary">Finora</span>
      </div>
      <ul className="flex space-x-4 text-sm">
        {pages.map(p => (
          <li key={p.href}>
            <Link href={p.href} className="text-text hover:text-primary transition-colors">
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="p-1 rounded hover:bg-white/10 transition-colors">
        {dark ? <Moon size={20} className="text-primary" /> : <Sun size={20} className="text-primary" />}
      </button>
    </nav>
  );
}
