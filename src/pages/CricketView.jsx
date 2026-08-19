import React, { useEffect, useState } from 'react';
import MatchCard from '../components/widgets/MatchCard';
import Carousel from '../components/widgets/Carousel';
import ScorecardTable from '../components/widgets/ScorecardTable';
import NewsCard from '../components/widgets/NewsCard';
import { 
  fetchLiveMatches, fetchRecentMatches, fetchUpcomingMatches, 
  fetchMatchInfo, fetchScorecard, fetchScorecardV2, fetchMatchTeam, fetchMatchCommentaries, 
  fetchCricketNews, fetchFavoriteMatches, saveFavoriteMatch, removeFavoriteMatch
} from '../services/apiClient';

export default function CricketView() {
  const [activeTab, setActiveTab] = useState('live');
  const [matches, setMatches] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [matchCenterData, setMatchCenterData] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingScorecard, setLoadingScorecard] = useState(false);

  // 1. Load favorites and news on mount
  useEffect(() => {
    fetchFavoriteMatches().then((data) => setFavoritesList(Array.isArray(data) ? data : []));
    fetchCricketNews().then((data) => setNewsList(data?.storyList || []));
  }, []);

  // 2. Fetch match feeds based on active tab
  useEffect(() => {
    let isMounted = true;
    setLoadingMatches(true);

    if (activeTab === 'favorites') {
      setMatches(favoritesList);
      setLoadingMatches(false);
      if (favoritesList.length > 0) setSelectedMatchId(favoritesList[0].matchId);
      return;
    }

    let fetchFn = activeTab === 'recent' ? fetchRecentMatches : activeTab === 'upcoming' ? fetchUpcomingMatches : fetchLiveMatches;
    
    fetchFn().then((data) => {
      if (!isMounted) return;
      const extractedMatches = [];
      data?.typeMatches?.forEach(type => type?.seriesMatches?.forEach(series => {
        (series?.seriesAdWrapper?.matches || series?.matches || []).forEach(m => {
          if (m?.matchInfo) extractedMatches.push(m);
        });
      }));

      setMatches(extractedMatches);
      setLoadingMatches(false);
      if (extractedMatches.length > 0) setSelectedMatchId(extractedMatches[0].matchInfo.matchId);
    });
    return () => { isMounted = false; };
  }, [activeTab, favoritesList]);

  // 3. Fetch Full Match Center Details (Robust V1 + V2 Fallback)
  useEffect(() => {
    if (!selectedMatchId) return;
    let isMounted = true;
    setLoadingScorecard(true);

    Promise.all([
      fetchMatchInfo(selectedMatchId).catch(() => null),
      fetchScorecardV2(selectedMatchId).catch(() => null),
      fetchScorecard(selectedMatchId).catch(() => null), // V1 Fallback
      fetchMatchTeam(selectedMatchId).catch(() => null),
      fetchMatchCommentaries(selectedMatchId).catch(() => null)
    ]).then(([info, scorecardV2, scorecardV1, teams, comms]) => {
      if (!isMounted) return;

      // Ensure we always have a valid scorecard array, preferring V2 if available
      const bestScorecard = (scorecardV2 && (scorecardV2.scoreCard || scorecardV2.scorecard)) ? scorecardV2 : scorecardV1;

      setMatchCenterData({ info, scorecard: bestScorecard, teams, comms });
      setLoadingScorecard(false);
    });

    return () => { isMounted = false; };
  }, [selectedMatchId]);

  // 4. Toggle PostgreSQL Favorite Handler
  const handleToggleFavorite = async (matchItem) => {
    const info = matchItem.matchInfo || matchItem;
    const matchId = String(info?.matchId);
    const isFav = favoritesList.some((fav) => String(fav.matchId) === matchId);

    if (isFav) {
      try {
        await removeFavoriteMatch(matchId);
        setFavoritesList((prev) => prev.filter((f) => String(f.matchId) !== matchId));
      } catch (err) {
        console.error("Failed to delete favorite from database:", err);
      }
    } else {
      const payload = {
        matchId: matchId,
        seriesName: info?.seriesName || "Cricket Match",
        team1: info?.team1?.teamSName || info?.team1?.teamName || "TBA",
        team2: info?.team2?.teamSName || info?.team2?.teamName || "TBA",
        matchFormat: info?.matchFormat || "ODI",
        status: info?.status || "Scheduled"
      };

      try {
        const saved = await saveFavoriteMatch(payload);
        setFavoritesList((prev) => [...prev, saved]);
      } catch (err) {
        console.error("Failed to save favorite to database:", err);
      }
    }
  };

  // Extract the local info we already have to guarantee the UI Header renders
  const selectedMatch = matches.find(m => String((m.matchInfo || m).matchId) === String(selectedMatchId)) 
                     || favoritesList.find(m => String(m.matchId) === String(selectedMatchId));
  const selectedMatchInfo = selectedMatch?.matchInfo || selectedMatch;

  return (
    <div className="animate-fade-in">
      
      {/* TABS */}
      <div className="bg-[#111] px-6 py-3 border-b border-gray-800 flex items-center gap-6 overflow-x-auto">
        {[{ key: 'live', label: 'Live' }, { key: 'upcoming', label: 'Upcoming' }, { key: 'recent', label: 'Recent' }, { key: 'favorites', label: `★ Favorites (${favoritesList.length})` }].map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`text-xs font-bold uppercase tracking-wider pb-1 ${activeTab === tab.key ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-gray-500 hover:text-gray-300'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* CAROUSEL */}
      <Carousel loading={loadingMatches}>
        {matches.map((item, idx) => {
          const info = item.matchInfo || item;
          const score = item.matchScore; // Extract score for the carousel
          const matchId = String(info.matchId);
          const isFav = favoritesList.some((fav) => String(fav.matchId) === matchId);

          // Dynamically format the scores for the MatchCard
          const team1Score = score?.team1Score?.inngs1 ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets || 0}` : '';
          const team2Score = score?.team2Score?.inngs1 ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets || 0}` : '';

          return (
            <MatchCard 
              key={matchId || idx}
              title={info.seriesName || "Cricket Match"}
              team1={info.team1?.teamSName || info.team1?.teamName || "T1"} 
              score1={team1Score}
              team2={info.team2?.teamSName || info.team2?.teamName || "T2"} 
              score2={team2Score}
              status={info.status || "Scheduled"}
              isLive={activeTab === 'live'}
              isSelected={String(selectedMatchId) === matchId}
              isFavorite={isFav}
              onToggleFavorite={() => handleToggleFavorite(item)}
              onClick={() => setSelectedMatchId(matchId)}
            />
          );
        })}
      </Carousel>

      {/* MATCH CENTER & NEWS */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScorecardTable 
            matchCenterData={matchCenterData} 
            selectedMatchInfo={selectedMatchInfo}
            loading={loadingScorecard} 
            matchId={selectedMatchId} 
          />
        </div>
        <div>
          <NewsCard newsList={newsList} />
        </div>
      </div>
    </div>
  );
}