import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fittrack-backend-mu3q.onrender.com/api',
  // baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
