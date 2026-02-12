<script setup>
import { ref, onBeforeMount } from 'vue'; // Gunakan onBeforeMount agar lebih cepat
import Sidebar from '@/components/SideBar.vue';
import Navbar from '@/components/NavBar.vue';

const isSidebarOpen = ref(false);
const isAuthorized = ref(false); // State untuk mencegah flashing

// Cek token sesegera mungkin sebelum komponen ditempel ke DOM
onBeforeMount(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Jika tidak ada token, langsung lempar ke Home
    // Menggunakan location.replace agar user tidak bisa 'back' ke halaman flash tadi
    window.location.replace('/');
  } else {
    // Jika ada token, izinkan render konten
    isAuthorized.value = true;
  }
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div v-if="isAuthorized" class="flex h-screen bg-slate-50 font-sans overflow-hidden">
    
    <Sidebar 
      :is-open="isSidebarOpen" 
      @close-sidebar="closeSidebar"
    />

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Navbar @toggle-sidebar="toggleSidebar" class="shrink-0" />

      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 scroll-smooth">
        <div class="container mx-auto px-4 py-6 lg:px-8">
           <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
           </router-view>
        </div>
      </main>
    </div>
  </div>

  <div v-else class="h-screen w-screen bg-slate-50 flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
</template>

<style scoped>
/* Style transisi kamu tetap sama */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* ... scrollbar styling ... */
</style>