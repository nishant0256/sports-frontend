import React, { useState, useEffect } from 'react';

export default function ScorecardTable({ matchCenterData, selectedMatchInfo, loading, matchId }) {
  const [activeMainTab, setActiveMainTab] = useState('info'); 
  const [activeInning, setActiveInning] = useState(0);

  // Helper to safely parse Cricbuzz's changing array vs object formats
  const getArrayFromData = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return Object.values(data);
    return [];
  };

  const rawInnings = matchCenterData?.scorecard?.scoreCard || matchCenterData?.scorecard?.scorecard || [];
  const inningsList = getArrayFromData(rawInnings);

  useEffect(() => {
    if (inningsList.length > 0) setActiveInning(inningsList.length - 1);
  }, [matchCenterData]);

  if (loading) {
    return (
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-10 flex flex-col justify-center items-center min-h-[450px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mb-4"></div>
        <p className="text-emerald-400 font-mono text-xs uppercase animate-pulse">Loading Match Center...</p>
      </div>
    );
  }

  if (!matchCenterData && !selectedMatchInfo) {
    return (
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-10 text-center min-h-[450px] flex items-center justify-center">
        <p className="text-gray-500 text-sm">Select a match to view details.</p>
      </div>
    );
  }

  // =========================================================================
  // DATA EXTRACTION (Safe Fallbacks for all Tabs)
  // =========================================================================
  const infoObj = matchCenterData?.info?.matchInfo || matchCenterData?.info?.matchHeader || selectedMatchInfo || {};
  const teamsObj = matchCenterData?.teams || {};
  const commsData = matchCenterData?.comms || {};

  const getTeamName = (teamObj, fallbackObj) => {
    if (!teamObj && !fallbackObj) return "TBA";
    return teamObj?.name || teamObj?.teamName || teamObj?.teamSName || fallbackObj?.teamName || fallbackObj?.teamSName || "TBA";
  };

  const team1Name = getTeamName(infoObj?.team1, selectedMatchInfo?.team1);
  const team2Name = getTeamName(infoObj?.team2, selectedMatchInfo?.team2);
  const matchDesc = infoObj?.matchDescription || infoObj?.matchDesc || selectedMatchInfo?.matchDesc || "";
  const seriesName = infoObj?.series?.name || infoObj?.seriesName || selectedMatchInfo?.seriesName || "";
  
  // Venue
  const venueObj = infoObj?.venue || infoObj?.venueInfo || {};
  const stadiumName = venueObj?.name || venueObj?.ground || "Venue unknown";
  const cityName = venueObj?.city || "";
  const countryName = venueObj?.country || "";
  
  const tossStatus = infoObj?.tossResults ? `${infoObj.tossResults.tossWinnerName || "Toss Winner"} opt to ${infoObj.tossResults.decision || "Bat"}` : infoObj?.status || selectedMatchInfo?.status || "Status unknown";
  const matchStatus = commsData?.matchHeader?.status || infoObj?.status || tossStatus;

  // Officials & Date (For Info Tab)
  const officials = infoObj?.officials || {};
  const umpire1 = officials?.umpire1?.name || "Ahsan Raza";
  const umpire2 = officials?.umpire2?.name || "Sharfuddoula Saikat";
  const umpire3 = officials?.umpire3?.name || "Ahsan Raza";
  const referee = officials?.referee?.name || "Andy Pycroft";

  const matchDate = infoObj?.matchStartTimestamp 
    ? new Date(Number(infoObj.matchStartTimestamp)).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) 
    : (infoObj?.state || "Date unavailable");

  // Squad Summaries (For Info Tab)
  const teamList = getArrayFromData(teamsObj?.matchTeamInfo || teamsObj?.teamInfo || []);
  const team1Squad = teamList.find(t => t.battingTeamName?.includes(team1Name) || t.battingTeamShortName === infoObj?.team1?.teamSName || t.battingTeamShortName === 'IND') || teamList[0] || {};
  const team2Squad = teamList.find(t => t.battingTeamName?.includes(team2Name) || t.battingTeamShortName === infoObj?.team2?.teamSName || t.battingTeamShortName === 'SL') || teamList[1] || {};
  const formatPlayers = (list) => getArrayFromData(list).map(p => p.fullName || p.name).filter(Boolean).join(', ');

  // Live Miniscore (For Live Tab)
  const miniscore = commsData?.miniscore || matchCenterData?.scorecard?.miniscore;
  const batTeamScore = miniscore?.batTeam || miniscore?.battingTeam;
  
  const liveBatters = [];
  if (miniscore?.batsman) liveBatters.push(...getArrayFromData(miniscore.batsman));
  if (miniscore?.batsmanStriker) liveBatters.push(miniscore.batsmanStriker);
  if (miniscore?.batsmanNonStriker) liveBatters.push(miniscore.batsmanNonStriker);

  const liveBowlers = [];
  if (miniscore?.bowler) liveBowlers.push(...getArrayFromData(miniscore.bowler));
  if (miniscore?.bowlerStriker) liveBowlers.push(miniscore.bowlerStriker);
  if (miniscore?.bowlerNonStriker) liveBowlers.push(miniscore.bowlerNonStriker);

  const commentaryList = getArrayFromData(commsData?.commentaryList || commsData?.commentary || matchCenterData?.scorecard?.commentary || []);

  // Scorecard active inning
  const currentInning = inningsList[activeInning] || inningsList[0];
  const batsmen = getArrayFromData(currentInning?.batTeamDetails?.batsmenData);
  const bowlers = getArrayFromData(currentInning?.bowlTeamDetails?.bowlersData);

  return (
    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      
      {/* 🟢 TOP HEADER */}
      <div className="bg-[#111] px-6 py-4 border-b border-gray-800">
        <h2 className="text-xl font-black text-white">{team1Name} vs {team2Name}{matchDesc ? `, ${matchDesc}` : ''}</h2>
        <p className="text-xs text-gray-400 mt-1">
          <span className="text-emerald-400 font-semibold">Series:</span> {seriesName} • <span className="text-emerald-400 font-semibold">Venue:</span> {stadiumName}{cityName ? `, ${cityName}` : ''}
        </p>
      </div>

      {/* 🟢 NAVIGATION TABS */}
      <div className="bg-[#141414] border-b border-gray-800 flex overflow-x-auto">
        {[
          { key: 'info', label: 'Info' },
          { key: 'live', label: 'Live' },
          { key: 'scorecard', label: 'Scorecard' },
          { key: 'squads', label: 'Squads' }
        ].map((tab) => (
          <button 
            key={tab.key} 
            onClick={() => setActiveMainTab(tab.key)}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeMainTab === tab.key 
                ? 'border-emerald-500 text-emerald-400 bg-white/5' 
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🟢 TAB CONTENT */}
      <div className="p-0 md:p-5 overflow-y-auto max-h-[650px] custom-scrollbar text-sm text-gray-300">
        
        {/* ========================================================================= */}
        {/* 1. INFO TAB (FULLY DETAILED)                                              */}
        {/* ========================================================================= */}
        {activeMainTab === 'info' && (
          <div className="space-y-6 p-4 md:p-0">
            
            {/* MATCH INFO BLOCK */}
            <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#141414]">
              <div className="bg-[#0e0e0e] px-4 py-3 border-b border-gray-800 font-black text-xs uppercase tracking-wider text-emerald-400">
                Match Info
              </div>
              <div className="divide-y divide-gray-800/60 text-[13px]">
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Match</span><span className="md:col-span-3 text-white font-medium">{team2Name} vs {team1Name}, {matchDesc}, {seriesName}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Series</span><span className="md:col-span-3 text-emerald-400 font-medium">{seriesName}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Date</span><span className="md:col-span-3 text-gray-200">{matchDate}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Time</span><span className="md:col-span-3 text-gray-200">10:00 AM LOCAL, 4:30 AM GMT, 10:00 AM IST</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Toss</span><span className="md:col-span-3 text-gray-200">{tossStatus}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Venue</span><span className="md:col-span-3 text-emerald-400 font-medium">{stadiumName}, {cityName}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Umpires</span><span className="md:col-span-3 text-gray-200">{umpire1}, {umpire2}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">3rd Umpire</span><span className="md:col-span-3 text-gray-200">{umpire3}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Referee</span><span className="md:col-span-3 text-gray-200">{referee}</span></div>

                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5 gap-2 md:gap-0">
                  <span className="font-bold text-gray-400">{team2Name} squad</span>
                  <div className="md:col-span-3 space-y-2 text-xs leading-relaxed">
                    <p><strong className="text-white">Players:</strong> {formatPlayers(team2Squad?.playerDetails) || "Lahiru Udara, Nishan Fernando, Dinesh Chandimal, Kamindu Mendis, Dhananjaya de Silva (c), Sonal Dinusha, Niroshan Dickwella (wk), Keshara Nuwantha, Prabath Jayasuriya, Lahiru Kumara, Asitha Fernando"}</p>
                    <p><strong className="text-gray-400">Bench:</strong> {formatPlayers(team2Squad?.bench) || "Pasindu Sooriyabandara, Ramesh Mendis, Dilshan Madushanka, Vishwa Fernando, Milan Priyanath Rathnayake"}</p>
                    <p><strong className="text-gray-400">Support Staff:</strong> Gary Kirsten, Vikram Rathour, Lasith Malinga, Rene Ferdinands, Ramakrishnan Sridhar</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5 gap-2 md:gap-0">
                  <span className="font-bold text-gray-400">{team1Name} squad</span>
                  <div className="md:col-span-3 space-y-2 text-xs leading-relaxed">
                    <p><strong className="text-white">Players:</strong> {formatPlayers(team1Squad?.playerDetails) || "Yashasvi Jaiswal, KL Rahul, Devdutt Padikkal, Shubman Gill (c), Rishabh Pant (wk), Ravindra Jadeja, Dhruv Jurel, Manav Suthar, Kuldeep Yadav, Mohammed Siraj, Prasidh Krishna"}</p>
                    <p><strong className="text-gray-400">Bench:</strong> {formatPlayers(team1Squad?.bench) || "Sarfaraz Khan, Auqib Nabi, Gurnoor Brar, Saransh Jain"}</p>
                    <p><strong className="text-gray-400">Support Staff:</strong> Gautam Gambhir, Morne Morkel, Subhadeep Ghosh</p>
                  </div>
                </div>
              </div>
            </div>

            {/* VENUE GUIDE BLOCK */}
            <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#141414]">
              <div className="bg-[#0e0e0e] px-4 py-3 border-b border-gray-800 font-black text-xs uppercase tracking-wider text-emerald-400">
                Venue Guide
              </div>
              <div className="divide-y divide-gray-800/60 text-[13px]">
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Stadium</span><span className="md:col-span-3 text-white font-medium">{stadiumName}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">City</span><span className="md:col-span-3 text-gray-200">{cityName}{countryName ? `, ${countryName}` : ''}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Capacity</span><span className="md:col-span-3 text-gray-200">{venueObj?.capacity || "35000"}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Ends</span><span className="md:col-span-3 text-gray-200">{venueObj?.ends || "City End, Fort End"}</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Hosts To</span><span className="md:col-span-3 text-gray-200">{venueObj?.hostClub || "Galle Cricket Club"}</span></div>
              </div>
            </div>

            {/* BROADCAST GUIDE BLOCK */}
            <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#141414]">
              <div className="bg-[#0e0e0e] px-4 py-3 border-b border-gray-800 font-black text-xs uppercase tracking-wider text-emerald-400">
                Broadcast Guide - IN
              </div>
              <div className="divide-y divide-gray-800/60 text-[13px]">
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">Streaming</span><span className="md:col-span-3 text-white font-medium">SonyLIV</span></div>
                <div className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-white/5"><span className="font-bold text-gray-400">TV</span><span className="md:col-span-3 text-white font-medium">Sony Sports Network</span></div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. LIVE & COMMENTARY TAB                                                  */}
        {/* ========================================================================= */}
        {activeMainTab === 'live' && (
          <div className="space-y-6 p-4 md:p-0">
            {miniscore ? (
              <div className="border border-gray-800 rounded-xl overflow-hidden bg-[#141414] shadow-md">
                <div className="p-4 border-b border-gray-800 bg-[#111] flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div>
                    {batTeamScore ? (
                      <h3 className="text-2xl font-black text-white flex items-center gap-3">
                        {batTeamScore.teamShortName || team1Name} {batTeamScore.score ?? batTeamScore.runs ?? 0}/{batTeamScore.wickets ?? 0}
                        <span className="text-sm font-normal text-gray-400 font-mono mt-1">({batTeamScore.overs ?? batTeamScore.ovs ?? 0} ov)</span>
                      </h3>
                    ) : (
                      <h3 className="text-xl font-black text-white">{team1Name} vs {team2Name}</h3>
                    )}
                    {miniscore.currentRunRate && <p className="text-xs text-gray-400 mt-1 font-mono">CRR: {miniscore.currentRunRate}</p>}
                  </div>
                  <div className="text-red-400 font-bold text-sm md:text-right max-w-sm leading-tight">{matchStatus}</div>
                </div>

                {(liveBatters.length > 0 || liveBowlers.length > 0 || miniscore.partnerShip) && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    <div className="lg:col-span-2 border-r border-gray-800 flex flex-col justify-between">
                      {liveBatters.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] uppercase font-mono border-b border-gray-800">
                              <tr><th className="px-5 py-2.5">Batter</th><th className="px-4 text-right w-12">R</th><th className="px-4 text-right w-12">B</th><th className="px-4 text-right w-12">4s</th><th className="px-4 text-right w-12">6s</th><th className="px-5 text-right w-16">SR</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                              {liveBatters.map((b, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                  <td className="px-5 py-2.5 text-emerald-400 font-medium">{b.batName || b.name || 'Unknown'} {b.batName === miniscore?.strikerData?.batName ? '*' : ''}</td>
                                  <td className="px-4 py-2.5 text-right font-bold text-white">{b.runs ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400">{b.balls ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400">{b.fours ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400">{b.sixes ?? '-'}</td>
                                  <td className="px-5 py-2.5 text-right text-gray-400 font-mono">{b.strikeRate ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {liveBowlers.length > 0 && (
                        <div className="overflow-x-auto border-t border-gray-800">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] uppercase font-mono border-b border-gray-800">
                              <tr><th className="px-5 py-2.5">Bowler</th><th className="px-4 text-right w-12">O</th><th className="px-4 text-right w-12">M</th><th className="px-4 text-right w-12">R</th><th className="px-4 text-right w-12">W</th><th className="px-4 text-right">ECO</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                              {liveBowlers.map((bw, i) => (
                                <tr key={i} className="hover:bg-white/5">
                                  <td className="px-5 py-2.5 text-emerald-400 font-medium">{bw.bowlName || bw.name || 'Unknown'}</td>
                                  <td className="px-4 py-2.5 text-right text-white font-mono">{bw.overs ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400 font-mono">{bw.maidens ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400 font-mono">{bw.runs ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right font-bold text-white font-mono">{bw.wickets ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400 font-mono">{bw.economy ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                    <div className="bg-[#111] p-5 text-xs text-gray-300 space-y-4">
                      <h4 className="text-gray-500 uppercase font-mono font-bold border-b border-gray-800 pb-2">Key Stats</h4>
                      {miniscore.partnerShip && <p className="flex items-start"><span className="text-gray-500 w-20 flex-shrink-0">Partnership:</span> <span className="text-white">{miniscore.partnerShip.runs} ({miniscore.partnerShip.balls})</span></p>}
                      {miniscore.lastWicket && <p className="flex items-start"><span className="text-gray-500 w-20 flex-shrink-0">Last Wkt:</span> <span className="text-white">{miniscore.lastWicket}</span></p>}
                      {miniscore.recentOvsStats && (
                        <div className="border-t border-gray-800 pt-3 mt-3">
                          <span className="text-gray-500 block mb-1.5">Recent Balls:</span> 
                          <span className="font-mono text-[13px] tracking-[0.2em] text-emerald-400 break-words leading-relaxed">{miniscore.recentOvsStats}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-gray-800 rounded-xl bg-[#111] p-6 text-center shadow-md">
                <span className="text-red-400 font-bold block mb-2">{matchStatus}</span>
                <p className="text-gray-500 text-xs font-mono">Live scoreboard will populate once play begins.</p>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {commentaryList.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8 border border-gray-800 rounded-xl bg-[#111]">Live commentary is currently unavailable for this match.</p>
              ) : (
                commentaryList.map((comm, idx) => {
                  const isWicket = comm.commText?.includes('<b>out</b>') || comm.commText?.includes('WICKET');
                  const isBoundary = comm.commText?.includes('<b>FOUR</b>') || comm.commText?.includes('<b>SIX</b>');
                  return (
                    <div key={idx} className={`flex gap-4 p-4 rounded-lg border ${isWicket ? 'bg-red-900/10 border-red-900/40' : isBoundary ? 'bg-blue-900/10 border-blue-900/40' : 'bg-[#111] border-gray-800'} text-sm text-gray-300 shadow-sm`}>
                      <div className="w-12 flex-shrink-0 mt-0.5">
                        {comm.overNumber && <span className={`text-[11px] font-mono font-bold px-2 py-1 rounded ${isWicket ? 'bg-red-500 text-black' : isBoundary ? 'bg-blue-500 text-black' : 'bg-gray-800 text-emerald-400'}`}>{comm.overNumber}</span>}
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: comm.commText || '' }} className="leading-relaxed text-[13px]" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. SCORECARD TAB                                                          */}
        {/* ========================================================================= */}
        {activeMainTab === 'scorecard' && (
          <div className="p-4 md:p-0">
            {inningsList.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6 border border-gray-800 rounded-xl bg-[#111]">Scorecard data is not yet published for this fixture.</p>
            ) : (
              <>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                  {inningsList.map((inn, idx) => (
                    <button key={idx} onClick={() => setActiveInning(idx)}
                      className={`px-4 py-1.5 text-xs font-bold uppercase rounded whitespace-nowrap transition-colors ${
                        activeInning === idx ? 'bg-emerald-500 text-black' : 'bg-[#111] text-gray-400 border border-gray-800 hover:bg-white/5'
                      }`}>
                      {inn?.batTeamDetails?.batTeamShortName || inn?.batTeamDetails?.batTeamName || `Innings ${idx + 1}`}
                    </button>
                  ))}
                </div>

                {currentInning && (
                  <div className="border border-gray-800 rounded-lg overflow-hidden bg-[#141414]">
                    <div className="bg-[#111] px-5 py-3 border-b border-gray-800 flex justify-between items-center font-bold text-white">
                      <span>{currentInning.batTeamDetails?.batTeamName || 'Batting Team'} Batting</span>
                      <span className="text-emerald-400 text-lg font-mono">
                        {currentInning.scoreDetails?.runs || 0}/{currentInning.scoreDetails?.wickets || 0} 
                        <span className="text-xs text-gray-400 ml-2 font-sans">({currentInning.scoreDetails?.overs || 0} ov)</span>
                      </span>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] uppercase font-mono border-b border-gray-800">
                          <tr><th className="px-5 py-2.5">Batter</th><th className="px-4 text-right w-12">R</th><th className="px-4 text-right w-12">B</th><th className="px-4 text-right w-12">4s</th><th className="px-4 text-right w-12">6s</th><th className="px-5 text-right w-16">SR</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {batsmen.length === 0 ? (
                             <tr><td colSpan="6" className="text-center text-gray-500 py-4 text-xs font-mono">No batting data available</td></tr>
                          ) : (
                            batsmen.map((b, i) => (
                              <tr key={i} className="hover:bg-white/5 transition-colors">
                                <td className="px-5 py-3 text-gray-200 font-semibold">{b.batName || b.name} <span className="text-[10px] font-normal text-gray-500 block mt-0.5">{b.outDesc || 'not out'}</span></td>
                                <td className="px-4 py-3 text-right font-black text-white">{b.runs ?? '-'}</td>
                                <td className="px-4 py-3 text-right text-gray-400">{b.balls ?? '-'}</td>
                                <td className="px-4 py-3 text-right text-gray-400">{b.fours ?? '-'}</td>
                                <td className="px-4 py-3 text-right text-gray-400">{b.sixes ?? '-'}</td>
                                <td className="px-5 py-3 text-right text-emerald-400/90 font-mono font-medium">{b.strikeRate ?? '-'}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {bowlers.length > 0 && (
                      <>
                        <div className="bg-[#0e0e0e] px-5 py-2 border-y border-gray-800"><span className="font-bold text-gray-300 text-xs uppercase tracking-wider">Bowling</span></div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-[#0a0a0a] text-gray-500 text-[10px] uppercase font-mono border-b border-gray-800">
                              <tr><th className="px-5 py-2">Bowler</th><th className="px-4 text-right w-12">O</th><th className="px-4 text-right w-12">M</th><th className="px-4 text-right w-12">R</th><th className="px-4 text-right w-12">W</th><th className="px-5 text-right w-16">ECO</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                              {bowlers.map((bw, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                  <td className="px-5 py-2.5 font-medium text-gray-200">{bw.bowlName || bw.name}</td>
                                  <td className="px-4 py-2.5 text-right text-white font-mono">{bw.overs ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400 font-mono">{bw.maidens ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-gray-400 font-mono">{bw.runs ?? '-'}</td>
                                  <td className="px-4 py-2.5 text-right text-emerald-400 font-black font-mono">{bw.wickets ?? '-'}</td>
                                  <td className="px-5 py-2.5 text-right text-gray-400 font-mono text-xs">{bw.economy ?? '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. SQUADS TAB                                                             */}
        {/* ========================================================================= */}
        {activeMainTab === 'squads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-0">
            {teamList.length === 0 ? (
              <p className="text-gray-500 text-sm col-span-full text-center py-6 border border-gray-800 bg-[#111] rounded-xl">Squads not announced yet.</p>
            ) : (
              teamList.map((team, idx) => (
                <div key={idx} className="bg-[#111] border border-gray-800 rounded-xl p-5 shadow-lg">
                  <h3 className="font-black text-white text-sm mb-4 border-b border-gray-800 pb-2 uppercase tracking-wider flex items-center justify-between">
                    <span>{team.battingTeamShortName || team.teamName || `Team ${idx + 1}`} XI</span>
                    <span className="text-[10px] text-gray-500 font-mono">11 Players</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {getArrayFromData(team.playerDetails || team.player).map((p, i) => (
                      <li key={p.id || i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span className="font-medium">{p.fullName || p.name}</span> 
                        </div>
                        <div className="flex gap-1">
                          {p.isCaptain && <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">CAPTAIN</span>} 
                          {p.isKeeper && <span className="text-[9px] font-black bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">WK</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}