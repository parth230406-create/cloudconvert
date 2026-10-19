import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const links = [{ path: '/', label: 'Home' }, { path: '/tools', label: 'All Tools' }, { path: '/about', label: 'About' }];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-sky-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white text-xl">☁️</div>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent">CloudConvert</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.path} to={l.path} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${loc.pathname === l.path ? 'bg-sky-100 text-sky-700' : 'text-sky-600 hover:bg-sky-50'}`}>{l.label}</Link>
            ))}
          </div>
          <button className="md:hidden p-2 text-sky-600" onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-sky-100 px-4 py-3 space-y-1">
          {links.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setOpen(false)} className={`block px-4 py-3 rounded-lg text-sm font-medium ${loc.pathname === l.path ? 'bg-sky-100 text-sky-700' : 'text-sky-600'}`}>{l.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;