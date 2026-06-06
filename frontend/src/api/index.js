import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("gullyhunt_user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");
export const updateMe = (data) => API.put("/auth/me", data);

// Match APIs
export const getMatches = (params) => API.get("/matches", { params });
export const getMatch = (id) => API.get(`/matches/${id}`);
export const createMatch = (data) => API.post("/matches", data);
export const joinMatch = (id) => API.post(`/matches/${id}/join`);
export const leaveMatch = (id) => API.post(`/matches/${id}/leave`);
export const updateMatch = (id, data) => API.put(`/matches/${id}`, data);
export const deleteMatch = (id) => API.delete(`/matches/${id}`);

export default API;
// Scorecard APIs
export const createScorecard = (data) => API.post("/scorecard", data);
export const getScorecardByCode = (code) => API.get(`/scorecard/${code}`);
export const addBall = (code, data) => API.post(`/scorecard/${code}/ball`, data);
export const startInnings2 = (code) => API.post(`/scorecard/${code}/start-innings2`);
export const getMyScores = () => API.get("/scorecard/my");