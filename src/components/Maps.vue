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
            <div class="absolute top-4 left-4 z-10 hidden md:block">
              <div class="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-emerald-100 max-w-xs">
                <h4 class="font-bold text-emerald-800 flex items-center gap-2 mb-1">
                  <MapPin class="w-4 h-4" />
                  Desa Sidomukti
                </h4>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Terletak di Kecamatan Bener, Purworejo. Memiliki potensi alam yang melimpah dan fasilitas publik yang terintegrasi.
                </p>
              </div>
            </div>
  
            <div class="cursor-zoom-in overflow-hidden">
              <img 
                :src="maps" 
                alt="Peta Administrasi Desa Sidomukti" 
                class="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
              />
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
  import { MapPin, Download } from 'lucide-vue-next'
  import maps from '@/assets/mapssidomukti.webp'
  
  const downloadMap = () => {
    // Logika download file jika diperlukan
    const link = document.createElement('a')
    link.href = maps
    link.download = 'Peta_Administrasi_Sidomukti.webp'
    link.click()
  }
  </script>
  
  <style scoped>
  /* Tambahan jika ingin ada efek halus saat dimuat */
  section {
    animation: fadeIn 1s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>