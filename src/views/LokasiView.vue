<template>
  <div class="font-sans bg-[#f8fafc] min-h-screen pb-24 selection:bg-emerald-500 selection:text-white">
    
    <div class="relative h-[60vh] md:h-[70vh] flex items-end justify-start overflow-hidden bg-slate-900 px-6 pb-20 md:px-16 md:pb-32">
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
          alt="Desa Background" class="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60" />
        <div class="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/40 to-transparent"></div>
        <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div class="relative z-10 max-w-4xl">
        <div class="inline-flex items-center gap-3 py-2 px-4 rounded-full bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-down">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Digital Twin Desa v2.0
        </div>
        <h1 class="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[0.9] animate-fade-in-up">
          Eksplorasi <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">Teritorial.</span>
        </h1>
        <p class="text-slate-300 text-lg md:text-xl font-light max-w-xl leading-relaxed opacity-0 animate-fade-in-up" style="animation-delay: 300ms; animation-fill-mode: forwards;">
          Navigasi cerdas wilayah <span class="text-white font-semibold">{{ desaProfile?.nama_desa || 'Sidomukti' }}</span>. Integrasi data geospasial untuk transparansi publik.
        </p>
      </div>
    </div>

    <div class="max-w-[1600px] mx-auto px-4 -mt-20 relative z-20">
      <div class="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden min-h-[700px] flex flex-col lg:flex-row">
        
        <div class="lg:w-[400px] p-8 md:p-10 border-r border-slate-200/50 flex flex-col justify-between bg-white/50">
          <div>
            <div class="flex items-center gap-4 mb-10">
              <div class="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 text-white">
                <Compass class="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800 tracking-tighter">Pusat Navigasi</h2>
                <p class="text-xs text-slate-500 font-medium uppercase tracking-widest">Koordinat Terverifikasi</p>
              </div>
            </div>

            <div v-if="loadingDesa" class="space-y-6">
              <div v-for="i in 3" :key="i" class="h-24 bg-slate-100 rounded-3xl animate-pulse"></div>
            </div>

            <div v-else class="space-y-6">
              <div class="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-100 group hover:border-emerald-500 transition-all duration-500">
                <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-2">Titik Pusat</span>
                <p class="text-slate-600 text-sm font-semibold leading-relaxed">
                  {{ desaProfile?.alamat || 'Dsn. Krajan, Sidomukti, Kec. Bener, Purworejo, Jawa Tengah' }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div v-for="(val, key) in batasWilayahList" :key="key" 
                  class="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:bg-white hover:border-emerald-100 transition-all text-center group">
                  <span class="block text-[9px] font-bold text-slate-400 uppercase mb-1 group-hover:text-emerald-500 transition-colors">{{ key }}</span>
                  <span class="text-xs font-black text-slate-700 truncate block">{{ val || '-' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-10 space-y-4">
            <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
              <div class="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                <Globe class="w-4 h-4" />
              </div>
              <p class="text-[11px] font-bold text-emerald-800 leading-tight">Kontrol peta tersedia di pojok kanan untuk pengalaman navigasi terbaik.</p>
            </div>

            <button @click="openRoute(DESA_COORDS.lat, DESA_COORDS.lng)"
              class="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-200">
              <MapIcon class="w-5 h-5" />
              Buka Google Maps
            </button>
          </div>
        </div>

        <div class="flex-1 relative group overflow-hidden">
          <div id="mapContainer" class="w-full h-[500px] lg:h-full z-0 transition-all duration-700"></div>
          
          <div class="absolute top-6 right-6 z-[1000] flex flex-col items-end gap-3">
            <div class="relative">
              <button 
                @click="showLayerMenu = !showLayerMenu"
                class="p-4 bg-white/90 backdrop-blur shadow-2xl rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all group flex items-center gap-3 active:scale-95">
                <span class="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-emerald-600 hidden md:block">Ganti Mode</span>
                <Layers class="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
              </button>

              <transition name="slide-fade">
                <div v-if="showLayerMenu" class="absolute top-full right-0 mt-3 w-48 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-100 p-2 flex flex-col gap-1 z-[1001]">
                  <button v-for="(layer, key) in mapLayers" :key="key"
                    @click="changeLayer(key)"
                    :class="[
                      'w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group',
                      activeLayer === key ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-emerald-50 text-slate-600'
                    ]">
                    <span class="text-xs font-black uppercase tracking-widest">{{ key }}</span>
                    <div v-if="activeLayer === key" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <div class="absolute bottom-10 right-6 z-[1000] flex flex-col gap-2">
            <button @click="mapZoomIn" 
              class="p-3 bg-white/90 backdrop-blur shadow-xl rounded-xl border border-slate-200 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 group">
              <Plus class="w-6 h-6" />
            </button>
            <button @click="mapZoomOut" 
              class="p-3 bg-white/90 backdrop-blur shadow-xl rounded-xl border border-slate-200 hover:bg-emerald-500 hover:text-white transition-all active:scale-90 group">
              <Minus class="w-6 h-6" />
            </button>
          </div>

          <div v-if="loadingMap" class="absolute inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-10">
            <Loader2 class="w-10 h-10 text-emerald-600 animate-spin" />
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 mt-32">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
        <div>
          <h2 class="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Potensi <span class="text-emerald-500">Spasial</span></h2>
          <div class="h-1.5 w-24 bg-emerald-500 rounded-full"></div>
        </div>
        <p class="text-slate-500 max-w-sm font-medium italic">"Menyajikan data persebaran infrastruktur dan ekonomi secara presisi."</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="item in potensiList" :key="item.id"
          class="group relative bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
          <div class="relative h-60 rounded-[2rem] overflow-hidden mb-6">
            <img :src="item.foto_path || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80'" 
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
            <div class="absolute top-4 left-4">
              <span class="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-black text-emerald-700 uppercase shadow-sm">
                {{ formatKategori(item.kategori) }}
              </span>
            </div>
          </div>
          <div class="px-4 pb-4">
            <h3 class="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">{{ item.nama }}</h3>
            <div class="flex items-center gap-2 text-slate-400 mb-6">
              <MapPin class="w-4 h-4" />
              <span class="text-xs font-medium">{{ item.lokasi || 'Koordinat Terlampir' }}</span>
            </div>
            <button @click="openRoute(item.latitude, item.longitude)"
              class="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all">
              Akses Lokasi <MoveRight class="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { 
  MapPin, Compass, Loader2, MoveRight, 
  Map as MapIcon, Layers, Globe, Plus, Minus 
} from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js';

const DESA_COORDS = { lat: -7.5679487, lng: 110.0453959 };
const loadingMap = ref(true);
const loadingDesa = ref(true);
const loadingPotensi = ref(true);
const showLayerMenu = ref(false);
const activeLayer = ref('Street');
const desaProfile = ref(null);
const potensiList = ref([]);
let mapInstance = null;
let currentTileLayer = null;

const mapLayers = {
  Street: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  Satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  Terrain: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
};

const fetchDesaData = async () => {
  try {
    const { data } = await fetchSupabase('desa', 'select=*&limit=1');
    if (data?.length > 0) desaProfile.value = data[0];
  } finally {
    loadingDesa.value = false;
  }
};

const fetchPotensiData = async () => {
  try {
    const query = 'select=*&is_published=eq.true&latitude=not.is.null&longitude=not.is.null';
    const { data } = await fetchSupabase('potensi_desa', query);
    if (data) potensiList.value = data;
  } finally {
    loadingPotensi.value = false;
  }
};

const mapZoomIn = () => mapInstance?.zoomIn();
const mapZoomOut = () => mapInstance?.zoomOut();

const changeLayer = (type) => {
  if (currentTileLayer) mapInstance.removeLayer(currentTileLayer);
  currentTileLayer = window.L.tileLayer(mapLayers[type], {
    attribution: type === 'Satellite' ? 'Esri' : '©OpenStreetMap',
    maxZoom: 19
  });
  currentTileLayer.addTo(mapInstance);
  activeLayer.value = type;
  showLayerMenu.value = false;
};

const initLeafletMap = () => {
  if (!window.L) return;

  mapInstance = window.L.map('mapContainer', {
    center: [DESA_COORDS.lat, DESA_COORDS.lng],
    zoom: 15,
    zoomControl: false, // Matikan default agar bisa pakai kontrol kustom kita
    scrollWheelZoom: true
  });

  changeLayer('Street');

  const createIcon = (color) => window.L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-container">
            <div class="marker-pulse" style="background: ${color}"></div>
            <div class="marker-core" style="background: ${color}"></div>
           </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  window.L.marker([DESA_COORDS.lat, DESA_COORDS.lng], { icon: createIcon('#10b981') })
    .addTo(mapInstance)
    .bindPopup(`<div class="font-bold text-emerald-800 p-1">Kantor Desa</div>`);

  potensiList.value.forEach(item => {
    window.L.marker([item.latitude, item.longitude], { icon: createIcon('#0f172a') })
      .addTo(mapInstance)
      .bindPopup(`<div class="p-2"><p class="text-[9px] font-black text-slate-400 uppercase">${item.kategori}</p><p class="font-bold text-slate-800">${item.nama}</p></div>`);
  });

  setTimeout(() => {
    mapInstance.invalidateSize();
    loadingMap.value = false;
  }, 800);
};

const loadLeafletResources = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  document.head.appendChild(link);
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.onload = initLeafletMap;
  document.head.appendChild(script);
};

const openRoute = (lat, lng) => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
const formatKategori = (cat) => cat?.replace(/_/g, ' ').toUpperCase() || 'INFO';
const batasWilayahList = computed(() => ({
  Utara: desaProfile.value?.batas_utara,
  Timur: desaProfile.value?.batas_timur,
  Selatan: desaProfile.value?.batas_selatan,
  Barat: desaProfile.value?.batas_barat
}));

onMounted(async () => {
  await Promise.all([fetchDesaData(), fetchPotensiData()]);
  loadLeafletResources();
});
</script>

<style scoped>
.slide-fade-enter-active { transition: all 0.3s ease-out; }
.slide-fade-leave-active { transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateY(-10px); opacity: 0; }

:deep(.marker-container) { display: flex; align-items: center; justify-content: center; position: relative; }
:deep(.marker-core) { width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; z-index: 2; }
:deep(.marker-pulse) { position: absolute; width: 30px; height: 30px; border-radius: 50%; animation: marker-ping 2s infinite; opacity: 0.4; z-index: 1; }

@keyframes marker-ping { 0% { transform: scale(0.5); opacity: 0.8; } 100% { transform: scale(2); opacity: 0; } }
@keyframes slow-zoom { from { transform: scale(1); } to { transform: scale(1.15); } }
.animate-slow-zoom { animation: slow-zoom 30s infinite alternate ease-in-out; }
.animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-fade-in-down { animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

:deep(.leaflet-popup-content-wrapper) { border-radius: 1.5rem; border: none; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); }
</style>