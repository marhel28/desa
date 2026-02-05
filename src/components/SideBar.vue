<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close-sidebar']);
const route = useRoute();

// Menu items
const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Profil Desa', path: '/desa-admin', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { name: 'Statistik', path: '/statistik-admin', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { name: 'Berita & Artikel', path: '/berita-admin', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { name: 'Agenda Kegiatan', path: '/agenda-admin', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { name: 'Potensi Desa', path: '/potensi-admin', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { name: 'Transparansi', path: '/transparansi-admin', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
];

const isActive = (path) => route.path.startsWith(path);
</script>

<template>
  <div>
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
      @click="$emit('close-sidebar')"
    ></div>

    <aside 
      class="fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col h-screen lg:static lg:translate-x-0 shadow-xl border-r border-slate-800"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      
      <div class="flex items-center justify-center h-16 bg-slate-800 shadow-sm border-b border-slate-700 shrink-0">
        <div class="text-xl font-bold tracking-wider flex items-center gap-3">
           <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">S</div>
           <span class="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">SIDOMUKTI</span>
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden"
          :class="isActive(item.path) ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
        >
          <div v-if="isActive(item.path)" class="absolute left-0 top-0 bottom-0 w-1 bg-white/20 rounded-r"></div>

          <svg 
            class="mr-3 flex-shrink-0 h-5 w-5 transition-colors" 
            :class="isActive(item.path) ? 'text-white' : 'text-slate-500 group-hover:text-emerald-400'"
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
          </svg>
          {{ item.name }}
        </router-link>
      </nav>

      <div class="p-4 bg-slate-950/50 border-t border-slate-800 shrink-0">
        <div class="text-[10px] text-slate-500 text-center leading-relaxed">
          &copy; 2026 Desa Sidomukti<br>
          <span class="text-slate-600">Admin Panel v1.0</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Custom Scrollbar untuk menu jika terlalu panjang */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 2px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569;
}
</style>