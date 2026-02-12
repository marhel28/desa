<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-10 text-center md:text-left">
        <h2 class="text-3xl font-bold text-slate-800 mb-3">Wilayah Administrasi</h2>
        <div class="h-1 w-20 bg-emerald-500 rounded-full mb-3 mx-auto md:mx-0"></div>
        <p class="text-slate-600 max-w-2xl">
          Pemetaan wilayah Desa Sidomukti, Kecamatan Bener, Kabupaten Purworejo yang mencakup fasilitas umum, area perkebunan, hingga pusat pemerintahan desa.
        </p>
      </div>

      <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        
        <div class="relative bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-2xl">
          <div 
            class="absolute top-4 left-4 z-10 hidden md:block transition-opacity duration-300"
            :class="{ 'opacity-0 pointer-events-none': isZoomed }"
          >
            <div class="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-emerald-100 max-w-xs">
              <h4 class="font-bold text-emerald-800 flex items-center gap-2 mb-1">
                <MapPin class="w-4 h-4" />
                Desa Sidomukti
              </h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Terletak di Kecamatan Bener, Purworejo. Klik 2x (Mobile) atau arahkan kursor (PC) untuk memperbesar.
              </p>
            </div>
          </div>

          <div 
            class="relative overflow-hidden cursor-zoom-in"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
            @dblclick="toggleZoom"
          >
            <img 
              :src="maps" 
              alt="Peta Administrasi Desa Sidomukti" 
              class="w-full h-auto object-cover transition-transform duration-200 ease-out"
              :style="zoomStyle"
            />
            
            <div v-if="isZoomed" class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs md:hidden">
              Mode Zoom Aktif
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span> Fasilitas Umum
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="w-3 h-3 rounded-full bg-blue-500"></span> Area Pengairan
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-600">
                <span class="w-3 h-3 rounded-full bg-amber-500"></span> Peternakan
              </div>
            </div>
            
            <button @click="downloadMap" class="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors">
              <Download class="w-4 h-4" />
              Unduh Peta Resolusi Tinggi
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MapPin, Download } from 'lucide-vue-next'
import maps from '@/assets/mapssidomukti.webp'

// State untuk Zoom
const isZoomed = ref(false)
const mousePos = ref({ x: 50, y: 50 })

// Style dinamis untuk transformasi gambar
const zoomStyle = computed(() => {
  if (!isZoomed.value) {
    return {
      transform: 'scale(1)',
      transformOrigin: 'center center'
    }
  }
  return {
    transform: 'scale(2.5)', // Kekuatan zoom
    transformOrigin: `${mousePos.value.x}% ${mousePos.value.y}%`
  }
})

// Handler untuk PC (Hover & Move)
const handleMouseMove = (e) => {
  // Hanya aktifkan auto-zoom di desktop (mouse), di mobile pake toggle
  if (window.innerWidth > 768) {
    isZoomed.value = true
  }
  
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
  const x = ((e.pageX - left - window.scrollX) / width) * 100
  const y = ((e.pageY - top - window.scrollY) / height) * 100
  
  mousePos.value = { x, y }
}

const handleMouseLeave = () => {
  if (window.innerWidth > 768) {
    isZoomed.value = false
  }
}

// Handler untuk Mobile (Double Click/Tap)
const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
  // Jika zoom dimatikan, kembalikan ke tengah
  if (!isZoomed.value) {
    mousePos.value = { x: 50, y: 50 }
  }
}

const downloadMap = () => {
  const link = document.createElement('a')
  link.href = maps
  link.download = 'Peta_Administrasi_Sidomukti.webp'
  link.click()
}
</script>

<style scoped>
section {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Memastikan transisi smooth tapi responsif saat kursor bergerak */
img {
  will-change: transform;
}
</style>