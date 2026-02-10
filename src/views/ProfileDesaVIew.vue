<template>
  <div class="font-montserrat bg-slate-50 min-h-screen pb-20 selection:bg-emerald-200 selection:text-emerald-900">

    <div class="relative h-[450px] lg:h-[550px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img 
  :src="desaInfo?.cover_desa_path?.split(',')[0] || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop'" 
  alt="Cover Desa" 
  class="w-full h-full object-cover transform scale-105 animate-slow-zoom"
/>
        <div class="absolute inset-0 bg-gradient-to-b from-emerald-950/90 via-emerald-900/70 to-slate-50"></div>
      </div>
      
      <div class="relative z-10 text-center px-4 mt-10 max-w-5xl mx-auto">
        <div class="mb-8 animate-fade-in-down">
          <div class="w-28 h-28 md:w-36 md:h-36 mx-auto bg-white/10 backdrop-blur-lg rounded-full p-4 border border-white/20 shadow-2xl ring-4 ring-white/5">
            <img 
              :src="desaInfo?.logo_desa_path || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'" 
              alt="Logo Desa" 
              class="w-full h-full object-contain drop-shadow-md"
            />
          </div>
        </div>

        <span class="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-emerald-800/50 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-bold mb-5 uppercase tracking-[0.2em] animate-fade-in-down">
           <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
           Portal Resmi Pemerintah
        </span>
        
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
          {{ desaInfo?.nama_desa || 'Desa Digital' }}
        </h1>

        <nav class="flex justify-center items-center gap-3 mb- text-emerald-100 text-sm font-medium bg-emerald-900/40 py-2.5 px-8 rounded-full w-fit mx-auto backdrop-blur-md border border-emerald-500/30">
          <router-link to="/" class="hover:text-white transition-colors">Beranda</router-link>
          <span class="opacity-40">/</span>
          <span class="text-white">Profil Desa</span>
        </nav>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
      
      <div v-if="isLoading" class="bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-100">
        <div class="animate-spin w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-500 font-medium animate-pulse">Sedang memuat data...</p>
      </div>

      <div v-else>
        
        <div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 mb-12 flex flex-col md:flex-row gap-2 sticky top-4 z-40 ring-1 ring-slate-900/5">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="switchTab(tab.id)"
            :class="[
              'flex-1 py-3.5 px-6 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2.5',
              activeTab === tab.id 
                ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20 transform scale-[1.01]' 
                : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
            ]"
          >
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </button>
        </div>

        <div class="min-h-[600px] animate-fade-in-up">
          
          <div v-if="activeTab === 'sejarah'" class="space-y-10">
            
            <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative group">
              <div class="absolute top-0 left-0 w-1.5 h-full bg-emerald-600"></div>
              <div class="grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12 items-center">
                <div class="md:col-span-4 lg:col-span-3 text-center relative">
                   <div class="absolute inset-0 bg-emerald-50 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                   <div class="w-48 h-48 mx-auto rounded-full p-1.5 border-2 border-emerald-100 bg-white shadow-xl">
                      <img 
                        :src="desaInfo?.foto_kades_path || `https://ui-avatars.com/api/?name=${desaInfo?.kades}&background=random`" 
                        class="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                   </div>
                   <div class="mt-6">
                     <h3 class="font-bold text-slate-800 text-xl">{{ desaInfo?.kades || 'Kepala Desa' }}</h3>
                     <span class="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
                        Kepala Desa
                     </span>
                     <p class="text-slate-400 text-xs mt-2 font-medium">Periode {{ desaInfo?.periode_kades || '2024-2029' }}</p>
                   </div>
                </div>
                <div class="md:col-span-8 lg:col-span-9 relative pl-0 md:pl-8 border-l-0 md:border-l border-slate-100">
                   <Quote class="w-12 h-12 text-emerald-100 mb-4" />
                   <h2 class="text-2xl font-bold text-slate-800 mb-4">Sambutan Kepala Desa</h2>
                   <div class="prose prose-emerald text-slate-600 italic leading-relaxed text-lg">
                      "{{ desaInfo?.kata_kades || 'Selamat datang di website resmi desa kami. Kami berkomitmen untuk melayani masyarakat dengan sepenuh hati, transparan, dan akuntabel demi kemajuan bersama.' }}"
                   </div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div class="grid grid-cols-1 lg:grid-cols-2">
                <div class="p-10 md:p-14 flex flex-col justify-center">
                  <span class="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-3 flex items-center gap-2">
                    <History class="w-4 h-4" /> Asal Usul
                  </span>
                  <h2 class="text-3xl font-bold text-slate-800 mb-6">Sejarah Desa</h2>
                  <div class="prose prose-slate text-slate-600 leading-relaxed text-justify whitespace-pre-line">
                    {{ desaInfo?.sejarah_desa || 'Data sejarah belum tersedia.' }}
                  </div>
                </div>
                <div class="relative min-h-[400px] overflow-hidden group">
                  <img 
                    :src="sejarah_desa" 
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div class="absolute inset-0 bg-emerald-900/20 group-hover:bg-emerald-900/10 transition-colors"></div>
                  <div class="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-emerald-900/90 to-transparent">
                     <p class="text-white font-medium italic opacity-90">"Menghargai sejarah adalah kunci membangun masa depan."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'visi-misi'">
            <div class="bg-emerald-900 rounded-3xl p-12 text-center text-white shadow-2xl shadow-emerald-900/20 mb-10 relative overflow-hidden border border-emerald-800">
              <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              <div class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
              
              <div class="relative z-10">
                <span class="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-emerald-200 text-xs font-bold uppercase tracking-widest mb-8">
                  Visi Desa 2024-2029
                </span>
                <h2 class="text-3xl md:text-5xl font-bold leading-tight max-w-4xl mx-auto font-serif">
                  "{{ desaInfo?.visi || 'Mewujudkan Desa yang Maju, Mandiri, dan Sejahtera.' }}"
                </h2>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
               <div class="md:col-span-4 bg-white rounded-3xl p-8 border border-emerald-100 shadow-sm h-fit sticky top-24">
                  <div class="flex items-center gap-4 mb-6">
                     <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Target class="w-6 h-6" />
                     </div>
                     <h3 class="text-2xl font-bold text-slate-800">Misi Desa</h3>
                  </div>
                  <p class="text-slate-500 leading-relaxed">
                     Langkah-langkah strategis yang kami tempuh untuk merealisasikan Visi Desa demi kesejahteraan masyarakat.
                  </p>
               </div>
               
               <div class="md:col-span-8 space-y-4">
                  <div v-for="(misi, idx) in formattedMisi" :key="idx" 
                       class="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 flex gap-5">
                     <span class="flex-shrink-0 w-10 h-10 rounded-full bg-slate-50 text-slate-400 font-bold flex items-center justify-center text-lg border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors">
                       {{ idx + 1 }}
                     </span>
                     <p class="text-slate-700 font-medium pt-2 text-lg group-hover:text-emerald-900 transition-colors">{{ misi }}</p>
                  </div>
                  <div v-if="formattedMisi.length === 0" class="text-slate-400 italic text-center py-10">Belum ada data misi.</div>
               </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'demografi'">
             <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div v-for="(batas, key) in batasWilayah" :key="key" 
                     class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-300 hover:shadow-md transition-all group">
                   <div class="text-emerald-200 mb-3 group-hover:text-emerald-600 transition-colors">
                      <component :is="batas.icon" class="w-8 h-8" />
                   </div>
                   <p class="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Batas {{ batas.label }}</p>
                   <h4 class="font-bold text-slate-800 text-lg group-hover:text-emerald-800 transition-colors">{{ batas.value || '-' }}</h4>
                </div>
             </div>

             <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div class="lg:col-span-1 space-y-6">
                    <div class="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 rounded-3xl shadow-xl shadow-emerald-900/20 text-white relative overflow-hidden group">
                       <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                       <Users class="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-950/20" />
                       
                       <h3 class="text-5xl font-extrabold mb-1 relative z-10">{{ statInfo?.total_penduduk?.toLocaleString() || 0 }}</h3>
                       <p class="font-bold opacity-80 uppercase text-xs tracking-wider relative z-10">Total Penduduk (Jiwa)</p>
                       
                       <div class="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 gap-4 relative z-10">
                          <div>
                            <span class="block text-2xl font-bold">{{ statInfo?.laki_laki || 0 }}</span>
                            <span class="text-[10px] uppercase font-bold opacity-60">Laki-laki</span>
                          </div>
                          <div>
                            <span class="block text-2xl font-bold">{{ statInfo?.perempuan || 0 }}</span>
                            <span class="text-[10px] uppercase font-bold opacity-60">Perempuan</span>
                          </div>
                       </div>
                    </div>
                    
                    <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                       <div>
                          <h3 class="text-4xl font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">{{ statInfo?.kepala_keluarga?.toLocaleString() || 0 }}</h3>
                          <p class="text-emerald-600 font-bold uppercase text-xs mt-1 tracking-wider">Kepala Keluarga</p>
                       </div>
                       <div class="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Briefcase class="w-6 h-6" />
                       </div>
                    </div>
                </div>

                <div class="lg:col-span-2 space-y-8">
                    <div class="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                       <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                          <h3 class="font-bold text-slate-800 text-lg">Komposisi Usia</h3>
                          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                       </div>
                       <div class="h-[300px] w-full relative">
                          <canvas id="ageChart"></canvas>
                       </div>
                    </div>
                    <div class="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                       <div class="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                          <h3 class="font-bold text-slate-800 text-lg">Mata Pencaharian</h3>
                          <span class="w-2 h-2 rounded-full bg-emerald-700"></span>
                       </div>
                       <div class="h-[300px] w-full relative">
                          <canvas id="jobChart"></canvas>
                       </div>
                    </div>
                </div>
             </div>
          </div>

          <div v-else-if="activeTab === 'struktur'">
            <div class="text-center mb-16">
              <span class="inline-block px-4 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold tracking-widest uppercase text-xs border border-emerald-100 mb-4">
                Pemerintahan Desa
              </span>
              <h2 class="text-3xl md:text-4xl font-bold text-slate-800">Struktur Organisasi</h2>
              <p class="text-slate-500 mt-2 font-medium">Periode Jabatan 2024 - 2029</p>
            </div>

            <div class="relative flex flex-col items-center">
              <div class="absolute inset-0 pointer-events-none z-0 hidden md:block opacity-50"></div>

              <div class="relative z-10 mb-16">
                 <StaffCard 
                    :name="desaInfo?.kades" 
                    title="Kepala Desa" 
                    :img="desaInfo?.foto_kades_path" 
                    is-leader
                 />
                 <div class="absolute -bottom-16 left-1/2 w-0.5 h-16 bg-emerald-200 -z-10"></div>
              </div>

              <div class="relative z-10 mb-20">
                 <StaffCard 
                    :name="desaInfo?.sekdes" 
                    title="Sekretaris Desa" 
                    :img="desaInfo?.foto_sekdes_path" 
                 />
                 <div class="absolute -top-16 left-1/2 w-0.5 h-16 bg-emerald-200 -z-10"></div>
                 <div class="absolute -bottom-10 left-1/2 w-0.5 h-10 bg-emerald-200 -z-10"></div>
                 <div class="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-0.5 bg-emerald-200 -z-10 hidden md:block"></div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full relative z-10 mb-20">
                 <div v-for="(staff, idx) in dynamicStaffList" :key="idx" class="flex justify-center relative">
                    <div class="absolute -top-10 left-1/2 w-0.5 h-10 bg-emerald-200 -z-10 hidden md:block"></div>
                    <StaffCard 
                       :name="staff.name" 
                       :title="staff.jabatan" 
                       :img="staff.photo" 
                    />
                 </div>
              </div>

              <div class="w-full max-w-2xl h-px bg-slate-200 my-4 mx-auto"></div>

              <div class="w-full">
                 <h3 class="text-center font-bold text-emerald-800 mb-10 uppercase tracking-widest text-xs bg-emerald-50 w-fit mx-auto px-4 py-2 rounded-full">
                    Kepala Kewilayahan
                 </h3>
                 <div class="flex flex-wrap justify-center gap-8">
                    <div class="w-full md:w-auto">
                       <StaffCard 
                          :name="desaInfo?.kadus_1" 
                          title="Kepala Dusun I" 
                          :img="desaInfo?.foto_kadus_1_path" 
                          layout="compact"
                       />
                    </div>
                    <div class="w-full md:w-auto">
                       <StaffCard 
                          :name="desaInfo?.kadus_2" 
                          title="Kepala Dusun II" 
                          :img="desaInfo?.foto_kadus_2_path" 
                          layout="compact"
                       />
                    </div>
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head'
import { watch } from 'vue'

import { ref, onMounted, nextTick, computed, defineComponent, h } from 'vue';
import { History, Target, Users, Quote, BarChart2, Briefcase, ArrowUp, ArrowDown, ArrowRight, ArrowLeft } from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js';
const profilDesa = ref({});
const seoTitle = computed(() => {
  return profilDesa.value?.nama_desa
    ? `Potensi Unggulan ${profilDesa.value.nama_desa} – Kecamatan Bener Kabupaten Purworejo`
    : 'Potensi Unggulan Desa Sidomukti – Kecamatan Bener Kabupaten Purworejo'
})

const seoDescription = computed(() => {
  return profilDesa.value?.deskripsi
    || 'Informasi potensi unggulan Desa Sidomukti meliputi wisata, UMKM, pertanian, peternakan, perikanan, dan kelembagaan desa.'
})
useHead({
  title: seoTitle,
  meta: [
    {
      name: 'description',
      content: seoDescription
    },
    {
      property: 'og:title',
      content: seoTitle
    },
    {
      property: 'og:description',
      content: seoDescription
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})



import sejarah_desa from "@/assets/backends.jpg"

// --- SUB COMPONENT: STAFF CARD (Unified Green Style) ---
const StaffCard = defineComponent({
  props: {
    name: String,
    title: String,
    img: String,
    isLeader: Boolean,
    layout: String
  },
  setup(props) {
    // Fallback Image
    const imgSrc = computed(() => props.img || `https://ui-avatars.com/api/?name=${props.name || 'Staff'}&background=10b981&color=fff&size=256`); // Emerald background for avatars
    
    // Style Classes based on Hierarchy
    const containerClasses = props.isLeader 
      ? 'bg-white rounded-2xl shadow-xl border-t-4 border-emerald-600 w-full max-w-[320px] p-8 z-20' 
      : (props.layout === 'compact' 
          ? 'bg-white rounded-xl shadow-md hover:shadow-lg border border-slate-100 hover:border-emerald-300 w-full md:w-[260px] p-4 flex items-center gap-4 text-left' 
          : 'bg-white rounded-xl shadow-lg border-t-4 border-slate-300 hover:border-emerald-400 w-full max-w-[260px] p-6');

    const imgClasses = props.isLeader
      ? 'w-32 h-32 mb-4 ring-4 ring-emerald-50'
      : (props.layout === 'compact' ? 'w-14 h-14 flex-shrink-0' : 'w-20 h-20 mb-3');

    return () => h('div', { class: `${containerClasses} transition-all duration-300 transform hover:-translate-y-1 relative flex ${props.layout === 'compact' ? 'flex-row' : 'flex-col items-center text-center'}` }, [
      h('div', { class: `${imgClasses} rounded-full overflow-hidden bg-slate-100 shadow-inner` }, [
        h('img', { src: imgSrc.value, class: 'w-full h-full object-cover' })
      ]),
      h('div', {}, [
        h('h4', { class: `font-bold text-slate-800 leading-tight ${props.isLeader ? 'text-xl' : 'text-base'}` }, props.name || '-'),
        h('p', { class: 'text-xs font-bold text-emerald-600 uppercase tracking-wide mt-1' }, props.title)
      ])
    ]);
  }
});

// --- STATE ---
const activeTab = ref('sejarah');
const isLoading = ref(true);
const desaInfo = ref(null);
const statInfo = ref(null);

const tabs = [
  { id: 'sejarah', label: 'Sejarah & Sambutan', icon: History },
  { id: 'visi-misi', label: 'Visi & Misi', icon: Target },
  { id: 'demografi', label: 'Demografi & Wilayah', icon: BarChart2 },
  { id: 'struktur', label: 'Struktur Organisasi', icon: Users },
];

// --- COMPUTED HELPERS ---
const batasWilayah = computed(() => [
  { label: 'Utara', value: desaInfo.value?.batas_utara, icon: ArrowUp },
  { label: 'Timur', value: desaInfo.value?.batas_timur, icon: ArrowRight },
  { label: 'Selatan', value: desaInfo.value?.batas_selatan, icon: ArrowDown },
  { label: 'Barat', value: desaInfo.value?.batas_barat, icon: ArrowLeft },
]);

const formattedMisi = computed(() => {
  if (!desaInfo.value?.misi) return [];
  return desaInfo.value.misi.split(',').map(m => m.trim()).filter(m => m.length > 0);
});

const dynamicStaffList = computed(() => {
  if (!desaInfo.value) return [];
  return [
    { name: desaInfo.value.kaur_keuangan, jabatan: 'Kaur Keuangan', photo: desaInfo.value.foto_kaur_keuangan_path },
    { name: desaInfo.value.kaur_perencanaan, jabatan: 'Kaur Perencanaan', photo: desaInfo.value.foto_kaur_perencanaan_path },
    { name: desaInfo.value.kasi_pemerintahan, jabatan: 'Kasi Pemerintahan', photo: desaInfo.value.foto_kasi_pemerintahan_path },
    { name: desaInfo.value.kasi_kesra, jabatan: 'Kasi Kesejahteraan', photo: desaInfo.value.foto_kasi_kesra_path },
  ];
});

// --- API FETCH ---
const loadData = async () => {
  isLoading.value = true;
  try {
    const { data: desa } = await fetchSupabase('desa', 'select=*&limit=1');
    if (desa?.length) desaInfo.value = desa[0];
    
    const { data: stat } = await fetchSupabase('statistik_desa', 'select=*&limit=1');
    if (stat?.length) statInfo.value = stat[0];

  } catch (e) {
    console.error("Error loading profile:", e);
  } finally {
    isLoading.value = false;
  }
};

// --- CHART JS (Monochromatic Green Config) ---
let ageChartInstance = null;
let jobChartInstance = null;

const loadChartJs = () => {
  if (window.Chart) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const renderCharts = async () => {
  await loadChartJs();
  if (!statInfo.value) return;

  const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { 
          x: { grid: { display: false } },
          y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
      }
  };

  const ctxAge = document.getElementById('ageChart')?.getContext('2d');
  if (ctxAge) {
    if (ageChartInstance) ageChartInstance.destroy();
    ageChartInstance = new window.Chart(ctxAge, {
      type: 'bar',
      data: {
        labels: ['Balita', 'Anak', 'Remaja', 'Dewasa', 'Lansia'],
        datasets: [{
          label: 'Jiwa',
          data: [
            statInfo.value.balita_0_5, statInfo.value.anak_6_12, 
            statInfo.value.remaja_13_25, statInfo.value.dewasa_26_50, 
            statInfo.value.lansia_50_plus
          ],
          // Gradasi Hijau
          backgroundColor: [
             'rgba(16, 185, 129, 0.4)', // Emerald 500 light
             'rgba(16, 185, 129, 0.6)', 
             'rgba(16, 185, 129, 0.8)', 
             'rgba(5, 150, 105, 0.9)', 
             'rgba(4, 120, 87, 1)'      // Emerald 700
          ],
          borderColor: '#059669',
          borderWidth: 1,
          borderRadius: 6,
        }]
      },
      options: commonOptions
    });
  }

  const ctxJob = document.getElementById('jobChart')?.getContext('2d');
  if (ctxJob) {
    if (jobChartInstance) jobChartInstance.destroy();
    jobChartInstance = new window.Chart(ctxJob, {
      type: 'bar',
      indexAxis: 'y', 
      data: {
        labels: ['Petani', 'Wiraswasta', 'Karyawan', 'PNS/TNI', 'Buruh', 'Lainnya'],
        datasets: [{
          label: 'Orang',
          data: [
            statInfo.value.petani, statInfo.value.wiraswasta, 
            statInfo.value.karyawan_swasta, statInfo.value.pns_tni_polri, 
            statInfo.value.buruh, statInfo.value.lainnya
          ],
          // Warna Hijau Muda agar beda dikit tapi tetap hijau
          backgroundColor: 'rgba(52, 211, 153, 0.8)', // Emerald 400
          borderRadius: 6,
        }]
      },
      options: commonOptions
    });
  }
};

const switchTab = async (tabId) => {
  activeTab.value = tabId;
  if (tabId === 'demografi') {
    await nextTick();
    setTimeout(() => { renderCharts(); }, 100);
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
/* Animations */
.animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in-down { animation: fadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slow-zoom { animation: slowZoom 20s infinite alternate linear; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
</style>