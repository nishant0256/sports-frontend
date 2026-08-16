import React, { useEffect, useState } from 'react';
import { fetchGlobalSchedule } from '../services/apiClient';

export default function ScheduleView() {
  const [scheduleData, setScheduleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGlobalSchedule()
      .then((data) => {
        setScheduleData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Schedule fetch failed:", err);
        setError("Failed to load schedule from Spring Gateway.");
        setLoading(false);
      });
  }, []);

  // Filter out ad blocks and extract date sections
  const scheduleDays = scheduleData?.matchScheduleMap?.filter(
    (item) => item?.scheduleAdWrapper
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white border-l-4 border-emerald-500 pl-3">
            Global Cricket Schedule
          </h1>
          <p className="text-xs text-gray-400 mt-1 pl-3">
            International, League & T20 Fixtures
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 animate-pulse space-y-4">
              <div className="h-4 w-32 bg-gray-800 rounded"></div>
              <div className="h-16 bg-gray-800/50 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Schedule Feed */}
      {!loading && !error && (
        <div className="space-y-8">
          {scheduleDays.length === 0 ? (
            <div className="text-gray-500 text-center py-12">No schedule data available.</div>
          ) : (
            scheduleDays.map((dayItem, dayIdx) => {
              const wrapper = dayItem.scheduleAdWrapper;
              const dateStr = wrapper?.date;
              const seriesList = wrapper?.matchScheduleList || [];

              return (
                <div key={dayIdx} className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                  
                  {/* Date Sticky Header */}
                  <div className="bg-[#141414] px-6 py-3 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      📅 {dateStr}
                    </span>
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded font-mono">
                      {seriesList.length} Series
                    </span>
                  </div>

                  {/* Series & Matches List */}
                  <div className="divide-y divide-gray-800/60">
                    {seriesList.map((series, sIdx) => (
                      <div key={sIdx} className="p-6 space-y-4">
                        
                        {/* Series Name Badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                            {series.seriesName}
                          </span>
                          {series.seriesCategory && (
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded uppercase font-bold">
                              {series.seriesCategory}
                            </span>
                          )}
                        </div>

                        {/* Fixture Cards Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {series.matchInfo?.map((match) => {
                            const isT20 = match.matchFormat === 'T20';
                            const isODI = match.matchFormat === 'ODI';

                            return (
                              <div 
                                key={match.matchId}
                                className="bg-[#111] border border-gray-800 hover:border-gray-700 rounded-lg p-4 transition flex flex-col justify-between space-y-3"
                              >
                                {/* Match Info Bar */}
                                <div className="flex justify-between items-center text-xs text-gray-400 border-b border-gray-800/80 pb-2">
                                  <span className="font-semibold text-gray-300">{match.matchDesc}</span>
                                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                    isT20 ? 'bg-purple-900/60 text-purple-300 border border-purple-700' :
                                    isODI ? 'bg-blue-900/60 text-blue-300 border border-blue-700' :
                                    'bg-amber-900/60 text-amber-300 border border-amber-700'
                                  }`}>
                                    {match.matchFormat}
                                  </span>
                                </div>

                                {/* Teams Row */}
                                <div className="flex justify-between items-center py-1 px-2">
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-white text-base">{match.team1?.teamName}</span>
                                    <span className="text-xs text-gray-500 font-mono">({match.team1?.teamSName})</span>
                                  </div>
                                  <span className="text-xs font-black text-gray-600">VS</span>
                                  <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 font-mono">({match.team2?.teamSName})</span>
                                    <span className="font-bold text-white text-base">{match.team2?.teamName}</span>
                                  </div>
                                </div>

                                {/* Venue Details */}
                                {match.venueInfo && (
                                  <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-800/40 flex items-center justify-between">
                                    <span className="truncate">📍 {match.venueInfo.ground}, {match.venueInfo.city}</span>
                                    <span className="text-gray-600 font-mono">{match.venueInfo.country}</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
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