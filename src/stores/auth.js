// src/store/auth.js
import { defineStore } from 'pinia';
import api from '../service/apis';
import router from '../router'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Ambil data user yang tersimpan agar tidak kosong saat refresh
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    errorMessage: '',
    isLoading: false,
  }),

  actions: {
    async login(payload) {
      this.isLoading = true;
      try {
        const response = await api.post('/api/v1/login', payload);
        const data = response.data;

        this.token = data.token;
        this.user = data.user;

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return true;
      } catch (error) {
        this.errorMessage = error.response?.data?.detail || 'Login gagal';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.clear();

      // Tendang ke login, bukan ke home (agar sesi bersih)
      router.replace('/');
    }
  }
});