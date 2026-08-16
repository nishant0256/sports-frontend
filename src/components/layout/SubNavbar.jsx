import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SubNavbar() {
  const location = useLocation();

  const links = [
    { label: "Matches", path: "/cricket" },
    { label: "Schedule", path: "/cricket/schedule" },
    { label: "By Team", path: "/cricket/teams" },
    { label: "By Series", path: "/cricket/series" },
    { label: "Match Info", path: "/cricket/match-info" },
  ];

  return (
    <div className="bg-[#141414] border-b border-gray-800 px-6 py-2">
      <div className="flex gap-6 text-xs font-bold uppercase tracking-widest overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${
              location.pathname === link.path
                ? 'text-emerald-400 border-b-2 border-emerald-400 pb-1'
                : 'text-gray-500 hover:text-white transition-colors'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}