<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Form Data
const form = reactive({
  email: '', // Default value sesuai request
  password: ''      // Default value sesuai request
});

const handleLogin = async () => {
  // Membentuk payload sesuai request backend: username, password, email
  const success = await authStore.login(form);
  if (success) {
    window.location.href = '/dashboard';
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Admin Desa Sidomukti</h1>
        <p class="text-gray-500 text-sm mt-1">Silakan masuk untuk melanjutkan</p>
      </div>

      <div v-if="authStore.errorMessage" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
        {{ authStore.errorMessage }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            v-model="form.email"
            type="email" 
            id="email" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="ammar@gmail.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            v-model="form.password"
            type="password" 
            id="password" 
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="********"
          />
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="authStore.isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
          >
            <span v-if="authStore.isLoading">Memproses...</span>
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
      
    </div>
  </div>
</template>