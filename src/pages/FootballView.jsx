import React, { useEffect, useState } from 'react';
import { fetchFootballData } from '../services/apiClient';

export default function FootballView() {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFootballData("1417903")
      .then((data) => {
        setMatchData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Football fetch failed:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-black text-white mb-6 border-l-4 border-blue-500 pl-3">
        Football Match Center
      </h1>

      {loading ? (
        <div className="text-gray-500 font-mono animate-pulse">Loading match data...</div>
      ) : (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
          <pre className="text-xs text-gray-400 overflow-x-auto">
            {JSON.stringify(matchData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}