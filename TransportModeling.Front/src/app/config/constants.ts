export const API_URL = 'https://localhost:7174/api';

export const AUTH_ENDPOINTS = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  buildGraph: `${API_URL}/GraphModeling`,
  optimizeFleet: `${API_URL}/OptimizeFleet`,
  getNormsForRoutePeriod: `${API_URL}/OptimizeFleet/norms`,
  getRoutes: `${API_URL}/route/list`
};

export const STORAGE_KEYS = {
  authToken: 'auth_token'
};
