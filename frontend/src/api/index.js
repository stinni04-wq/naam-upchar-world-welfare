import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('naam_upchar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 - clear token and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('naam_upchar_token');
      localStorage.removeItem('naam_upchar_user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (mobile) => api.post('/auth/login', { mobile }),
  getMe: () => api.get('/auth/me')
};

export const chantingAPI = {
  getToday: () => api.get('/chanting/today'),
  update: (roundsToAdd) => api.post('/chanting/update', { roundsToAdd }),
  getHistory: () => api.get('/chanting/history')
};

export const statsAPI = {
  getGlobal: () => api.get('/stats/global')
};

export default api;
