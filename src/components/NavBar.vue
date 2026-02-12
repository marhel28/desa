<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'; // Import SweetAlert2

const authStore = useAuthStore();
const router = useRouter();

// Emit event toggle ke MainLayout
defineEmits(['toggle-sidebar']);

// Ambil data user dari store
const userEmail = computed(() => authStore.user?.email || 'Admin');
const userName = computed(() => userEmail.value.split('@')[0]);

const handleLogout = () => {
  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: "Sesi Anda akan segera berakhir!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#10B981', // Warna hijau (sesuai tema button kamu)
    cancelButtonColor: '#EF4444',  // Warna merah
    confirmButtonText: 'Ya, Logout!',
    cancelButtonText: 'Batal',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      authStore.logout();
      
      // Opsional: Tampilkan toast sukses sebelum pindah halaman
      Swal.fire({
        title: 'Berhasil!',
        text: 'Anda telah keluar.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
    router.push('/');
  });
};
</script>

<template>
  <header class="bg-white shadow h-16 flex justify-between items-center px-4 lg:px-6 z-10">
    <div class="flex items-center">
      <button 
        @click="$emit('toggle-sidebar')" 
        class="text-gray-500 focus:outline-none lg:hidden"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      
      <h2 class="ml-4 text-xl font-semibold text-gray-800 hidden sm:block">
        Dashboard Administrasi
      </h2>
    </div>

    <div class="flex items-center gap-4">
      
      <div class="flex items-center gap-3">
        <div class="text-right hidden md:block">
          <div class="text-sm font-medium text-gray-900 capitalize">{{ userName }}</div>
          <div class="text-xs text-gray-500">Administrator</div>
        </div>
        
        <div class="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
          {{ userName.charAt(0).toUpperCase() }}
        </div>
      </div>

      <button 
        @click="handleLogout"
        class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
        title="Logout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </header>
</template>