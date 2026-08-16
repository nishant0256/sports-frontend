const GATEWAY_URL = "http://localhost:8080/api";

// --- CRICKET ENDPOINTS ---
export const fetchLiveMatches = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/matches/live`);
  if (!res.ok) throw new Error("Failed to fetch live matches");
  return res.json();
};

export const fetchRecentMatches = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/matches/recent`);
  if (!res.ok) throw new Error("Failed to fetch recent matches");
  return res.json();
};

export const fetchUpcomingMatches = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/matches/upcoming`);
  if (!res.ok) throw new Error("Failed to fetch upcoming matches");
  return res.json();
};

export const fetchScorecard = async (matchId) => {
  const res = await fetch(`${GATEWAY_URL}/cricket/scorecard/${matchId}`);
  if (!res.ok) throw new Error("Failed to fetch scorecard");
  return res.json();
};

export const fetchGlobalSchedule = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/schedule`);
  if (!res.ok) throw new Error("Failed to fetch schedule");
  return res.json();
};

export const fetchAllTeams = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/teams`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return res.json();
};

export const fetchAllSeries = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/series`);
  if (!res.ok) throw new Error("Failed to fetch series");
  return res.json();
};

export const fetchRankings = async (formatType = "odi") => {
  const res = await fetch(`${GATEWAY_URL}/cricket/rankings?formatType=${formatType}`);
  if (!res.ok) throw new Error("Failed to fetch rankings");
  return res.json();
};

export const fetchCricketNews = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/news/list`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
};

// --- FOOTBALL ENDPOINTS ---
export const fetchFootballData = async (matchId) => {
  const res = await fetch(`${GATEWAY_URL}/football/match/${matchId}`);
  if (!res.ok) throw new Error("Failed to fetch football data");
  return res.json();
};

// --- DATABASE FAVORITES ENDPOINTS ---

export const fetchFavoriteMatches = async () => {
  const res = await fetch(`${GATEWAY_URL}/cricket/favorites`);
  if (!res.ok) throw new Error("Failed to fetch favorite matches from database");
  return res.json();
};

export const saveFavoriteMatch = async (matchData) => {
  const res = await fetch(`${GATEWAY_URL}/cricket/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(matchData),
  });
  if (!res.ok) throw new Error("Failed to save favorite match");
  return res.json();
};

export const removeFavoriteMatch = async (matchId) => {
  const res = await fetch(`${GATEWAY_URL}/cricket/favorites/${matchId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to remove favorite match");
  return true;
};


// Add this to your Match Feeds section in src/services/apiClient.js
export const fetchMatchesInfo = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/matches/info`);
  return data || { typeMatches: [] };
};

