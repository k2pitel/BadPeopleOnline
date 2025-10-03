import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  guestLogin: (username) => api.post('/auth/guest', { username }),
};

// Rooms API
export const roomsAPI = {
  getAll: () => api.get('/rooms'),
  getByCode: (code) => api.get(`/rooms/${code}`),
  create: (data) => api.post('/rooms', data),
};

// Questions API
export const questionsAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
};

// Reports API
export const reportsAPI = {
  submit: (data) => api.post('/reports', data),
  getMyReports: () => api.get('/reports/my-reports'),
};

export default api;
