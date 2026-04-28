import React from 'react';
import { Shield, Info, Menu } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'dashboard' | 'history' | 'about') => void;
  activeView: string;
}

export function Header({ onNavigate, activeView }: HeaderProps) {
  const handleDownload = () => {
    window.location.href = '/api/download-extension';
  };

  return (
    <header className="fixed top-0 z-50 w-full flex justify-center py-6 px-4">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('dashboard')}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition-transform group-hover:scale-110">
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-white">
            Clause<span className="text-mint">Lens</span>
          </span>
        </div>
        
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 bg-[#121923] border border-white/10 p-1.5 rounded-full shadow-2xl">
          <button 
            onClick={() => onNavigate('dashboard')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeView === 'dashboard' ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            Analyzer
          </button>
          <button 
            onClick={() => onNavigate('history')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeView === 'history' ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            History
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeView === 'about' ? 'bg-white/5 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
          >
            About
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownload}
            className="rounded-xl bg-mint px-4 py-2 text-sm font-extrabold text-[#050B10] transition-all hover:scale-105 active:scale-95"
          >
            Install Extension
          </button>
        </div>
      </div>
    </header>
  );
}
