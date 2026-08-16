import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-black text-white italic tracking-wider">
          SPORTS<span className="text-red-600">DASH</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-bold text-gray-400">
          <Link 
            to="/cricket" 
            className={`${location.pathname.startsWith('/cricket') || location.pathname === '/' ? 'text-white border-b-2 border-emerald-500 pb-1' : 'hover:text-white transition-colors'}`}
          >
            Cricket
          </Link>
          <Link 
            to="/football" 
            className={`${location.pathname.startsWith('/football') ? 'text-white border-b-2 border-blue-500 pb-1' : 'hover:text-white transition-colors'}`}
          >
            Football
          </Link>
        </div>
      </div>
      <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded font-bold text-sm transition-colors">
        LOG IN
      </button>
    </nav>
  );
}