<template>
  <div class="font-montserrat text-slate-800">
    <div class="bg-emerald-950 text-white/90 py-2 text-[10px] md:text-xs border-b border-white/10">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-3 md:gap-5">
          <div class="flex items-center gap-1.5">
            <Phone class="h-3 w-3 md:h-4 md:w-4 text-emerald-400"/>
            <span class="hidden xs:inline">{{ desaInfo?.nomor_desa || '+62 000-0000' }}</span>
            <span class="xs:hidden">Kontak</span>
          </div>
          <div class="flex items-center gap-1.5">
            <Mail class="h-3 w-3 md:h-4 md:w-4 text-emerald-400"/>
            <span class="hidden sm:inline">{{ desaInfo?.email_desa || 'kontak@desa.id' }}</span>
            <span class="sm:hidden text-[9px]">Email</span>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <a href="#" class="hover:text-emerald-400 transition"><FacebookIcon class="w-3.5 h-3.5 md:w-4 md:h-4"/></a>
          <a href="#" class="hover:text-emerald-400 transition"><InstagramIcon class="w-3.5 h-3.5 md:w-4 md:h-4"/></a>
        </div>
      </div>
    </div>

    <div class="bg-emerald-800 text-white py-1.5 border-b border-emerald-700 overflow-hidden">
      <div class="marquee-container">
        <div class="marquee-content text-[10px] md:text-xs font-semibold tracking-wide">
          <span v-for="i in 2" :key="i" :class="i === 2 ? 'ml-16' : ''">
            ● {{ desaInfo?.master_kata || 'Selamat Datang di Website Resmi Desa' }}
            ● Pelayanan Kantor 08.00 - 15.00 WIB
            ● Wujudkan Desa {{ desaInfo?.nama_desa }} Mandiri & Asri
          </span>
        </div>
      </div>
    </div>

    <nav class="sticky top-0 z-[60] bg-white/95 backdrop-blur-xl shadow-sm border-b border-emerald-100">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16 md:h-20">
          <router-link to="/" class="flex items-center gap-2 md:gap-4 group">
            <div class="logo-box p-1.5 md:p-2.5">
              <img v-if="desaInfo?.logo_desa_path" :src="desaInfo.logo_desa_path" class="h-6 w-6 md:h-8 md:w-8 object-contain"/>
              <Home v-else class="h-6 w-6 md:h-8 md:w-8 text-white"/>
            </div>
            <div class="flex flex-col">
              <div class="text-sm md:text-xl font-extrabold uppercase tracking-wide text-emerald-800 leading-none mb-1">
                {{ desaInfo?.nama_desa || 'DESA' }}
              </div>
              <div class="text-[8px] md:text-[10px] font-bold tracking-widest text-emerald-500 leading-none">
                KABUPATEN PURWOREJO
              </div>
            </div>
          </router-link>

          <div class="hidden lg:flex items-center gap-1">
            <template v-for="item in menuItems" :key="item.name">
              <div v-if="item.name === 'Berita desa'" class="relative group">
                <button class="nav-link flex items-center gap-1 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                  {{ item.name }}
                  <ChevronDown class="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div class="absolute top-full left-0 w-48 bg-white border border-emerald-50 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                  <button v-for="cat in categories" :key="cat" @click="go('berita', cat === 'semua' ? null : cat)"
                    class="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors capitalize">
                    {{ cat }}
                  </button>
                </div>
              </div>
              <router-link v-else :to="item.href" class="nav-link" active-class="nav-active">
                {{ item.name }}
              </router-link>
            </template>
            <a :href="desaInfo?.link_transparansi || '#'" target="_blank" class="btn-transparansi">Transparansi</a>
          </div>

          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6"/>
            <X v-else class="w-6 h-6"/>
          </button>
        </div>
      </div>

      <transition name="slide">
        <div v-if="isMobileMenuOpen" class="lg:hidden absolute top-full left-0 w-full bg-white border-t border-emerald-50 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto">
          <div class="p-4 space-y-1">
            <template v-for="item in menuItems" :key="item.name">
              <div v-if="item.name === 'Berita desa'" class="space-y-1">
                <button @click="isBeritaOpen = !isBeritaOpen" 
                  class="flex items-center justify-between w-full px-4 py-3.5 mobile-link"
                  :class="{'text-emerald-700 bg-emerald-50': isBeritaOpen}">
                  <span class="flex items-center gap-2">Berita Desa</span>
                  <ChevronDown class="w-4 h-4 transition-transform duration-300" :class="{'rotate-180': isBeritaOpen}" />
                </button>
                
                <transition name="expand">
                  <div v-if="isBeritaOpen" class="overflow-hidden bg-slate-50/50 rounded-xl ml-4 border-l-2 border-emerald-100">
                    <button v-for="cat in categories" :key="cat" 
  @click="go('Berita Desa', cat)" 
  class="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors capitalize">
  {{ cat }}
</button>
                  </div>
                </transition>
              </div>

              <router-link v-else :to="item.href" @click="isMobileMenuOpen = false" class="flex items-center w-full px-4 py-3.5 mobile-link" active-class="mobile-active">
                {{ item.name }}
              </router-link>
            </template>

            <div class="pt-4 px-4 pb-2">
              <a :href="desaInfo?.link_transparansi || '#'" target="_blank" class="block w-full text-center py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg">
                Transparansi Dana
              </a>
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <main class="min-h-screen">
      <router-view/>
    </main>

    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'

import {
  Home, Menu, X, Phone, Mail, ChevronDown,
  MapPin, Megaphone,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon
} from 'lucide-vue-next'
import { fetchSupabase } from '@/service/api.js'

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isBeritaOpen = ref(false) 
const desaInfo = ref(null)

const categories = ['Semua', 'Pengumuman', 'Pembangunan', 'Kegiatan', 'Layanan'];

const menuItems = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil', href: '/profile' },
  { name: 'Berita desa', href: '/berita' }, // Nama sudah diperbarui
  { name: 'Transparansi', href: '/transparansi' },
  { name: 'Potensi', href: '/potensi' },
  { name: 'Wilayah', href: '/lokasi' },
  { name: 'Galeri', href: '/galeri' },
]

const go = (page, category = null) => {
  // Kita paksa agar page yang masuk adalah 'Berita Desa' jika tujuannya berita
  const routeName = page === 'berita' ? 'Berita Desa' : page;
  
  if (category && category !== 'Semua') {
    router.push({ name: routeName, query: { filter: category.toLowerCase() } });
  } else {
    router.push({ name: routeName });
  }
};

const loadDesaInfo = async () => {
  try {
    const { data } = await fetchSupabase('desa', 'select=*&limit=1')
    if (data?.length) desaInfo.value = data[0]
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

onMounted(loadDesaInfo)
</script>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 300px;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.logo-box {
  background: #059669;
  transition: .3s;
  box-shadow: 0 6px 20px rgba(16,185,129,.4);
  border-radius: 0.75rem;
}

.marquee-container {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.marquee-content {
  display: inline-flex;
  gap: 4rem;
  animation: marquee 26s linear infinite;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.nav-link {
  padding: .55rem 1rem;
  font-size: .875rem;
  font-weight: 600;
  color: #475569;
  border-radius: .65rem;
  transition: .25s;
}

.nav-link:hover, .nav-active {
  background: #ecfdf5;
  color: #047857;
}

.btn-transparansi {
  margin-left: 1rem;
  padding: .65rem 1.25rem;
  background: #059669;
  color: white;
  font-size: .85rem;
  font-weight: 700;
  border-radius: 999px;
  box-shadow: 0 6px 20px rgba(16,185,129,.4);
}

.mobile-link {
  border-radius: .7rem;
  font-weight: 600;
  color: #334155;
  transition: .2s;
}

.mobile-active {
  background: #ecfdf5;
  color: #047857;
  padding-left: 1.5rem !important; 
}

.slide-enter-active, .slide-leave-active {
  transition: .35s cubic-bezier(.4, 0, .2, 1);
}
.slide-enter-from, .slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>