<template>
    <div class="font-montserrat min-h-screen bg-slate-50 pb-20 pt-8 animate-fade-in">
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center h-[60vh]">
        <div class="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
        <p class="text-slate-500 font-medium animate-pulse">Memuat artikel...</p>
      </div>
  
      <div v-else-if="!news" class="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div class="bg-red-50 p-4 rounded-full mb-4">
          <FileX class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-2xl font-bold text-slate-800">Berita Tidak Ditemukan</h2>
        <p class="text-slate-500 mt-2 mb-6">Artikel yang Anda cari mungkin telah dihapus atau URL salah.</p>
        <button @click="goBack" class="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">
          Kembali ke Daftar Berita
        </button>
      </div>
  
      <div v-else class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          @click="goBack" 
          class="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold text-sm mb-8 transition-colors"
        >
          <div class="p-2 bg-white rounded-full border border-slate-200 group-hover:border-emerald-500 transition-colors">
            <ArrowLeft class="w-4 h-4" />
          </div>
          Kembali ke Daftar
        </button>
  
        <header class="mb-10 text-center max-w-3xl mx-auto">
          <div class="flex items-center justify-center gap-3 mb-4">
            <span :class="['px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider', getCategoryColor(news.tipe)]">
              {{ news.tipe }}
            </span>
            <span v-if="news.pinned" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-600 border border-red-200 flex items-center gap-1">
              <Pin class="w-3 h-3" /> Pinned
            </span>
          </div>
  
          <h1 class="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6">
            {{ news.title }}
          </h1>
  
          <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium">
            <div class="flex items-center gap-2">
              <Calendar class="w-4 h-4 text-emerald-500" />
              {{ formatDate(news.tanggal) }}
            </div>
            <div class="flex items-center gap-2">
              <User class="w-4 h-4 text-emerald-500" />
              <span class="capitalize">{{ news.penulis || 'Admin Desa' }}</span>
            </div>
            <div class="flex items-center gap-2">
               <Clock class="w-4 h-4 text-emerald-500" />
               <span>{{ readTime }} menit baca</span>
            </div>
          </div>
        </header>
  
        <div class="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-12 group">
          <img 
            :src="getImageUrl(news)" 
            :alt="news.title" 
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
  
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <article class="lg:col-span-8">
            <div 
              v-html="news.isi" 
              class="prose prose-emerald prose-lg max-w-none text-slate-700 leading-relaxed
                     prose-headings:font-bold prose-headings:text-slate-800 
                     prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                     prose-img:rounded-2xl prose-img:shadow-lg"
            ></div>
  
            <div class="mt-12 pt-8 border-t border-slate-200">
              <h4 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Share2 class="w-5 h-5 text-emerald-600" /> Bagikan Informasi
              </h4>
              <div class="flex gap-2">
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition">Facebook</button>
                <button class="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-bold hover:bg-sky-600 transition">Twitter</button>
                <button class="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition">WhatsApp</button>
              </div>
            </div>
          </article>
  
          <aside class="lg:col-span-4 space-y-8">
            
            <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
              <h3 class="font-bold text-xl text-slate-800 mb-6 pb-2 border-b border-slate-100">
                Berita Lainnya
              </h3>
  
              <div v-if="relatedNews.length > 0" class="space-y-6">
                <div 
                  v-for="item in relatedNews" 
                  :key="item.id" 
                  @click="goToDetail(item.id)"
                  class="group cursor-pointer flex gap-4 items-start"
                >
                  <div class="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    <img :src="getImageUrl(item)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">{{ item.tipe }}</span>
                    <h4 class="text-sm font-bold text-slate-800 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {{ item.title }}
                    </h4>
                    <span class="text-xs text-slate-400 mt-1 block">{{ formatDate(item.tanggal) }}</span>
                  </div>
                </div>
              </div>
  
              <div v-else class="text-slate-400 text-sm text-center py-4">
                Belum ada berita lainnya.
              </div>
            </div>
  
          </aside>
  
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { 
    ArrowLeft, Calendar, User, Clock, Share2, 
    FileX, Pin 
  } from 'lucide-vue-next';
  import { fetchSupabase } from '@/service/api.js';
  
  const route = useRoute();
  const router = useRouter();
  
  // --- STATE ---
  const news = ref(null);
  const relatedNews = ref([]);
  const isLoading = ref(true);
  
  // --- HELPERS ---
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };
  
  const getCategoryColor = (tipe) => {
    switch (tipe?.toLowerCase()) {
      case 'pengumuman': return 'bg-blue-100 text-blue-600 border border-blue-200';
      case 'pembangunan': return 'bg-amber-100 text-amber-600 border border-amber-200';
      case 'kegiatan': return 'bg-purple-100 text-purple-600 border border-purple-200';
      default: return 'bg-emerald-100 text-emerald-600 border border-emerald-200';
    }
  };
  
  const getImageUrl = (item) => {
    if (item?.image_url) return item.image_url;
    // Fallback images
    switch(item?.tipe?.toLowerCase()) {
      case 'pembangunan': return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2940&auto=format&fit=crop';
      case 'kegiatan': return 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2940&auto=format&fit=crop';
      case 'layanan': return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop';
      default: return 'https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?q=80&w=2940&auto=format&fit=crop';
    }
  };
  
  // Estimasi waktu baca (WPM)
  const readTime = computed(() => {
    if (!news.value?.isi) return 1;
    const text = news.value.isi.replace(/<[^>]*>?/gm, ''); // Hapus tag HTML
    const words = text.split(/\s+/).length;
    const time = Math.ceil(words / 200); // 200 kata per menit
    return time;
  });
  
  // --- NAVIGATION ---
  const goBack = () => {
    // Kembali ke halaman parent (Berita Desa)
    router.push({ name: 'Berita Desa' });
  };
  
  const goToDetail = (id) => {
    // Update query params, Watcher akan mendeteksi ini dan reload data
    router.push({ name: 'beritaperpage', query: { id } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // --- DATA FETCHING ---
  const loadNewsDetail = async () => {
    const id = route.query.id;
    
    if (!id) {
      isLoading.value = false;
      return;
    }
  
    isLoading.value = true;
    try {
      // 1. Fetch Main News
      // Gunakan 'eq' untuk filter berdasarkan ID
      const { data, error } = await fetchSupabase('berita', `select=*&id=eq.${id}`);
      
      if (data && data.length > 0) {
        news.value = data[0];
  
        // 2. Fetch Related News (Fetch 4 items, exclude current ID)
        // Note: Supabase postgrest tidak support 'neq' (not equal) dengan mudah di string query sederhana js client wrapper custom anda
        // Jadi kita fetch lebih sedikit, lalu filter manual di client side (opsi termudah)
        const { data: related } = await fetchSupabase('berita', 'select=id,title,tanggal,tipe,image_url&order=tanggal.desc&limit=5');
        
        if (related) {
          relatedNews.value = related.filter(item => item.id !== id).slice(0, 4);
        }
  
      } else {
        news.value = null; // Tidak ditemukan
      }
  
    } catch (e) {
      console.error("Error loading detail:", e);
      news.value = null;
    } finally {
      isLoading.value = false;
    }
  };
  
  // --- LIFECYCLE ---
  onMounted(() => {
    loadNewsDetail();
  });
  
  // Watch route query ID untuk reload jika user klik berita lain di sidebar
  watch(() => route.query.id, (newId) => {
    if (newId) loadNewsDetail();
  });
  
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  /* Custom styling untuk konten Quill agar lebih cantik 
    karena Tailwind Typography defaultnya sangat polos
  */
  :deep(.prose ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  :deep(.prose ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
  }
  :deep(.prose blockquote) {
    border-left-color: #10b981; /* Emerald-500 */
    background-color: #f0fdf4; /* Emerald-50 */
    padding: 1rem;
    border-radius: 0 0.5rem 0.5rem 0;
    font-style: italic;
  }
  </style>