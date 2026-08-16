import React from 'react';

export default function ScorecardTable({ scorecardData, loading, lastUpdated, matchId }) {
  const currentInnings = scorecardData?.scorecard?.[0];

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className="px-6 py-4 bg-[#141414] border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-white font-bold">
          {scorecardData ? `Match Scorecard (#${matchId})` : "Select a match to view details"}
        </h2>
        {lastUpdated && <span className="text-xs text-gray-500 font-mono">UPDATED: {lastUpdated}</span>}
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-500 font-mono animate-pulse">Loading detailed scorecard from Gateway...</div>
      ) : currentInnings ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#111] text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Batter</th>
                <th className="px-6 py-3 text-right">R</th>
                <th className="px-6 py-3 text-right">B</th>
                <th className="px-6 py-3 text-right">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {currentInnings?.batsman?.map((b, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-3">
                    <div className="font-bold text-white">{b.name}</div>
                    <div className="text-[10px] text-gray-500">{b.outdec}</div>
                  </td>
                  <td className="px-6 py-3 text-right font-black">{b.runs}</td>
                  <td className="px-6 py-3 text-right">{b.balls}</td>
                  <td className="px-6 py-3 text-right text-gray-500 font-mono">{b.strkrate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 text-sm">
          {matchId ? "Scorecard detail not yet published for this fixture." : "Click any match card to load its detailed scorecard."}
        </div>
      )}
    </div>
  );
}