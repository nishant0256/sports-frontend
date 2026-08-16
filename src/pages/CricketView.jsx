import React, { useEffect, useState } from 'react';
import MatchCard from '../components/widgets/MatchCard';
import Carousel from '../components/widgets/Carousel';
import ScorecardTable from '../components/widgets/ScorecardTable';
import NewsCard from '../components/widgets/NewsCard';
import { 
  fetchLiveMatches, 
  fetchRecentMatches, 
  fetchUpcomingMatches, 
  fetchScorecard, 
  fetchCricketNews,
  fetchFavoriteMatches,
  saveFavoriteMatch,
  removeFavoriteMatch
} from '../services/apiClient';

export default function CricketView() {
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'upcoming' | 'recent' | 'favorites'
  const [matches, setMatches] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [scorecardData, setScorecardData] = useState(null);
  const [newsList, setNewsList] = useState([]);
  
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingScorecard, setLoadingScorecard] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  // 1. Load favorites from PostgreSQL on mount
  useEffect(() => {
    loadFavoritesFromDb();
  }, []);

  const loadFavoritesFromDb = () => {
    fetchFavoriteMatches()
      .then((data) => setFavoritesList(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load PostgreSQL favorites:", err));
  };

  // 2. Fetch match feeds based on active tab
  useEffect(() => {
    let isMounted = true;
    setLoadingMatches(true);

    if (activeTab === 'favorites') {
      // Show matches from PostgreSQL DB
      setMatches(favoritesList);
      setLoadingMatches(false);
      if (favoritesList.length > 0) {
        setSelectedMatchId(favoritesList[0].matchId);
      } else {
        setSelectedMatchId(null);
        setScorecardData(null);
      }
      return;
    }

    let fetchFn = fetchLiveMatches;
    if (activeTab === 'recent') fetchFn = fetchRecentMatches;
    if (activeTab === 'upcoming') fetchFn = fetchUpcomingMatches;

    fetchFn()
      .then((data) => {
        if (!isMounted) return;

        const extractedMatches = [];
        data?.typeMatches?.forEach((type) => {
          type?.seriesMatches?.forEach((series) => {
            const list = series?.seriesAdWrapper?.matches || series?.matches || [];
            list.forEach((m) => {
              if (m?.matchInfo) extractedMatches.push(m);
            });
          });
        });

        setMatches(extractedMatches);
        setLoadingMatches(false);

        if (extractedMatches.length > 0 && extractedMatches[0]?.matchInfo?.matchId) {
          setSelectedMatchId(extractedMatches[0].matchInfo.matchId);
        } else {
          setSelectedMatchId(null);
          setScorecardData(null);
        }
      })
      .catch((err) => {
        console.error("Match fetch failed:", err);
        if (isMounted) setLoadingMatches(false);
      });

    return () => { isMounted = false; };
  }, [activeTab, favoritesList]);

  // 3. Fetch Scorecard when selectedMatchId changes
  useEffect(() => {
    if (!selectedMatchId) return;

    let isMounted = true;
    setLoadingScorecard(true);

    fetchScorecard(selectedMatchId)
      .then((data) => {
        if (!isMounted) return;
        setScorecardData(data);
        setLastUpdated(new Date().toLocaleTimeString());
        setLoadingScorecard(false);
      })
      .catch((err) => {
        console.error("Scorecard fetch failed:", err);
        if (isMounted) setLoadingScorecard(false);
      });

    return () => { isMounted = false; };
  }, [selectedMatchId]);

  // 4. Fetch News Feed
  useEffect(() => {
    fetchCricketNews()
      .then((data) => setNewsList(data?.storyList || []))
      .catch((err) => console.error("News fetch failed:", err));
  }, []);

  // 5. Toggle Favorite (Save / Remove from PostgreSQL)
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
        team1: info?.team1?.teamSName || info?.team1?.teamName || info?.team1 || "TBA",
        team2: info?.team2?.teamSName || info?.team2?.teamName || info?.team2 || "TBA",
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

  return (
    <div className="animate-fade-in">
      {/* Sub-header Navigation Tabs */}
      <div className="bg-[#111] px-6 py-3 border-b border-gray-800 flex items-center gap-6 overflow-x-auto">
        {[
          { key: 'live', label: 'Live Matches' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'recent', label: 'Recent' },
          { key: 'favorites', label: `★ Favorites (${favoritesList.length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-xs font-bold uppercase tracking-wider transition-colors pb-1 whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Match Cards Carousel */}
      <Carousel loading={loadingMatches}>
        {matches.length === 0 && !loadingMatches ? (
          <div className="text-gray-500 text-xs py-10 px-4 font-mono">
            {activeTab === 'favorites' 
              ? "No favorite matches saved in PostgreSQL yet. Click ★ on any match card to save it!"
              : "No matches found for this feed."}
          </div>
        ) : (
          matches.map((item, idx) => {
            // Support both RapidAPI matchInfo format and flat PostgreSQL FavoriteMatch format
            const info = item.matchInfo || item;
            const score = item.matchScore;
            const matchId = String(info?.matchId);

            const team1Name = info?.team1?.teamSName || info?.team1?.teamName || info?.team1 || "TBA";
            const team2Name = info?.team2?.teamSName || info?.team2?.teamName || info?.team2 || "TBA";

            const team1Score = score?.team1Score?.inngs1 
              ? `${score.team1Score.inngs1.runs}/${score.team1Score.inngs1.wickets || 0}` 
              : '';
            const team2Score = score?.team2Score?.inngs1 
              ? `${score.team2Score.inngs1.runs}/${score.team2Score.inngs1.wickets || 0}` 
              : '';

            const isFav = favoritesList.some((fav) => String(fav.matchId) === matchId);

            return (
              <MatchCard
                key={matchId || idx}
                title={info?.seriesName || "Cricket Match"}
                team1={team1Name}
                score1={team1Score}
                team2={team2Name}
                score2={team2Score}
                status={info?.status || "Scheduled"}
                isLive={activeTab === 'live'}
                isSelected={String(selectedMatchId) === matchId}
                isFavorite={isFav}
                onToggleFavorite={() => handleToggleFavorite(item)}
                onClick={() => setSelectedMatchId(matchId)}
                themeColor="text-emerald-400"
              />
            );
          })
        )}
      </Carousel>

      {/* Detailed Scorecard Table & Sidebar News */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ScorecardTable 
            scorecardData={scorecardData} 
            loading={loadingScorecard} 
            lastUpdated={lastUpdated} 
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