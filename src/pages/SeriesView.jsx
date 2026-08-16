import React, { useEffect, useState } from 'react';
import { fetchAllSeries } from '../services/apiClient';

export default function SeriesView() {
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllSeries()
      .then((data) => {
        setSeriesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Series fetch failed:", err);
        setError("Failed to load series from Spring Gateway.");
        setLoading(false);
      });
  }, []);

  // Handle various Cricbuzz series response structures (seriesMapProto, seriesList, or list)
  const seriesGroups = seriesData?.seriesMapProto || seriesData?.seriesMap || seriesData?.list || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white border-l-4 border-emerald-500 pl-3">
            Featured Series & Tournaments
          </h1>
          <p className="text-xs text-gray-400 mt-1 pl-3">
            International Tours, T20 Leagues & Domestic Competitions
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 animate-pulse h-24"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Series Directory Feed */}
      {!loading && !error && (
        <div className="space-y-8">
          {seriesGroups.length === 0 ? (
            <div className="text-gray-500 text-center py-12">No series data available at the moment.</div>
          ) : (
            seriesGroups.map((group, idx) => {
              const dateHeader = group.date || group.month || group.name || "Ongoing & Upcoming";
              const seriesList = group.series || [group];

              return (
                <div key={idx} className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                  
                  {/* Group Header */}
                  <div className="bg-[#141414] px-6 py-3 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      🏏 {dateHeader}
                    </span>
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                      {seriesList.length} Tournaments
                    </span>
                  </div>

                  {/* Series Items */}
                  <div className="divide-y divide-gray-800/60">
                    {seriesList.map((item, sIdx) => (
                      <div
                        key={item.id || item.seriesId || sIdx}
                        className="p-5 hover:bg-white/5 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-bold text-white text-base hover:text-emerald-400 transition-colors cursor-pointer">
                            {item.name || item.seriesName}
                          </h3>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            {item.startDt && (
                              <span>📅 Starts: {new Date(parseInt(item.startDt)).toLocaleDateString()}</span>
                            )}
                            {item.endDt && (
                              <span>Ends: {new Date(parseInt(item.endDt)).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-[#111] text-gray-300 border border-gray-800 px-2.5 py-1 rounded">
                            {item.type || item.category || "International"}
                          </span>
                        </div>
                      </div>
                    ))}
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