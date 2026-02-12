<script setup>
import { ref } from 'vue';
import Sidebar from '@/components/SideBar.vue';
import Navbar from '@/components/NavBar.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans overflow-hidden">
    
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
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Optional: Styling Scrollbar Konten Utama agar senada */
main::-webkit-scrollbar {
  width: 8px;
}
main::-webkit-scrollbar-track {
  background: #f1f5f9;
}
main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>