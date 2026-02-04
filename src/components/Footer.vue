<template>
  <footer class="bg-slate-900 text-slate-300 border-t-4 border-emerald-500 font-montserrat">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div class="space-y-4">
          <h3 class="text-white text-lg font-bold flex items-center gap-2">
            <div v-if="desaInfo?.logo_desa_path" class="w-10 h-10 bg-white p-1 rounded">
              <img :src="desaInfo.logo_desa_path" :alt="desaInfo.nama_desa" class="w-full h-full object-contain" />
            </div>
            <span v-else class="bg-emerald-600 text-white p-1 rounded text-sm">DS</span>
            {{ desaInfo?.nama_desa || 'Desa Sidomukti' }}
          </h3>
          <p class="text-sm leading-relaxed text-slate-400">
            Website resmi Pemerintah {{ desaInfo?.nama_desa || 'Desa Sidomukti' }}, Kecamatan Purworejo. 
            Sumber informasi terpercaya untuk kemajuan bersama.
          </p>
          <div class="flex gap-4 pt-2">
             <a v-if="desaInfo?.facebook_url" :href="desaInfo.facebook_url" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white shadow-sm">
                <Facebook class="w-4 h-4" />
             </a>
             <a v-if="desaInfo?.instagram_url" :href="desaInfo.instagram_url" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white shadow-sm">
                <Instagram class="w-4 h-4" />
             </a>
             <a v-if="desaInfo?.youtube_url" :href="desaInfo.youtube_url" target="_blank" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white shadow-sm">
                <Youtube class="w-4 h-4" />
             </a>
          </div>
        </div>

        <div>
          <h4 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Jelajahi</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/profile" class="hover:text-emerald-400 transition-colors">Profil Desa</router-link></li>
            <li><router-link to="/berita" class="hover:text-emerald-400 transition-colors">Berita Desa</router-link></li>
            <li><router-link to="/potensi" class="hover:text-emerald-400 transition-colors">Potensi Desa</router-link></li>
            <li><router-link to="/lokasi" class="hover:text-emerald-400 transition-colors">Peta Wilayah</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Layanan</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-emerald-400 transition-colors">Surat Keterangan</a></li>
            <li><a href="#" class="hover:text-emerald-400 transition-colors">Pengaduan Masyarakat</a></li>
            <li><a :href="desaInfo?.link_transparansi || '#'" target="_blank" class="hover:text-emerald-400 transition-colors">Transparansi Dana</a></li>
            <li><router-link to="/galeri" class="hover:text-emerald-400 transition-colors">Galeri Foto</router-link></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Kontak Kami</h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-3">
              <MapPin class="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Jl. Raya Sidomukti No. 45, Purworejo, Jawa Tengah 54111</span>
            </li>
            <li v-if="desaInfo?.nomor_desa" class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{{ desaInfo.nomor_desa }}</span>
            </li>
            <li v-if="desaInfo?.email_desa" class="flex items-center gap-3">
              <Mail class="w-5 h-5 text-emerald-500 shrink-0" />
              <span class="break-all">{{ desaInfo.email_desa }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
    
    <div class="bg-slate-950 py-6 text-center text-xs text-slate-500 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>2026 KPM 52 UNSIQ | Pemerindah Desa Sidomukti Hak Cipta Dilindungi.</p>
        <div class="flex gap-6">
           <a href="#" class="hover:text-emerald-400 transition-colors">Kebijakan Privasi</a>
           <a href="#" class="hover:text-emerald-400 transition-colors">Syarat & Ketentuan</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-vue-next'
import { fetchSupabase } from '@/service/api.js'

const desaInfo = ref(null)

const loadDesaInfo = async () => {
  try {
    const { data } = await fetchSupabase('desa', 'select=*&limit=1')
    if (data?.length) {
      desaInfo.value = data[0]
    }
  } catch (error) {
    console.error("Error fetching footer data:", error)
  }
}

onMounted(() => {
  loadDesaInfo()
})
</script>

<style scoped>
/* Tambahkan font styling jika diperlukan */
.font-montserrat {
  font-family: 'Montserrat', sans-serif;
}
</style>