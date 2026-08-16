const GATEWAY_URL = "http://localhost:8080/api";

// --- CORE HELPER ---
// This safely parses JSON and prevents React from crashing if the backend returns an empty response
const safeJsonFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }
  
  const text = await res.text();
  if (!text || text.trim() === "") {
    return null;
  }
  
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse JSON:", text);
    return null;
  }
};

// --- CRICKET ENDPOINTS ---
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

export const fetchScorecard = async (matchId) => {
  return safeJsonFetch(`${GATEWAY_URL}/cricket/scorecard/${matchId}`);
};

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

// This is your new Archive/Match Info endpoint!
export const fetchMatchesInfo = async () => {
  const data = await safeJsonFetch(`${GATEWAY_URL}/cricket/matches/info`);
  return data || { typeMatches: [] };
};

// --- FOOTBALL ENDPOINTS ---
export const fetchFootballData = async (matchId) => {
  return safeJsonFetch(`${GATEWAY_URL}/football/match/${matchId}`);
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