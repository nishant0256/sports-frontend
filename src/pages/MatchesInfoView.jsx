import React, { useEffect, useState } from 'react';
import { fetchMatchesInfo } from '../services/apiClient';

export default function MatchesInfoView() {
  const [data, setData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('International');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchMatchesInfo()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Matches info fetch failed:", err);
        setError("Failed to load match details from Spring Gateway.");
        setLoading(false);
      });
  }, []);

  const typeMatches = data?.typeMatches || [];
  const categories = typeMatches.map((t) => t.matchType).filter(Boolean);

  // Filter current selected category (e.g., International, League, Domestic, Women)
  const currentGroup = typeMatches.find((t) => t.matchType === selectedCategory) || typeMatches[0];
  const seriesMatches = currentGroup?.seriesMatches || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      
      {/* Header & Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white border-l-4 border-emerald-500 pl-3">
            Cricket Match Archive & Info
          </h1>
          <p className="text-xs text-gray-400 mt-1 pl-3">
            Detailed scores, venues, and series results across global formats
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 bg-[#111] p-1.5 rounded-lg border border-gray-800 w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded text-xs font-bold uppercase transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 h-28 animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Series & Matches Feed */}
      {!loading && !error && (
        <div className="space-y-8">
          {seriesMatches.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm font-mono">
              No match details available under "{selectedCategory}".
            </div>
          ) : (
            seriesMatches.map((seriesGroup, idx) => {
              const wrapper = seriesGroup?.seriesAdWrapper || seriesGroup;
              const matchesList = wrapper?.matches || [];
              const seriesName = wrapper?.seriesName || "Cricket Series";

              if (matchesList.length === 0) return null;

              return (
                <div key={idx} className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                  
                  {/* Series Banner */}
                  <div className="bg-[#141414] px-6 py-3 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      🏏 {seriesName}
                    </span>
                    <span className="text-[10px] font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                      {matchesList.length} Matches
                    </span>
                  </div>

                  {/* Matches Grid / Rows */}
                  <div className="divide-y divide-gray-800/70">
                    {matchesList.map((mItem, mIdx) => {
                      const info = mItem?.matchInfo;
                      const score = mItem?.matchScore;
                      
                      const team1 = info?.team1?.teamName || "Team 1";
                      const team1Code = info?.team1?.teamSName || "T1";
                      const team2 = info?.team2?.teamName || "Team 2";
                      const team2Code = info?.team2?.teamSName || "T2";

                      const t1Score = score?.team1Score?.inngs1
                        ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets || 0} (${score.team1Score.inngs1.overs} ov)`
                        : "—";
                      const t2Score = score?.team2Score?.inngs1
                        ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets || 0} (${score.team2Score.inngs1.overs} ov)`
                        : "—";

                      return (
                        <div key={info?.matchId || mIdx} className="p-5 hover:bg-white/5 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Match Info & Venue */}
                          <div className="space-y-1 max-w-md">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{info?.matchDesc}</span>
                              <span className="text-[10px] font-black uppercase bg-gray-800 text-emerald-400 px-1.5 py-0.5 rounded">
                                {info?.matchFormat}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">
                              📍 {info?.venueInfo?.ground}, {info?.venueInfo?.city}
                            </p>
                            <p className="text-xs font-semibold text-emerald-400 mt-1">
                              {info?.status}
                            </p>
                          </div>

                          {/* Scores Display */}
                          <div className="bg-[#111] border border-gray-800 rounded-lg p-3 min-w-[240px] space-y-1.5 font-mono text-xs">
                            <div className="flex justify-between items-center text-gray-200">
                              <span className="font-bold">{team1} ({team1Code})</span>
                              <span className="font-black text-emerald-400">{t1Score}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-200">
                              <span className="font-bold">{team2} ({team2Code})</span>
                              <span className="font-black text-white">{t2Score}</span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}