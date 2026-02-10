<template>
  <div class="font-montserrat bg-slate-50 min-h-screen flex flex-col">
    
    <main class="flex-grow">
      
      <section class="relative h-[650px] flex items-center justify-center overflow-hidden">
        <div class="absolute inset-0 z-0">
          <swiper
            v-if="coverList.length > 0"
            :modules="[SwiperAutoplay, SwiperEffectFade]"
            :effect="'fade'"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :loop="true"
            class="w-full h-full"
          >
            <swiper-slide v-for="(img, idx) in coverList" :key="idx">
              <div class="relative w-full h-full">
                <img 
                  :src="img" 
                  alt="Pemandangan Desa" 
                  class="w-full h-full object-cover object-center scale-110 animate-slow-zoom"
                />
              </div>
            </swiper-slide>
          </swiper>
          
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-emerald-800/80 to-slate-900/60 mix-blend-multiply z-10"></div>
        </div>

        <div class="relative z-20 text-center text-white px-4 max-w-5xl mx-auto mt-[-40px]">
          <div class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium mb-6 animate-fade-in-down shadow-lg">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Selamat Datang di Portal Resmi
          </div>

          <h1 class="text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight drop-shadow-2xl animate-fade-in-up">
            {{ desaInfo?.nama_desa || 'Desa Sidomukti' }}
          </h1>
          <h2 class="text-xl md:text-2xl font-light text-emerald-100 mb-8 tracking-widest uppercase border-b border-emerald-400/30 pb-4 inline-block animate-fade-in-up delay-100">
            Kecamatan Bener, Jawa Tengah
          </h2>

          <p class="text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-slate-100 font-light opacity-90 animate-fade-in-up delay-200">
            {{ desaInfo?.visi || 'Mewujudkan tata kelola pemerintahan yang transparan, melayani dengan hati, serta membangun kemandirian masyarakat berbasis kearifan lokal dan teknologi.' }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <button @click="navigate('/profile')" class="group bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full font-bold shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 ring-4 ring-emerald-500/20">
              Jelajahi Desa
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button @click="navigate('/services')" class="group bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              Layanan Online
              <div class="w-2 h-2 bg-emerald-400 rounded-full group-hover:scale-150 transition-transform"></div>
            </button>
          </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 z-20 translate-y-[1px]">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full block h-[60px] md:h-[100px]">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" class="fill-slate-50"/>
          </svg>
        </div>
      </section>

      <section class="relative z-30 -mt-20 md:-mt-28 px-4 mb-20">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, index) in stats" :key="index" 
                 class="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
              <div class="flex items-center justify-between mb-4">
                <div :class="`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`">
                  <component :is="stat.icon" :class="`w-7 h-7 ${stat.textColor}`" />
                </div>
                <span class="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-500">Update Terkini</span>
              </div>
              <h3 v-if="isLoading" class="text-2xl font-extrabold text-gray-300 animate-pulse">Loading...</h3>
              <h3 v-else class="text-4xl font-extrabold text-slate-800 mb-1">{{ stat.value }}</h3>
              <p class="text-slate-500 font-medium text-sm uppercase tracking-wider">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside class="lg:col-span-4 space-y-8 order-2 lg:order-1">
            <div class="sticky top-28 space-y-8">
              
              <div class="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden ring-1 ring-slate-900/5">
                <div class="bg-emerald-700 px-6 py-4 flex items-center justify-between relative overflow-hidden">
                  <div class="absolute inset-0 bg-pattern opacity-10"></div> 
                  <h3 class="font-bold text-white flex items-center gap-2 relative z-10">
                    <Pin class="w-5 h-5" />
                    Info Penting
                  </h3>
                  <span class="bg-white/20 backdrop-blur-sm border border-white/20 text-xs font-bold text-white px-2 py-1 rounded relative z-10 animate-pulse">Live</span>
                </div>
                
                <div v-if="pinnedNews.length === 0" class="p-6 text-center text-slate-400 text-sm">
                    Tidak ada pengumuman aktif.
                </div>

                <div v-else class="divide-y divide-slate-100">
                  <article v-for="(news, idx) in pinnedNews" :key="idx" @click="goToBerita(news.id)" class="p-5 hover:bg-emerald-50/60 transition-colors group cursor-pointer">
                    <div class="flex gap-4">
                      <div class="flex-col items-center hidden sm:flex min-w-[50px]">
                         <div class="text-xs font-bold text-slate-400 uppercase">{{ news.dateOnly }}</div>
                         <div class="text-2xl font-bold text-emerald-600 leading-none">{{ news.dayOnly }}</div>
                      </div>
                      <div>
                        <span class="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 mb-1 uppercase">
                          {{ news.tipe }}
                        </span>
                        <h4 class="text-sm font-bold text-slate-700 group-hover:text-emerald-700 leading-snug mb-1 line-clamp-3">
                          {{ news.title }}
                        </h4>
                      </div>
                    </div>
                  </article>
                </div>
                
                <div class="p-4 bg-slate-50 border-t border-slate-100 text-center">
                  <button @click="go('Berita desa','Pengumuman')"  class="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center justify-center gap-1 mx-auto group">
                    Lihat Arsip Pengumuman
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </button>
                </div>
              </div>

              <div class="bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl shadow-sm border border-emerald-100 p-6">
                <h3 class="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-emerald-100 pb-2">
                  <Calendar class="w-5 h-5 text-emerald-600" />
                  Agenda Mendatang
                </h3>

                <div v-if="agendaList.length === 0" class="text-center text-slate-400 text-sm py-4">
                  Belum ada agenda terjadwal.
                </div>

                <div v-else class="space-y-4">
                  <div v-for="(agenda, i) in agendaList" :key="i" class="flex gap-4 items-center group cursor-pointer">
                    <div class="bg-white border border-emerald-200 rounded-xl p-2 text-center min-w-[65px] shadow-sm group-hover:border-emerald-400 transition-colors">
                      <span class="block text-xs font-bold text-emerald-600 uppercase">{{ agenda.month }}</span>
                      <span class="block text-2xl font-black text-slate-800">{{ agenda.day }}</span>
                    </div>
                    <div>
                      <h4 class="font-bold text-sm text-slate-700 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {{ agenda.title }}
                      </h4>
                      <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 
                        {{ agenda.lokasi || 'Lokasi Menyesuaikan' }}
                      </p>
                       <p class="text-[10px] text-slate-400 mt-0.5">
                         {{ formatTimeRange(agenda.waktu_mulai, agenda.waktu_selesai) }}
                       </p>
                    </div>
                  </div>
                </div>

                 <div class="mt-6 pt-4 border-t border-slate-100 text-center">
                    <button @click="navigate('/berita/agenda')" class="text-xs font-bold text-slate-500 hover:text-emerald-600 uppercase tracking-wider">
                      Lihat Kalender Lengkap
                    </button>
                 </div>
              </div>

            </div>
          </aside>

          <div class="lg:col-span-8 order-1 lg:order-2">
            
            <div class="mb-10 text-center md:text-left">
              <h2 class="text-3xl font-bold text-slate-800 mb-3">Akses Cepat Informasi</h2>
              <div class="h-1 w-20 bg-emerald-500 rounded-full mb-3 mx-auto md:mx-0"></div>
              <p class="text-slate-600">Jelajahi layanan digital dan potensi unggulan Desa Sidomukti.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <div v-for="(item, index) in highlights" :key="index" 
                   class="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group relative overflow-hidden cursor-pointer"
                   @click="navigate(item.action)">
                
                <div class="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-[10] transition-transform duration-700 ease-in-out opacity-50"></div>
                
                <div class="relative z-10">
                  <div class="w-14 h-14 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <component :is="item.icon" class="w-7 h-7" />
                  </div>
                  <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-900">{{ item.title }}</h3>
                  <p class="text-slate-600 mb-6 leading-relaxed text-sm group-hover:text-slate-700">{{ item.description }}</p>
                  
                  <div class="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:gap-3 transition-all">
                    Selengkapnya <ArrowRight class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-16">
              <VidioCard />
            </div>

            <div class="mb-16">
              <Maps />
            </div>

            <div class="bg-gradient-to-br from-emerald-900 to-teal-800 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl text-white mb-16">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0ZM100 180C55.8172 180 20 144.183 20 100C20 55.8172 55.8172 20 100 20C144.183 20 180 55.8172 180 100C180 144.183 144.183 180 100 180Z" fill="white"/>
                </svg>
              </div>
              
              <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div class="relative">
                  <div class="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-emerald-400/50 overflow-hidden shadow-2xl flex-shrink-0 bg-gray-300 ring-4 ring-emerald-900/50">
                    <img :src="desaInfo?.foto_kades_path || `https://ui-avatars.com/api/?name=${desaInfo?.kades || 'Kades'}&background=random&size=256`" alt="Kepala Desa" class="w-full h-full object-cover">
                  </div>
                  <div class="absolute -bottom-2 -right-2 bg-yellow-500 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-emerald-800">
                    Kepala Desa
                  </div>
                </div>

                <div class="text-center md:text-left flex-1">
                  <h3 class="text-2xl font-bold mb-2 text-white">Sambutan Kepala Desa</h3>
                  <div class="w-full h-px bg-gradient-to-r from-emerald-500 to-transparent mb-4"></div>
                  <p class="text-emerald-50 italic mb-6 leading-relaxed font-light text-lg">
                    "{{ desaInfo?.kata_kades || 'Mari bersama membangun desa yang mandiri dan sejahtera.' }}"
                  </p>
                  <div>
                    <div class="font-bold text-xl text-white">{{ desaInfo?.kades || 'H. Sutrisno, S.IP' }}</div>
                    <div class="text-sm text-emerald-300 font-medium">{{ desaInfo?.periode_kades }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
                <div class="flex items-center justify-between mb-6">
                   <h2 class="text-2xl font-bold text-slate-800">Berita Terbaru</h2>
                   <a href="#" @click.prevent="navigate('/berita')" class="text-sm font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                     Lihat Semua <ArrowRight class="w-4 h-4"/>
                   </a>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div v-for="news in latestNews" :key="news.id" class="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all group h-full flex flex-col">
                      <div class="relative h-48 overflow-hidden bg-slate-100">
                         <img 
                          :src="news.image_url || 'https://via.placeholder.com/400x300?text=Berita+Desa'" 
                          @error="$event.target.src = 'https://via.placeholder.com/400x300?text=No+Image'"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         >
                         <div class="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wide">
                           {{ news.tipe }}
                         </div>
                      </div>
                      <div class="p-5 flex flex-col flex-grow">
                         <div class="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <Calendar class="w-3 h-3" /> {{ formatDateFull(news.tanggal) }}
                         </div>
                         <h3 class="font-bold text-slate-800 mb-2 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                           {{ news.title }}
                         </h3>
                         <div class="text-sm text-slate-500 line-clamp-2 mb-4" v-html="stripHtml(news.isi)"></div>
                         <button @click="goToBerita(news.id)" class="mt-auto text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1 group/btn">
                           Baca Selengkapnya 
                           <ArrowRight class="w-3 h-3 group-hover/btn:translate-x-1 transition-transform"/>
                         </button>
                      </div>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </section>
      <BubbleUp></BubbleUp>

    </main>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import VidioCard from '@/components/VidioCard.vue';
import BubbleUp from '@/components/BubbleUp.vue';

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay as SwiperAutoplay, EffectFade as SwiperEffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';



// IMPORT KOMPONEN MAPS
import Maps from '@/components/Maps.vue';

import { 
  Users, MapPin, TrendingUp, ArrowRight, 
  FileText, Megaphone, LayoutGrid, Pin, Calendar
} from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js';

const router = useRouter();
const desaInfo = ref(null);
const statistikInfo = ref(null);
const isLoading = ref(true);

const pinnedNews = ref([]);
const agendaList = ref([]);
const latestNews = ref([]);

const stats = ref([
  { 
    icon: Users, 
    label: 'Jumlah Penduduk', 
    value: '...', 
    bgColor: 'bg-blue-50', 
    textColor: 'text-blue-600' 
  },
  { 
    icon: MapPin, 
    label: 'Luas Wilayah', 
    value: '...', 
    bgColor: 'bg-emerald-50', 
    textColor: 'text-emerald-600' 
  },
  { 
    icon: TrendingUp, 
    label: 'Dana Desa Terserap', 
    value: '0%', 
    bgColor: 'bg-amber-50', 
    textColor: 'text-amber-600' 
  },
]);
const pageTitle = computed(() => {
  if (desaInfo.value?.nama_desa) {
    return `${desaInfo.value.nama_desa} – Kecamatan Bener Kabupaten Purworejo`
  }
  return 'Desa Sidomukti – Kecamatan Bener Kabupaten Purworejo'
})

const pageDescription = computed(() => {
  if (desaInfo.value?.visi) {
    return desaInfo.value.visi
  }
  return 'Website resmi Desa Sidomukti Kecamatan Bener Kabupaten Purworejo. Informasi profil desa, berita, potensi, transparansi, dan layanan masyarakat.'
})

useHead({
  title: pageTitle,
  meta: [
    {
      name: 'description',
      content: pageDescription
    },
    {
      property: 'og:title',
      content: pageTitle
    },
    {
      property: 'og:description',
      content: pageDescription
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

const go = (page, category = null) => {
  if (category) {
    router.push({ name: page, query: { filter: category } });
  } else {
    router.push({ name: page });
  }
};

const goToBerita = (uuid) => {
  router.push(`berita/beritaperpage?id=${uuid}`);
};

const coverList = computed(() => {
  if (desaInfo.value?.cover_desa_path) {
    return desaInfo.value.cover_desa_path.split(',').map(item => item.trim());
  }
  return ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop'];
});

const highlights = [
  { title: 'Profil & Visi Misi', description: 'Kenali sejarah, visi, misi, serta struktur pemerintahan desa yang melayani Anda.', action: '/profile', icon: FileText },
  { title: 'Transparansi Desa', description: 'Akses laporan APBDes, realisasi anggaran, dan dokumentasi pembangunan secara terbuka.', action: '/transparansi', icon: TrendingUp },
  { title: 'Layanan Mandiri', description: 'Urus surat pengantar, SKCK, dan administrasi kependudukan dari rumah secara online.', action: '/services', icon: LayoutGrid },
  { title: 'Potensi & UMKM', description: 'Galeri produk unggulan desa, pariwisata, dan potensi ekonomi kreatif warga.', action: '/potensi', icon: Megaphone },
];

const loadDashboardData = async () => {
  isLoading.value = true;
  try {
    const { data: desa } = await fetchSupabase('desa', 'select=*&limit=1');
    if (desa && desa.length > 0) desaInfo.value = desa[0];

    const { data: stat } = await fetchSupabase('statistik_desa', 'select=*&limit=1');
    if (stat && stat.length > 0) statistikInfo.value = stat[0];

    const { data: agendas } = await fetchSupabase('agenda', 'select=*&order=tanggal.asc&limit=4');
    if (agendas) {
        agendaList.value = agendas.map(item => ({
            ...item,
            day: new Date(item.tanggal).getDate(),
            month: new Date(item.tanggal).toLocaleString('id-ID', { month: 'short' }).toUpperCase()
        }));
    }

    const { data: announcements } = await fetchSupabase('berita', 'select=*&tipe=eq.pengumuman&order=tanggal.desc&limit=5');
    if (announcements) {
        pinnedNews.value = announcements.map(item => ({
            ...item,
            dayOnly: new Date(item.tanggal).getDate(),
            dateOnly: new Date(item.tanggal).toLocaleString('id-ID', { month: 'short' }).toUpperCase()
        }));
    }

    const { data: news } = await fetchSupabase('berita', 'select=*&order=tanggal.desc&limit=2');
    if (news) latestNews.value = news;

    const currentYear = new Date().getFullYear();
    const { data: trans } = await fetchSupabase('transparansi', `select=*&tahun_anggaran=eq.${currentYear}&jenis=eq.RINGKASAN&limit=1`);
    
    let serapanValue = '94%';
    if (trans && trans.length > 0) {
      serapanValue = `${trans[0].persentase}%`;
    }

    updateStatsUI(serapanValue);
  } catch (e) {
    console.error("Error loading dashboard:", e);
  } finally {
    isLoading.value = false;
  }
};

const updateStatsUI = (serapan) => {
  if(statistikInfo.value) {
      stats.value[0].value = `${statistikInfo.value.total_penduduk.toLocaleString()}`;
  }
  if(desaInfo.value && desaInfo.value.luas_wilayah) {
      stats.value[1].value = `${desaInfo.value.luas_wilayah} km²`;
  }
  stats.value[2].value = serapan;
};

const navigate = (page) => {
  router.push(page)
};
const formatDateFull = (date) => date ? new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
const formatTimeRange = (start, end) => start ? `${start.substring(0, 5)} WIB - ${end ? end.substring(0, 5) : 'Selesai'} WIB` : 'Waktu Belum Ditentukan';
const stripHtml = (html) => { if(!html) return ''; let tmp = document.createElement("DIV"); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ""; }

onMounted(() => {
  loadDashboardData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

.animate-slow-zoom {
  animation: slowZoom 20s infinite alternate linear;
}
@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}
.animate-fade-in-down {
  animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(-30px);
}
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }

@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { to { opacity: 1; transform: translateY(0); } }

.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
}

:deep(.swiper-slide) {
  overflow: hidden;
}
</style>