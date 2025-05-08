export const API_URL = 'https://localhost:7174/api';

export const AUTH_ENDPOINTS = {
  login: `${API_URL}/auth/login`,
  register: `${API_URL}/auth/register`,
  buildGraph: `${API_URL}/GraphModeling`
};

export const STORAGE_KEYS = {
  authToken: 'auth_token'
};
