const GATEWAY_URL = "http://localhost:8080/api";

// --- CORE SAFE FETCH HELPER ---
const safeJsonFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const text = await res.text();
    if (!text || text.trim() === "") {
      return null;
    }

    return JSON.parse(text);
  } catch (err) {
    console.error(`Fetch error for [${url}]:`, err.message);
    return null;
  }
};

// =========================================================================
// 1. MATCH FEEDS & ARCHIVES
// =========================================================================

export const fetchLiveMatches = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/matches/live`);
  return data || { typeMatches: [] };
};

export const fetchRecentMatches = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/matches/recent`);
  return data || { typeMatches: [] };
};

export const fetchUpcomingMatches = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/matches/upcoming`);
  return data || { typeMatches: [] };
};

export const fetchMatchesInfo = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/matches/info`);
  return data || { typeMatches: [] };
};

// =========================================================================
// 2. ADVANCED MATCH CENTER (Scorecard V2, Lineups, Commentary, Overs)
// =========================================================================

export const fetchMatchInfo = async (matchId) => {
  return safeJsonFetch(`${GATEWAY_URL}/cricket/mcenter/${matchId}/info`);
};

export const fetchScorecardV2 = async (matchId) => {
  // 'hscard' maps to Cricbuzz Match Center detailed scorecard
  return safeJsonFetch(`${GATEWAY_URL}/cricket/mcenter/${matchId}/hscard`);
};

export const fetchMatchTeam = async (matchId) => {
  // 'team' maps to Cricbuzz Playing XI & squads
  return safeJsonFetch(`${GATEWAY_URL}/cricket/mcenter/${matchId}/team`);
};

export const fetchMatchCommentaries = async (matchId) => {
  // 'comm' maps to ball-by-ball commentary
  return safeJsonFetch(`${GATEWAY_URL}/cricket/mcenter/${matchId}/comm`);
};

export const fetchMatchOvers = async (matchId) => {
  // 'overs' maps to over-by-over summaries
  return safeJsonFetch(`${GATEWAY_URL}/cricket/mcenter/${matchId}/overs`);
};

// Legacy/Fallback scorecard endpoint
export const fetchScorecard = async (matchId) => {
  return safeJsonFetch(`${GATEWAY_URL}/cricket/scorecard/${matchId}`);
};

// =========================================================================
// 3. SCHEDULES, TEAMS, SERIES & NEWS
// =========================================================================

export const fetchGlobalSchedule = async () => {
  return safeJsonFetch(`${GATEWAY_URL}/cricket/schedule`);
};

export const fetchAllTeams = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/teams`);
  return data || { list: [] };
};

export const fetchAllSeries = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/series`);
  return data || { list: [] };
};

export const fetchRankings = async (formatType = "odi") => {
  return safeJsonFetch(`${GATEWAY_URL}/cricket/rankings?formatType=${formatType}`);
};

export const fetchCricketNews = async () => {
  return safeJsonFetch(`${GATEWAY_URL}/cricket/news`);
};

// =========================================================================
// 4. POSTGRESQL DATABASE FAVORITES
// =========================================================================

export const fetchFavoriteMatches = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/favorites`);
  return Array.isArray(data) ? data : [];
};

export const saveFavoriteMatch = async (matchData) => {
  const res = await fetch(`${GATEWAY_URL}/cricket/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(matchData),
  });
  if (!res.ok) throw new Error("Failed to save favorite match to database");
  return res.json();
};

export const removeFavoriteMatch = async (matchId) => {
  const res = await fetch(`${GATEWAY_URL}/cricket/favorites/${matchId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) throw new Error("Failed to remove favorite match");
  return true;
};

// =========================================================================
// 5. FOOTBALL ENDPOINTS
// =========================================================================

export const fetchFootballData = async (matchId) => {
  return safeJsonFetch(`${GATEWAY_URL}/football/match/${matchId}`);
};