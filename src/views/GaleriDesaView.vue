<template>
  <div class="font-montserrat bg-slate-50 min-h-screen pb-20">

    <div class="relative bg-emerald-900 h-[300px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2940&auto=format&fit=crop" 
          alt="Galeri Desa" 
          class="w-full h-full object-cover animate-slow-zoom"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/60 to-transparent"></div>
      
      <div class="relative z-10 text-center px-4 mt-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold mb-4 uppercase tracking-wider animate-fade-in-down">
          <Camera class="w-4 h-4" />
          Dokumentasi Visual
        </div>
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">Galeri Desa Sidomukti</h1>
        <p class="text-emerald-100 max-w-2xl mx-auto text-sm md:text-base font-light">
          Rekaman lensa kegiatan masyarakat, potensi desa, dan progres pembangunan.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
      
      <div v-if="isLoading" class="bg-white p-12 rounded-xl shadow-lg border border-slate-100 text-center mb-8">
        <div class="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-slate-500 text-sm">Sedang memuat galeri...</p>
      </div>

      <div v-else>
        <div class="bg-white rounded-xl shadow-lg border border-slate-100 p-4 mb-8 flex flex-wrap justify-center gap-2 sticky top-20 z-30 md:static">
          <button 
            v-for="cat in dynamicCategories" 
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'px-5 py-2 rounded-full text-sm font-bold transition-all duration-300',
              activeCategory === cat 
                ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
                : 'bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <div class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          
          <div 
            v-for="(photo, index) in filteredPhotos" 
            :key="photo.id"
            class="relative group rounded-2xl overflow-hidden break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500 cursor-zoom-in bg-gray-200"
            @click="openLightbox(index)"
          >
            <img 
              :src="photo.src" 
              :alt="photo.caption"
              class="w-full h-auto transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
              loading="lazy"
              @error="handleImageError"
            />

            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <span class="text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1 bg-emerald-900/50 w-fit px-2 py-0.5 rounded backdrop-blur-sm">
                {{ photo.sourceType }}
              </span>
              <span class="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">
                {{ photo.category }}
              </span>
              <h3 class="text-white font-bold text-lg leading-tight line-clamp-2">{{ photo.caption }}</h3>
              <span class="text-slate-300 text-xs mt-2 flex items-center gap-1">
                <Calendar class="w-3 h-3" /> {{ photo.date }}
              </span>
            </div>

            <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
              <Maximize2 class="w-5 h-5" />
            </div>
          </div>

        </div>

        <div v-if="filteredPhotos.length === 0" class="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 mt-6">
          <Camera class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-slate-500 font-medium">Tidak ada foto dalam kategori ini.</p>
        </div>
      </div>

    </div>

    <transition name="fade">
      <div v-if="isLightboxOpen" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" @click="closeLightbox">
        
        <button @click.stop="closeLightbox" class="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110]">
          <X class="w-10 h-10" />
        </button>

        <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" @click.stop>
          
          <img 
            :src="currentPhoto.src" 
            class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-zoom-in"
          />

          <div class="mt-4 text-center max-w-2xl px-4">
             <span class="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 rounded">
                {{ currentPhoto.category }}
             </span>
             <h3 class="text-white text-xl font-bold">{{ currentPhoto.caption }}</h3>
             <p class="text-slate-400 text-sm mt-1 flex justify-center items-center gap-2">
                <Calendar class="w-3 h-3" /> {{ currentPhoto.date }}
             </p>
          </div>

          <button 
            @click.stop="prevPhoto" 
            class="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-12 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm"
          >
            <ChevronLeft class="w-8 h-8" />
          </button>
          <button 
            @click.stop="nextPhoto" 
            class="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-12 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm"
          >
            <ChevronRight class="w-8 h-8" />
          </button>

          <div class="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-white text-xs font-bold">
            {{ currentIndex + 1 }} / {{ filteredPhotos.length }}
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Camera, Calendar, Maximize2, X, 
  ChevronLeft, ChevronRight 
} from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js'; // Sesuaikan path

// --- STATE ---
const isLoading = ref(true);
const photos = ref([]);
const activeCategory = ref('Semua');

// --- HELPER FORMATTING ---
const capitalize = (str) => {
  if (!str) return '';
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Umum';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
};

// --- DATA FETCHING ---
const loadGallery = async () => {
  isLoading.value = true;
  photos.value = [];

  try {
    // 1. Fetch Potensi Desa (Filter yang published)
    // Kita ambil: nama, kategori, foto_path, galeri_path
    const p1 = fetchSupabase('potensi_desa', 'select=id,nama,kategori,foto_path,galeri_path&is_published=eq.true&is_aktif=eq.true');
    
    // 2. Fetch Berita (Hanya yang punya gambar)
    // Kita ambil: title, tipe, tanggal, image_url
    const p2 = fetchSupabase('berita', 'select=id,title,tipe,tanggal,image_url&image_url=not.is.null');

    const [resPotensi, resBerita] = await Promise.all([p1, p2]);

    const tempPhotos = [];

    // --- PROSES DATA POTENSI ---
    if (resPotensi.data) {
      resPotensi.data.forEach(item => {
        // A. Main Foto Potensi
        if (item.foto_path) {
          tempPhotos.push({
            id: `potensi-${item.id}-main`,
            src: item.foto_path,
            caption: item.nama,
            category: capitalize(item.kategori), // e.g., "Wisata"
            sourceType: 'Potensi Desa',
            date: 'Potensi Unggulan', // Potensi biasanya statis, tidak ada tanggal spesifik
            rawDate: new Date().toISOString() // Sort purposes
          });
        }

        // B. Galeri Tambahan (galeri_path array JSON)
        if (item.galeri_path && Array.isArray(item.galeri_path)) {
          item.galeri_path.forEach((imgUrl, idx) => {
            if (imgUrl) {
              tempPhotos.push({
                id: `potensi-${item.id}-gal-${idx}`,
                src: imgUrl,
                caption: `${item.nama} (Galeri ${idx + 1})`,
                category: capitalize(item.kategori),
                sourceType: 'Potensi Desa',
                date: 'Dokumentasi',
                rawDate: new Date().toISOString()
              });
            }
          });
        }
      });
    }

    // --- PROSES DATA BERITA ---
    if (resBerita.data) {
      resBerita.data.forEach(item => {
        if (item.image_url) {
          tempPhotos.push({
            id: `berita-${item.id}`,
            src: item.image_url,
            caption: item.title,
            category: capitalize(item.tipe), // e.g., "Kegiatan", "Pembangunan"
            sourceType: 'Berita & Kegiatan',
            date: formatDate(item.tanggal),
            rawDate: item.tanggal
          });
        }
      });
    }

    // Shuffle atau Sort (disini kita sort berdasarkan tanggal terbaru berita, potensi dianggap baru)
    // Atau acak biar terlihat bervariasi
    photos.value = tempPhotos.sort(() => Math.random() - 0.5);

  } catch (e) {
    console.error("Gagal memuat galeri:", e);
  } finally {
    isLoading.value = false;
  }
};

// --- COMPUTED ---
// Generate kategori unik dari data yang ada
const dynamicCategories = computed(() => {
  const cats = new Set(['Semua']);
  photos.value.forEach(p => cats.add(p.category));
  return Array.from(cats).sort();
});

const filteredPhotos = computed(() => {
  if (activeCategory.value === 'Semua') return photos.value;
  return photos.value.filter(p => p.category === activeCategory.value);
});

// --- LIGHTBOX LOGIC ---
const isLightboxOpen = ref(false);
const currentIndex = ref(0);

const currentPhoto = computed(() => {
  if (filteredPhotos.value.length === 0) return {};
  return filteredPhotos.value[currentIndex.value] || {};
});

const openLightbox = (index) => {
  currentIndex.value = index;
  isLightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  document.body.style.overflow = 'auto';
};

const nextPhoto = () => {
  if (currentIndex.value < filteredPhotos.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
};

const prevPhoto = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = filteredPhotos.value.length - 1;
  }
};

// Handle Broken Image
const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia'; // Fallback
};

// Keyboard Navigation
const handleKeydown = (e) => {
  if (!isLightboxOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') nextPhoto();
  if (e.key === 'ArrowLeft') prevPhoto();
};

onMounted(() => {
  loadGallery();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Transisi Fade */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Animasi & Efek */
.animate-slow-zoom { animation: slowZoom 20s infinite alternate; }
@keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.1); } }

@keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.animate-zoom-in { animation: zoomIn 0.3s ease-out forwards; }

.animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }

.break-inside-avoid { break-inside: avoid; }
</style>