<template>
  <div class="font-montserrat bg-slate-50 min-h-screen pb-20 relative selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
    
    <div class="absolute top-[600px] -right-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
    <div class="absolute top-[1200px] -left-24 w-80 h-80 bg-slate-200/50 rounded-full blur-3xl -z-10"></div>

    <div v-show="isMainPage">
      <div class="relative h-[450px] md:h-[550px] flex items-end overflow-hidden group">
        <div class="absolute inset-0">
          <img 
            :src="berita" 
            alt="Berita Desa" 
            class="w-full h-full object-cover transition-transform duration-[15s] group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/20 to-transparent"></div>
        </div>
        
        <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black mb-6 uppercase tracking-widest animate-fade-in-down shadow-xl border border-white/20">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Warta Digital Desa
            </div>
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl animate-fade-in-up leading-tight">
              Kabar Desa <span class="text-emerald-400 italic">Sidomukti</span>
            </h1>
            <p class="text-emerald-50 text-lg md:text-xl font-medium leading-relaxed animate-fade-in-up delay-100 max-w-2xl">
              Jendela informasi transparan mengenai pembangunan, kegiatan sosial, dan dinamika harian warga.
            </p>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

          <div class="lg:col-span-8">
            
            <div v-if="isLoading" class="py-20 text-center bg-white rounded-3xl shadow-xl border border-slate-100">
               <div class="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p class="text-slate-500 font-bold tracking-tight">Mengambil data terbaru...</p>
            </div>

            <div v-else>
              <div v-if="currentPage === 1 && !searchQuery && selectedCategory === 'Semua' && featuredNews.length > 0" class="mb-16">
                <div 
                  @click="openNews(featuredNews[0].id)"
                  class="group relative h-[500px] md:h-[550px] rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer border-4 border-white transition-all duration-500 hover:shadow-emerald-900/20"
                >
                  <img :src="getImageUrl(featuredNews[0])" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                  
                  <div class="absolute top-8 right-8">
                    <div class="bg-white/10 backdrop-blur-md border border-white/30 p-4 rounded-2xl text-center text-white">
                      <span class="block text-2xl font-black">{{ formatDateDay(featuredNews[0].tanggal) }}</span>
                      <span class="block text-[10px] font-bold uppercase tracking-widest">{{ formatDateMonthShort(featuredNews[0].tanggal) }}</span>
                    </div>
                  </div>

                  <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <div class="flex flex-wrap gap-3 mb-6">
                      <span v-if="isUrgent(featuredNews[0])" class="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-red-500/40 uppercase">Penting</span>
                      <span class="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase border border-white/20">{{ featuredNews[0].tipe }}</span>
                    </div>
                    <h2 class="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight group-hover:text-emerald-300 transition-colors line-clamp-2">
                      {{ featuredNews[0].title }}
                    </h2>
                    <div class="flex items-center gap-6 text-white/60 text-sm font-bold pt-6 border-t border-white/10">
                      <span class="flex items-center gap-2 group-hover:text-white transition-colors"><User class="w-5 h-5 text-emerald-400" /> {{ featuredNews[0].penulis || 'Redaksi Desa' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  @click="setCategory(cat)"
                  :class="[
                    'px-8 py-3 rounded-2xl text-sm font-black transition-all whitespace-nowrap border-2',
                    selectedCategory === cat 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' 
                      : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-500 hover:text-emerald-700'
                  ]"
                >
                  {{ cat }}
                </button>
              </div>

              <div v-if="paginatedNews.length === 0" class="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <p class="text-slate-400 font-bold">Tidak ada berita ditemukan untuk kategori ini.</p>
                <button @click="setCategory('Semua')" class="mt-4 text-emerald-600 text-sm font-black uppercase">Lihat Semua Berita</button>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <article 
                  v-for="(news, idx) in paginatedNews" 
                  :key="news.id" 
                  @click="openNews(news.id)"
                  :class="['bg-white rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-2xl border border-slate-50 transition-all duration-500 group flex flex-col h-full cursor-pointer hover:-translate-y-2', idx % 3 === 0 ? 'md:border-b-emerald-500 md:border-b-4' : '']"
                >
                  <div class="relative h-64 overflow-hidden">
                    <img :src="getImageUrl(news)" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div class="absolute top-6 left-6 flex gap-2">
                      <span :class="['text-[10px] font-black px-4 py-2 rounded-xl shadow-lg uppercase', getCategoryColor(news)]">
                        {{ isUrgent(news) ? '🚨 Urgent' : news.tipe }}
                      </span>
                    </div>
                  </div>

                  <div class="p-8 flex flex-col flex-grow">
                    <div class="flex items-center gap-3 text-[10px] font-black text-slate-400 mb-4 uppercase tracking-widest">
                      <span class="w-6 h-[2px] bg-emerald-500"></span>
                      <span>{{ formatDate(news.tanggal) }}</span>
                    </div>
                    <h3 class="text-xl font-bold text-slate-800 mb-4 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {{ news.title }}
                    </h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                      {{ stripHtml(news.isi) }}
                    </p>
                    <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <img class="w-10 h-10 rounded-full border-2 border-emerald-50" :src="`https://ui-avatars.com/api/?name=${news.penulis || 'Admin'}&background=10b981&color=fff`" />
                          <span class="text-xs font-black text-slate-700 uppercase tracking-tighter">{{ news.penulis || 'Admin' }}</span>
                        </div>
                        <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                          <ArrowRight class="w-5 h-5" />
                        </div>
                    </div>
                  </div>
                </article>
              </div>

              <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mb-10">
                <button @click.stop="prevPage" :disabled="currentPage === 1" class="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm hover:bg-emerald-600 hover:text-white disabled:opacity-30 transition-all group">
                  <ChevronLeft class="w-6 h-6 group-hover:translate-x-[-2px] transition-transform" />
                </button>
                <div class="h-14 px-8 flex items-center font-black text-slate-800 bg-white border border-slate-100 rounded-2xl shadow-sm tracking-tighter">
                  {{ currentPage }} <span class="mx-3 text-slate-300 font-light">/</span> {{ totalPages }}
                </div>
                <button @click.stop="nextPage" :disabled="currentPage === totalPages" class="w-14 h-14 rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm hover:bg-emerald-600 hover:text-white disabled:opacity-30 transition-all group">
                  <ChevronRight class="w-6 h-6 group-hover:translate-x-[2px] transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <aside class="lg:col-span-4 space-y-10">
            <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden group">
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <h3 class="font-bold text-slate-800 mb-6 text-xl tracking-tighter relative">Cari Kabar</h3>
              <div class="relative">
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Cari berita desa..." 
                  class="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-bold text-slate-800"
                >
                <Search class="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div class="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden sticky top-24">
              <div class="bg-slate-900 p-8 text-white flex justify-between items-center">
                <div>
                  <h3 class="font-black text-xl tracking-tighter">Agenda Desa</h3>
                  <p class="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Update 2026</p>
                </div>
                <Calendar class="w-8 h-8 text-emerald-500 opacity-50" />
              </div>

              <div class="p-8">
                <div v-if="isLoadingAgenda" class="space-y-6">
                   <div v-for="i in 3" :key="i" class="flex gap-4">
                     <div class="w-12 h-12 bg-slate-100 rounded-xl animate-pulse"></div>
                     <div class="flex-grow space-y-2">
                       <div class="h-3 bg-slate-100 rounded-full w-full animate-pulse"></div>
                       <div class="h-2 bg-slate-50 rounded-full w-1/2 animate-pulse"></div>
                     </div>
                   </div>
                </div>

                <div v-else class="space-y-8">
                  <div v-for="(agenda, index) in upcomingAgendas" :key="index" class="flex gap-6 group cursor-pointer border-l-2 border-transparent hover:border-emerald-500 pl-2 transition-all">
                    <div class="flex-shrink-0 w-14 h-16 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center group-hover:bg-emerald-600 transition-all duration-500 shadow-sm">
                      <span class="text-[10px] font-black text-emerald-600 uppercase group-hover:text-emerald-100">{{ formatDateMonthShort(agenda.tanggal) }}</span>
                      <span class="text-xl font-black text-slate-800 leading-none group-hover:text-white">{{ formatDateDay(agenda.tanggal) }}</span>
                    </div>
                    <div class="flex flex-col justify-center">
                      <h4 class="font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug mb-2 line-clamp-2 uppercase tracking-tighter">
                        {{ agenda.title }}
                      </h4>
                      <div class="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span class="flex items-center gap-1.5"><Clock class="w-3 h-3 text-emerald-500" /> {{ formatTime(agenda.waktu_mulai) }}</span>
                        <span class="flex items-center gap-1.5"><MapPin class="w-3 h-3 text-emerald-500" /> {{ agenda.lokasi || 'Balai' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  @click="openAgenda"
                  class="w-full mt-10 py-4 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 hover:shadow-emerald-900/40 transition-all shadow-lg flex items-center justify-center gap-3 group"
                >
                  Seluruh Kalender
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>

    <router-view v-slot="{ Component }">
      <transition name="fade-slide" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import berita from "@/assets/berita-image.jpeg"
import { 
  Search, Calendar, User, ArrowRight, 
  ChevronLeft, ChevronRight, Clock, MapPin 
} from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js';

const router = useRouter(); 
const route = useRoute();

// --- STATE ---
const searchQuery = ref('');
const selectedCategory = ref('Semua');
const currentPage = ref(1);
const itemsPerPage = 6;
const isLoading = ref(true);
const isLoadingAgenda = ref(true);

const allNews = ref([]);
const allAgendas = ref([]);
const categories = ['Semua', 'Pengumuman', 'Pembangunan', 'Kegiatan', 'Layanan'];

// --- HELPERS ---
const isMainPage = computed(() => route.name === 'Berita desa');

const stripHtml = (html) => {
   if (!html) return "";
   const tempDiv = document.createElement("div");
   tempDiv.innerHTML = html;
   return tempDiv.textContent || tempDiv.innerText || "";
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatDateDay = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).getDate();
}

const formatDateMonthShort = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { month: 'short' });
}

const formatTime = (timeString) => {
  if (!timeString) return '08:00 WIB';
  return timeString.substring(0, 5) + ' WIB';
};

// --- DATA FETCHING ---
const loadData = async () => {
  isLoading.value = true;
  isLoadingAgenda.value = true;
  try {
    const { data: newsData } = await fetchSupabase('berita', 'select=*&order=tanggal.desc');
    if (newsData) allNews.value = newsData;

    const today = new Date().toISOString().split('T')[0];
    const { data: agendaData } = await fetchSupabase('agenda', `select=*&tanggal=gte.${today}&order=tanggal.asc&limit=4`);
    if (agendaData) allAgendas.value = agendaData;
    
    // CEK FILTER DARI ROUTER QUERY
    checkRouteFilter();

  } catch (e) {
    console.error('Error fetching data:', e);
  } finally {
    isLoading.value = false;
    isLoadingAgenda.value = false;
  }
};

const checkRouteFilter = () => {
  const filter = route.query.filter;
  if (filter && categories.includes(filter)) {
    selectedCategory.value = filter;
  } else {
    selectedCategory.value = 'Semua';
  }
};

// --- COMPUTED ---
const filteredList = computed(() => {
  return allNews.value.filter(news => {
    const catMatch = selectedCategory.value === 'Semua' || news.tipe.toLowerCase() === selectedCategory.value.toLowerCase();
    const searchMatch = news.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        stripHtml(news.isi).toLowerCase().includes(searchQuery.value.toLowerCase());
    return catMatch && searchMatch;
  });
});

const featuredNews = computed(() => allNews.value.filter(n => n.pinned).slice(0, 1));
const upcomingAgendas = computed(() => allAgendas.value);
const totalPages = computed(() => Math.ceil(filteredList.value.length / itemsPerPage));
const paginatedNews = computed(() => filteredList.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

// --- STYLE HELPERS ---
const isUrgent = (news) => news.pinned === true && news.tipe.toLowerCase() === 'pengumuman';
const getImageUrl = (news) => news.image_url || 'https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?q=80';
const getCategoryColor = (news) => isUrgent(news) ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white';

// --- ACTIONS ---
const setCategory = (cat) => { 
  selectedCategory.value = cat; 
  currentPage.value = 1; 
  // Update URL tanpa reload agar sinkron
  router.replace({ query: { ...route.query, filter: cat === 'Semua' ? undefined : cat } });
};

const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; window.scrollTo({top: 400, behavior: 'smooth'}); } };
const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; window.scrollTo({top: 400, behavior: 'smooth'}); } };
const openAgenda = () => router.push({ name: 'agenda' });
const openNews = (id) => router.push({ name: 'beritaperpage', query: { id } });

// Pantau jika user klik link "Berita" lagi tapi dengan filter berbeda
watch(() => route.query.filter, (newFilter) => {
  if (newFilter) selectedCategory.value = newFilter;
  else selectedCategory.value = 'Semua';
});

onMounted(loadData);
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.shadow-soft { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); }

.animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
.animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>