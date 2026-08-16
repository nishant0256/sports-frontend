import React from 'react';

export default function MatchCard({ 
  title, 
  team1, 
  score1, 
  team2, 
  score2, 
  status, 
  isLive, 
  isSelected,
  isFavorite,
  onToggleFavorite,
  onClick,
  themeColor = "text-emerald-400" 
}) {
  return (
    <div 
      onClick={onClick}
      className={`w-72 flex-shrink-0 bg-[#1a1a1a] rounded-lg border transition flex flex-col justify-between overflow-hidden shadow-lg cursor-pointer ${
        isSelected ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-gray-800 hover:border-gray-600'
      }`}
    >
      {/* Top Bar: Title, Live Badge & Star Button */}
      <div className="px-4 py-2 flex justify-between items-center border-b border-gray-800 bg-[#141414]">
        <span className="text-[11px] font-bold text-gray-400 truncate uppercase max-w-[170px]">{title}</span>
        
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="text-[9px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded animate-pulse">
              LIVE
            </span>
          )}
          
          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // Prevents card selection click
              onToggleFavorite?.();
            }}
            className={`text-sm transition-transform active:scale-125 cursor-pointer ${
              isFavorite ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-gray-600 hover:text-gray-400'
            }`}
            title={isFavorite ? "Remove from PostgreSQL Favorites" : "Save to PostgreSQL Favorites"}
          >
            ★
          </button>
        </div>
      </div>

      {/* Scores Section */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between font-bold text-sm text-white">
          <span>{team1}</span><span>{score1}</span>
        </div>
        <div className="flex justify-between font-bold text-sm text-white">
          <span>{team2}</span><span>{score2}</span>
        </div>
      </div>

      {/* Status Section */}
      <div className="px-4 pb-3 truncate text-[11px] font-semibold text-gray-400">
        <span className={isLive ? themeColor : ''}>{status}</span>
      </div>
    </div>
  );
}