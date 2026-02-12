<template>
  <div class="font-sans bg-slate-50 min-h-screen pb-24">
    <header class="relative bg-emerald-950 h-[450px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop" 
          :alt="`Pemandangan Alam dan Potensi Unggulan Desa ${profilDesa.nama_desa || 'Sidomukti'}`" 
          class="w-full h-full object-cover animate-slow-zoom"
          fetchpriority="high"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-50 via-emerald-900/60 to-emerald-950/0"></div>
      
      <div class="relative z-10 text-center px-4 mt-8 max-w-4xl mx-auto">
        <span class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-6 uppercase tracking-widest backdrop-blur-md shadow-lg">
          <Sparkles class="w-3 h-3" aria-hidden="true" />
          Eksplorasi Desa Digital
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl leading-tight">
          Potensi Unggulan <br/> 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">
            {{ profilDesa.nama_desa || 'Desa Sidomukti' }}
          </span>
        </h1>
        <p class="text-slate-200 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto opacity-90">
          Katalog resmi potensi desa meliputi sektor wisata, ekonomi kreatif (UMKM), pertanian, dan pemberdayaan masyarakat Desa {{ profilDesa.nama_desa || 'Sidomukti' }}.
        </p>

        <nav class="flex justify-center gap-4 mt-8" aria-label="Media Sosial Desa">
          <a v-if="profilDesa.facebook_url" :href="profilDesa.facebook_url" target="_blank" rel="noopener" class="text-white/70 hover:text-white transition-colors" aria-label="Facebook Desa">
            <Facebook class="w-5 h-5" />
          </a>
          <a v-if="profilDesa.instagram_url" :href="profilDesa.instagram_url" target="_blank" rel="noopener" class="text-white/70 hover:text-white transition-colors" aria-label="Instagram Desa">
            <Instagram class="w-5 h-5" />
          </a>
          <a v-if="profilDesa.youtube_url" :href="profilDesa.youtube_url" target="_blank" rel="noopener" class="text-white/70 hover:text-white transition-colors" aria-label="YouTube Desa">
            <Youtube class="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16" aria-label="Statistik Potensi">
        <div v-for="(stat, idx) in stats" :key="idx" class="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-b-[6px] border-emerald-500 text-center transition-all duration-300">
          <div class="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" aria-hidden="true">
            <component :is="stat.icon" class="w-6 h-6 text-emerald-600" />
          </div>
          <div class="text-3xl font-bold text-slate-800 tracking-tight">{{ stat.val }}</div>
          <h2 class="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">{{ stat.label }}</h2>
        </div>
      </section>
      
      <section class="mb-12">
        <div class="flex flex-wrap justify-center gap-3 mb-10" role="group" aria-label="Filter Kategori">
          <button 
            v-for="cat in categoryList" 
            :key="cat.id"
            @click="activeCategory = cat.id"
            :aria-pressed="activeCategory === cat.id"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border',
              activeCategory === cat.id 
                ? 'bg-emerald-700 text-white border-emerald-600 shadow-lg' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50'
            ]"
          >
            <component :is="cat.icon" class="w-4 h-4" aria-hidden="true" />
            {{ cat.label }}
          </button>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 3" :key="n" class="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse h-[400px]">
            <div class="h-64 bg-slate-200"></div>
            <div class="p-6 space-y-3">
              <div class="h-4 bg-slate-200 w-1/4"></div>
              <div class="h-6 bg-slate-200 w-3/4"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100 flex flex-col h-full cursor-pointer"
            @click="openModal(item)"
          >
            <div class="relative h-64 overflow-hidden bg-slate-100">
              <img 
                :src="item.foto_path || 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image'" 
                :alt="`Potensi ${item.nama} - Desa ${profilDesa.nama_desa}`" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              >
              <div class="absolute top-4 left-4">
                <span :class="`px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-md uppercase ${getCategoryColor(item.kategori)}`">
                  {{ formatEnumLabel(item.kategori) }}
                </span>
              </div>
            </div>

            <div class="p-6 flex flex-col flex-grow">
              <p class="text-xs font-semibold text-emerald-600 mb-2">{{ formatEnumLabel(item.jenis) }}</p>
              <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-700 line-clamp-2">
                {{ item.nama }}
              </h3>
              <p class="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {{ item.deskripsi }}
              </p>
              
              <div class="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between text-sm">
                <div class="flex items-center gap-2 text-slate-500">
                  <MapPin class="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  <span class="truncate max-w-[150px]">{{ item.lokasi || profilDesa.nama_desa }}</span>
                </div>
                <div v-if="item.harga_min" class="text-slate-700 font-bold">
                   Mulai {{ formatRupiah(item.harga_min) }}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
        <div class="relative z-10 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6">Investasi & Kolaborasi</h2>
          <p class="text-emerald-100 mb-10 text-lg font-light">
            Mari bergabung membangun ekonomi Desa {{ profilDesa.nama_desa }} melalui kemitraan strategis dengan BUMDes.
          </p>
          <div class="flex justify-center">
             <a 
              :href="profilDesa.nomor_bumdes ? `https://wa.me/${formatPhone(profilDesa.nomor_bumdes)}` : '#'" 
              target="_blank" rel="noopener"
              class="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-8 py-4 rounded-full font-bold transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
             >
               <Phone class="w-5 h-5" /> Konsultasi BUMDes
             </a>
          </div>
        </div>
      </section>
    </main>

    <transition name="modal">
      <div v-if="isModalOpen && selectedItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" @click="closeModal"></div>
        <div class="bg-white rounded-3xl w-full max-w-5xl h-[90vh] md:h-auto overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row">
          <button @click="closeModal" class="absolute top-4 right-4 z-20 bg-white p-2 rounded-full shadow-md" aria-label="Tutup Detail">
            <X class="w-6 h-6" />
          </button>
          </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useHead } from '@vueuse/head'; // Pastikan @vueuse/head atau @unhead/vue terinstall

// --- SEO MANAGEMENT ---
// Google URL Inspector butuh Meta Title & Description yang statis/cepat berubah
const seoTitle = computed(() => {
  const name = profilDesa.value?.nama_desa || 'Sidomukti';
  return `Potensi Unggulan Desa ${name} - UMKM & Wisata Purworejo`;
});

const seoDesc = computed(() => {
  return `Eksplorasi potensi ekonomi, wisata alam, dan produk unggulan Desa ${profilDesa.value?.nama_desa || 'Sidomukti'}. Portal resmi informasi BUMDes dan kemitraan desa.`;
});

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDesc },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDesc },
    { property: 'og:image', content: '/logo-desa.png' }, // Ganti dengan path logo asli
    { name: 'keywords', content: 'potensi desa, umkm desa, wisata purworejo, bumdes, desa digital' },
    { name: 'author', content: 'Pemerintah Desa' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        "name": `Pemerintah Desa ${profilDesa.value?.nama_desa || 'Sidomukti'}`,
        "url": window.location.origin,
        "description": seoDesc.value
      }))
    }
  ]
});

// Sisanya adalah state management Anda yang sudah bagus
import { 
  LayoutGrid, Mountain, Palette, Sprout, 
  Fish, Users, MoreHorizontal, Store, MapPin, 
  ArrowUpRight, Phone, Search, AlertCircle, Sparkles,
  X, User, MessageCircle, Map, Facebook, Instagram, Youtube
} from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api'; 

const rawData = ref([]);
const profilDesa = ref({});
const isLoading = ref(true);
const errorMessage = ref(null);
const activeCategory = ref('ALL');
const isModalOpen = ref(false);
const selectedItem = ref(null);

// ... helper functions (fetchData, calculateStats, dll tetap sama) ...
// Sertakan rel="noopener" pada setiap <a> target="_blank" untuk keamanan & SEO
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

@keyframes modal-up {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-modal-up { animation: modal-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }

@keyframes slow-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}
.animate-slow-zoom { animation: slow-zoom 20s infinite alternate ease-in-out; }

.fade-enter-active, .fade-leave-active { transition: all 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: scale(0.95) translateY(10px); }
</style>