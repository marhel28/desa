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
                <img v-if="desaInfo?.logo_desa_path"
                     :src="desaInfo.logo_desa_path"
                     class="h-6 w-6 md:h-8 md:w-8 object-contain"/>
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
              <router-link
                v-for="item in menuItems"
                :key="item.name"
                :to="item.href"
                class="nav-link"
                active-class="nav-active"
              >
                {{ item.name }}
              </router-link>
  
              <a
                :href="desaInfo?.link_transparansi || '#'"
                target="_blank"
                class="btn-transparansi"
              >
                Transparansi
              </a>
            </div>
  
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="lg:hidden p-2 rounded-lg bg-emerald-50 text-emerald-700 transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu v-if="!isMobileMenuOpen" class="w-6 h-6"/>
              <X v-else class="w-6 h-6"/>
            </button>
  
          </div>
        </div>
  
        <transition name="slide">
          <div v-if="isMobileMenuOpen" class="lg:hidden absolute top-full left-0 w-full bg-white border-t border-emerald-50 shadow-xl max-h-[calc(100vh-80px)] overflow-y-auto">
            <div class="p-4 space-y-1">
              <router-link
                v-for="item in menuItems"
                :key="item.name"
                :to="item.href"
                @click="isMobileMenuOpen = false"
                class="flex items-center w-full px-4 py-3.5 mobile-link"
                active-class="mobile-active"
              >
                {{ item.name }}
              </router-link>
  
              <div class="pt-2 px-4 pb-4">
                <a
                  :href="desaInfo?.link_transparansi || '#'"
                  target="_blank"
                  class="block w-full text-center py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200"
                >
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
  import {
    Home, Menu, X, Phone, Mail,
    Facebook as FacebookIcon,
    Instagram as InstagramIcon
  } from 'lucide-vue-next'
  import { fetchSupabase } from '@/service/api.js'
  
  const isMobileMenuOpen = ref(false)
  const desaInfo = ref(null)
  
  const menuItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil', href: '/profile' },
    { name: 'Berita', href: '/berita' },
    { name: 'Transparansi', href: '/transparansi' },
    { name: 'Potensi', href: '/potensi' },
    { name: 'Wilayah', href: '/lokasi' },
    { name: 'Galeri', href: '/galeri' },
  ]
  
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
  /* Peningkatan visual untuk responsivitas */
  @media (max-width: 640px) {
    .logo-box {
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(16,185,129,.3);
    }
  }
  
  .logo-box {
    background: #059669;
    transition: .3s;
    box-shadow: 0 6px 20px rgba(16,185,129,.4);
    border-radius: 0.75rem;
  }
  
  /* Rest of your existing CSS remains similar, simplified for clarity */
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
    position: relative;
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
    white-space: nowrap;
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
    padding-left: 1.5rem !important; /* Visual cue for active state */
  }
  
  .slide-enter-active, .slide-leave-active {
    transition: .35s cubic-bezier(.4, 0, .2, 1);
  }
  .slide-enter-from, .slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }
  </style>