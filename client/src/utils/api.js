import axios from 'axios';

const api = axios.create({
  baseURL: '${import.meta.env.VITE_API_URL}/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Add token from localStorage on startup
const token = localStorage.getItem('fitnessai-token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitnessai-token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
