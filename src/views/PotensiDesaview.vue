<template>
  <div class="font-sans bg-slate-50 min-h-screen pb-24">
    
    <div class="relative bg-emerald-950 h-[450px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop" 
          alt="Latar Belakang Desa" 
          class="w-full h-full object-cover animate-slow-zoom"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-slate-50 via-emerald-900/60 to-emerald-950/0"></div>
      
      <div class="relative z-10 text-center px-4 mt-8 max-w-4xl mx-auto">
        <span class="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-6 uppercase tracking-widest backdrop-blur-md shadow-lg">
          <Sparkles class="w-3 h-3" />
          Jelajahi Kekayaan Lokal
        </span>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl leading-tight">
          Potensi Unggulan <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-teal-400">{{ profilDesa.nama_desa || 'Desa Sidomukti' }}</span>
        </h1>
        <p class="text-slate-200 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto opacity-90">
          Menyingkap pesona wisata alam, kearifan budaya, serta produk ekonomi kreatif hasil tangan terampil warga desa kami.
        </p>

        <div class="flex justify-center gap-4 mt-8">
          <a v-if="profilDesa.facebook_url" :href="profilDesa.facebook_url" target="_blank" class="text-white/70 hover:text-white transition-colors">
            <Facebook class="w-5 h-5" />
          </a>
          <a v-if="profilDesa.instagram_url" :href="profilDesa.instagram_url" target="_blank" class="text-white/70 hover:text-white transition-colors">
            <Instagram class="w-5 h-5" />
          </a>
          <a v-if="profilDesa.youtube_url" :href="profilDesa.youtube_url" target="_blank" class="text-white/70 hover:text-white transition-colors">
            <Youtube class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        <div v-for="(stat, idx) in stats" :key="idx" class="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-b-[6px] border-emerald-500 text-center group hover:-translate-y-2 transition-all duration-300">
          <div class="bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
            <component :is="stat.icon" class="w-6 h-6 text-emerald-600" />
          </div>
          <h3 class="text-3xl font-bold text-slate-800 tracking-tight">{{ stat.val }}</h3>
          <p class="text-[10px] md:text-xs text-slate-500 uppercase font-bold tracking-widest mt-1">{{ stat.label }}</p>
        </div>
      </div>
      
      <div class="mb-12">
        <div class="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            v-for="cat in categoryList" 
            :key="cat.id"
            @click="activeCategory = cat.id"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border',
              activeCategory === cat.id 
                ? 'bg-emerald-700 text-white border-emerald-600 shadow-lg shadow-emerald-700/20 transform scale-105' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
            ]"
          >
            <component :is="cat.icon" class="w-4 h-4" />
            {{ cat.label }}
          </button>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="n in 3" :key="n" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-[450px] animate-pulse">
            <div class="h-64 bg-slate-200"></div>
            <div class="p-6 space-y-3">
              <div class="h-4 bg-slate-200 rounded w-1/3"></div>
              <div class="h-6 bg-slate-200 rounded w-3/4"></div>
              <div class="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        <div v-else-if="errorMessage" class="text-center py-20 bg-red-50 rounded-3xl border border-red-100">
          <AlertCircle class="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-red-800">Gagal Memuat Data</h3>
          <p class="text-red-600">{{ errorMessage }}</p>
          <button @click="fetchData" class="mt-4 text-sm underline text-red-700 hover:text-red-900">Coba Lagi</button>
        </div>

        <div v-else>
          <transition-group name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              v-for="item in filteredItems" 
              :key="item.id" 
              class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 group border border-slate-100 flex flex-col h-full cursor-pointer"
              @click="openModal(item)"
            >
              <div class="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  :src="item.foto_path || 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image'" 
                  :alt="item.nama" 
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                >
                
                <div class="absolute top-4 left-4 flex flex-col gap-2 items-start">
                  <span :class="`px-3 py-1 rounded-lg text-[10px] font-bold text-white shadow-md uppercase tracking-wider backdrop-blur-md ${getCategoryColor(item.kategori)}`">
                    {{ formatEnumLabel(item.kategori) }}
                  </span>
                </div>
                
                <div class="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                   <button class="bg-white text-emerald-900 px-6 py-2.5 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-xl flex items-center gap-2">
                     Lihat Detail <ArrowUpRight class="w-4 h-4" />
                   </button>
                </div>
              </div>

              <div class="p-6 flex flex-col flex-grow">
                <div class="mb-2">
                  <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {{ formatEnumLabel(item.jenis) }}
                  </span>
                </div>

                <h3 class="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                  {{ item.nama }}
                </h3>
                
                <p class="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {{ item.deskripsi }}
                </p>
                
                <div class="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between text-sm">
                  <div class="flex items-center gap-2 text-slate-500">
                    <MapPin class="w-4 h-4 text-emerald-500" />
                    <span class="truncate max-w-[150px]">{{ item.lokasi || 'Desa Sidomukti' }}</span>
                  </div>
                  
                  <div v-if="item.harga_min" class="text-slate-700 font-bold text-xs">
                     Mulai {{ formatRupiah(item.harga_min) }}
                  </div>
                </div>
              </div>
            </div>
          </transition-group>

          <div v-if="filteredItems.length === 0" class="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
              <div class="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search class="w-8 h-8 text-slate-400" />
              </div>
              <h3 class="text-slate-800 font-bold text-lg">Belum Ada Data</h3>
              <p class="text-slate-500 mt-2">Belum ada potensi desa terdaftar di kategori ini.</p>
          </div>
        </div>

      </div>

      <div class="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-emerald-900/30">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div class="relative z-10 max-w-3xl mx-auto">
          <h2 class="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">Tertarik Berkolaborasi?</h2>
          <p class="text-emerald-100 mb-10 text-lg leading-relaxed font-light">
            Kami membuka peluang sebesar-besarnya bagi investor, akademisi, dan pegiat sosial untuk bersama mengembangkan potensi Desa Sidomukti menuju desa mandiri melalui unit usaha BUMDes.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
             <a 
              :href="profilDesa.nomor_bumdes ? `https://wa.me/${formatPhone(profilDesa.nomor_bumdes)}` : '#'" 
              target="_blank"
              class="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-8 py-4 rounded-full font-bold shadow-lg shadow-amber-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
             >
               <Phone class="w-5 h-5" /> Hubungi BUMDes: {{ profilDesa.nomor_bumdes || 'None' }}
             </a>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal">
      <div v-if="isModalOpen && selectedItem" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
        
        <div class="bg-white rounded-3xl w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden animate-modal-up">
          
          <button @click="closeModal" class="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white p-2 rounded-full text-slate-800 transition-colors shadow-sm backdrop-blur-md">
            <X class="w-6 h-6" />
          </button>

          <div class="w-full md:w-1/2 bg-slate-100 flex flex-col">
            <div class="relative flex-grow h-64 md:h-[400px] overflow-hidden group">
               <img 
                :src="activeGalleryImage" 
                class="w-full h-full object-cover transition-all duration-500"
                alt="Detail Image"
               />
               <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
            </div>
            
            <div v-if="galleryList.length > 1" class="p-4 flex gap-2 overflow-x-auto bg-slate-50 border-t border-slate-200">
               <button 
                v-for="(img, idx) in galleryList" 
                :key="idx"
                @click="activeGalleryImage = img"
                :class="['flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all', activeGalleryImage === img ? 'border-emerald-500 opacity-100 ring-2 ring-emerald-200' : 'border-transparent opacity-60 hover:opacity-100']"
               >
                 <img :src="img" class="w-full h-full object-cover" />
               </button>
            </div>
          </div>

          <div class="w-full md:w-1/2 p-6 md:p-10 bg-white overflow-y-auto">
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span :class="`px-3 py-1 rounded-md text-xs font-bold text-white uppercase ${getCategoryColor(selectedItem.kategori)}`">
                {{ formatEnumLabel(selectedItem.kategori) }}
              </span>
              <span class="px-3 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-600 uppercase">
                {{ formatEnumLabel(selectedItem.jenis) }}
              </span>
            </div>

            <h2 class="text-3xl md:text-4xl font-bold text-slate-800 mb-2 leading-tight">{{ selectedItem.nama }}</h2>
            <div v-if="selectedItem.harga_min" class="text-2xl font-bold text-emerald-600 mb-6 flex items-baseline gap-1">
              {{ formatRupiah(selectedItem.harga_min) }}
              <span v-if="selectedItem.satuan_harga" class="text-sm font-normal text-slate-500">/ {{ selectedItem.satuan_harga }}</span>
            </div>
            
            <div class="prose prose-slate mb-8">
              <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi</h4>
              <p class="text-slate-600 leading-relaxed">{{ selectedItem.deskripsi }}</p>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-8">
               <div class="bg-slate-50 p-4 rounded-xl">
                 <div class="flex items-center gap-2 text-slate-400 mb-1">
                   <User class="w-4 h-4" /> <span class="text-xs font-bold uppercase">Pengelola</span>
                 </div>
                 <p class="font-semibold text-slate-700">{{ selectedItem.pengelola || '-' }}</p>
               </div>
               <div class="bg-slate-50 p-4 rounded-xl">
                 <div class="flex items-center gap-2 text-slate-400 mb-1">
                   <MapPin class="w-4 h-4" /> <span class="text-xs font-bold uppercase">Lokasi</span>
                 </div>
                 <p class="font-semibold text-slate-700">{{ selectedItem.lokasi || 'Sidomukti' }}</p>
               </div>
            </div>

            <div v-if="selectedItem.latitude && selectedItem.longitude" class="mb-8 rounded-xl overflow-hidden border border-slate-200 h-48 relative bg-slate-100">
               <iframe 
                width="100%" 
                height="100%" 
                frameborder="0" 
                scrolling="no" 
                marginheight="0" 
                marginwidth="0" 
                :src="`https://maps.google.com/maps?q=${selectedItem.latitude},${selectedItem.longitude}&z=15&output=embed`">
               </iframe>
               <a :href="`https://www.google.com/maps/search/?api=1&query=${selectedItem.latitude},${selectedItem.longitude}`" target="_blank" class="absolute bottom-2 right-2 bg-white px-3 py-1 text-xs font-bold rounded shadow text-slate-700 hover:text-emerald-600">
                 Buka di Google Maps
               </a>
            </div>
            <div v-else-if="selectedItem.maps_url" class="mb-8">
                <a :href="selectedItem.maps_url" target="_blank" class="flex items-center justify-center gap-2 w-full py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                    <Map class="w-5 h-5" /> Lihat Lokasi di Peta
                </a>
            </div>

            <div class="flex gap-3 mt-auto">
               <a 
                 v-if="selectedItem.kontak_wa"
                 :href="getWhatsAppLink(selectedItem.kontak_wa, selectedItem.nama)"
                 target="_blank"
                 class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
               >
                 <MessageCircle class="w-5 h-5" /> Hubungi via WhatsApp
               </a>
            </div>

          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  LayoutGrid, Mountain, Palette, Sprout, 
  Fish, Users, MoreHorizontal, Store, MapPin, 
  ArrowUpRight, Phone, Search, AlertCircle, Sparkles,
  X, User, MessageCircle, Map, Facebook, Instagram, Youtube
} from 'lucide-vue-next';

import { fetchSupabase } from '@/service/api'; 

// --- STATE MANAGEMENT ---
const rawData = ref([]);
const profilDesa = ref({});
const isLoading = ref(true);
const errorMessage = ref(null);
const activeCategory = ref('ALL');

// Modal State
const isModalOpen = ref(false);
const selectedItem = ref(null);
const activeGalleryImage = ref('');
const galleryList = ref([]);

// --- KONFIGURASI KATEGORI ---
const categoryList = [
  { id: 'ALL', label: 'Semua', icon: LayoutGrid },
  { id: 'WISATA', label: 'Wisata', icon: Mountain },
  { id: 'EKONOMI_KREATIF', label: 'Ekraf & UMKM', icon: Palette },
  { id: 'PERTANIAN', label: 'Pertanian', icon: Sprout },
  { id: 'PETERNAKAN', label: 'Peternakan', icon: Sprout },
  { id: 'PERIKANAN', label: 'Perikanan', icon: Fish },
  { id: 'KELEMBAGAAN', label: 'Kelembagaan', icon: Users },
  { id: 'LAINNYA', label: 'Lainnya', icon: MoreHorizontal },
];

const stats = ref([
  { label: 'Unit Usaha', val: '0', icon: Store },
  { label: 'Destinasi', val: '0', icon: Mountain },
  { label: 'Kelompok Tani', val: '0', icon: Sprout },
  { label: 'Lembaga', val: '0', icon: Users },
]);

// --- API FETCHING ---
const fetchData = async () => {
  isLoading.value = true;
  errorMessage.value = null;

  try {
    // Fetch Potensi
    const { data: potensi, error: errPotensi } = await fetchSupabase(
      'potensi_desa', 
      'is_published=eq.true&is_aktif=eq.true'
    );
    if (errPotensi) throw new Error(errPotensi);
    rawData.value = potensi || [];

    // Fetch Profil Desa (untuk nama desa, nomor bumdes, dan sosmed)
    const { data: desa, error: errDesa } = await fetchSupabase('desa');
    if (!errDesa && desa.length > 0) {
      profilDesa.value = desa[0];
    }

    calculateStats();
  } catch (err) {
    console.error("Fetch Error:", err);
    errorMessage.value = "Terjadi kesalahan koneksi server.";
  } finally {
    isLoading.value = false;
  }
};

// --- LOGIC MODAL & GALLERY ---

const openModal = (item) => {
  selectedItem.value = item;
  let images = [];
  if (item.foto_path) images.push(item.foto_path);
  if (item.galeri_path && Array.isArray(item.galeri_path)) {
    images = [...images, ...item.galeri_path];
  }
  galleryList.value = [...new Set(images)].filter(img => img);
  activeGalleryImage.value = galleryList.value.length > 0 
    ? galleryList.value[0] 
    : 'https://placehold.co/600x400?text=No+Image';

  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedItem.value = null;
  document.body.style.overflow = '';
};

const formatPhone = (number) => {
  if (!number) return '';
  let cleanNumber = number.toString().replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = '62' + cleanNumber.slice(1);
  }
  return cleanNumber;
}

const getWhatsAppLink = (number, name) => {
  const cleanNumber = formatPhone(number);
  if (!cleanNumber) return '#';
  const text = encodeURIComponent(`Halo, saya tertarik dengan potensi desa "${name}". Bisa minta info lebih lanjut?`);
  return `https://wa.me/${cleanNumber}?text=${text}`;
};

// --- COMPUTED & HELPER ---
const filteredItems = computed(() => {
  if (activeCategory.value === 'ALL') return rawData.value;
  return rawData.value.filter(item => item.kategori === activeCategory.value);
});

const calculateStats = () => {
  if (!rawData.value.length) return;
  const countCategory = (cat) => rawData.value.filter(i => i.kategori === cat).length;
  stats.value = [
    { label: 'Ekraf & UMKM', val: countCategory('EKONOMI_KREATIF') + '+', icon: Store },
    { label: 'Wisata Alam', val: countCategory('WISATA'), icon: Mountain },
    { label: 'Pertanian', val: countCategory('PERTANIAN') + countCategory('PETERNAKAN'), icon: Sprout },
    { label: 'Kelembagaan', val: countCategory('KELEMBAGAAN'), icon: Users },
  ];
};

const formatEnumLabel = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const getCategoryColor = (cat) => {
  const colors = {
    'WISATA': 'bg-teal-500', 'EKONOMI_KREATIF': 'bg-amber-500',
    'PERTANIAN': 'bg-green-600', 'PETERNAKAN': 'bg-yellow-600',
    'PERIKANAN': 'bg-blue-500', 'KELEMBAGAAN': 'bg-indigo-500',
    'LAINNYA': 'bg-slate-500'
  };
  return colors[cat] || 'bg-slate-500';
};

onMounted(() => fetchData());
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