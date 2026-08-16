import React, { useEffect, useState } from 'react';
import { fetchAllTeams } from '../services/apiClient';

export default function TeamsView() {
  const [teamsData, setTeamsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllTeams()
      .then((data) => {
        setTeamsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Teams fetch failed:", err);
        setError("Failed to load teams from Spring Gateway.");
        setLoading(false);
      });
  }, []);

  const rawList = teamsData?.list || [];

  // Group teams by their section headers (e.g., "Test Teams", "Associate Teams")
  const groupedTeams = [];
  let currentCategory = "International Teams";

  rawList.forEach((item) => {
    // If an item has no teamId, it is a section header from Cricbuzz
    if (!item.teamId && item.teamName) {
      currentCategory = item.teamName;
    } else if (item.teamId) {
      // Find or create the category group
      let group = groupedTeams.find((g) => g.category === currentCategory);
      if (!group) {
        group = { category: currentCategory, teams: [] };
        groupedTeams.push(group);
      }
      group.teams.push(item);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white border-l-4 border-emerald-500 pl-3">
            International Cricket Teams
          </h1>
          <p className="text-xs text-gray-400 mt-1 pl-3">
            Test, ODI, T20 & Associate Member Nations
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-5 h-24 animate-pulse"></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Teams Directory Feed */}
      {!loading && !error && (
        <div className="space-y-10">
          {groupedTeams.map((group, idx) => (
            <div key={idx} className="space-y-4">
              
              {/* Category Header Badge */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider bg-[#141414] px-3 py-1.5 rounded border border-gray-800">
                  🏏 {group.category}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {group.teams.length} Teams
                </span>
              </div>

              {/* Teams Grid */}
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.teams.map((team) => (
                  <div
                    key={team.teamId}
                    className="bg-[#1a1a1a] border border-gray-800 hover:border-emerald-500/50 rounded-xl p-4 transition flex items-center justify-between group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center gap-3 truncate">
                      {/* Avatar / Initials Box */}
                      <div className="w-10 h-10 rounded-lg bg-[#111] border border-gray-700/80 flex items-center justify-center font-black text-xs text-emerald-400 shrink-0 group-hover:border-emerald-500 transition-colors">
                        {team.teamSName || team.teamName.slice(0, 3).toUpperCase()}
                      </div>

                      {/* Team Name & Country */}
                      <div className="truncate">
                        <h3 className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">
                          {team.teamName}
                        </h3>
                        <p className="text-[11px] text-gray-500 font-mono truncate">
                          {team.countryName || team.teamName}
                        </p>
                      </div>
                    </div>

                    {/* Short Code Badge */}
                    <span className="text-[10px] font-black bg-[#111] text-gray-400 border border-gray-800 px-2 py-1 rounded shrink-0">
                      {team.teamSName || "ICC"}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}