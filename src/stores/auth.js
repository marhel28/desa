// src/store/auth.js
import { defineStore } from 'pinia';
import api from '../service/apis';
import router from '../router'; 

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refresh_token') || null,
    errorMessage: '',
    isLoading: false,
  }),

  actions: {
    async login(payload) {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        // Melakukan request ke endpoint yang diminta
        // Payload harus berisi: username, password, email
        const response = await api.post('/api/v1/login', payload);
        
        const data = response.data;

        // 1. Simpan data ke State Pinia
        this.token = data.token;
        this.refreshToken = data.refresh_token;
        this.user = data.user;

        // 2. Simpan token ke LocalStorage (Agar bisa dibaca oleh api.js interceptor)
        localStorage.setItem('token', data.token);
        localStorage.setItem('refresh_token', data.refresh_token);
        // Opsional: simpan user info jika perlu persistensi
        localStorage.setItem('user', JSON.stringify(data.user));

        // 3. Redirect ke halaman dashboard (misal: /dashboard atau home)
        // Di sini saya arahkan ke /dashboard, pastikan route-nya ada
        router.push('/dashboard'); 
        
        return true;

      } catch (error) {
        console.error("Login Failed:", error);
        this.errorMessage = error.response?.data?.detail || 'Login gagal, periksa koneksi atau kredensial Anda.';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      router.push('/');
    }
  }
});