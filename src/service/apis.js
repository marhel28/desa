// src/service/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-desa-production-cd55.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- REQUEST INTERCEPTOR ---
// Setiap request keluar, cek apakah ada token, kalau ada tempelkan ke Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;