<template>
    <div class="font-montserrat text-slate-800">
  
      <!-- ================= TOPBAR ================= -->
      <div class="bg-emerald-950 text-white/90 py-2 text-xs border-b border-white/10">
        <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
  
          <div class="flex items-center gap-5">
            <div class="flex items-center gap-2">
              <Phone class="h-4 w-4 text-emerald-400"/>
              <span>{{ desaInfo?.nomor_desa || '+62 000-0000-0000' }}</span>
            </div>
  
            <div class="flex items-center gap-2">
              <Mail class="h-4 w-4 text-emerald-400"/>
              <span>{{ desaInfo?.email_desa || 'kontak@desa.id' }}</span>
            </div>
          </div>
  
          <div class="flex items-center gap-4">
            <a class="hover:text-emerald-400 transition"><FacebookIcon class="w-4 h-4"/></a>
            <a class="hover:text-emerald-400 transition"><InstagramIcon class="w-4 h-4"/></a>
          </div>
  
        </div>
      </div>
  
      <!-- ================= MARQUEE ================= -->
      <div class="bg-emerald-800 text-white py-1.5 border-b border-emerald-700">
        <div class="marquee-container">
          <div class="marquee-content text-xs font-semibold tracking-wide">
  
            <span>
              ● {{ desaInfo?.master_kata || 'Selamat Datang di Website Resmi Desa' }}
              ● Pelayanan Kantor 08.00 - 15.00 WIB
              ● Wujudkan Desa {{ desaInfo?.nama_desa }} Mandiri & Asri
            </span>
  
            <span class="ml-16">
              ● {{ desaInfo?.master_kata || 'Selamat Datang di Website Resmi Desa' }}
              ● Pelayanan Kantor 08.00 - 15.00 WIB
              ● Wujudkan Desa {{ desaInfo?.nama_desa }} Mandiri & Asri
            </span>
  
          </div>
        </div>
      </div>
  
      <!-- ================= NAVBAR ================= -->
      <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-md border-b border-emerald-100">
  
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-20">
  
            <!-- LOGO -->
            <router-link to="/" class="flex items-center gap-4 group">
              <div class="logo-box">
                <img v-if="desaInfo?.logo_desa_path"
                     :src="desaInfo.logo_desa_path"
                     class="h-8 w-8 object-contain"/>
                <Home v-else class="h-8 w-8 text-white"/>
              </div>
  
              <div>
                <div class="text-xl font-extrabold uppercase tracking-wide text-emerald-800">
                  {{ desaInfo?.nama_desa || 'DESA' }}
                </div>
                <div class="text-[10px] font-bold tracking-[0.25em] text-emerald-500">
                  KABUPATEN PURWOREJO
                </div>
              </div>
            </router-link>
  
            <!-- MENU DESKTOP -->
            <div class="hidden md:flex items-center gap-1">
  
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
                Transparansi Dana
              </a>
  
            </div>
  
            <!-- MOBILE BUTTON -->
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden p-2 rounded-lg hover:bg-emerald-50"
            >
              <Menu v-if="!isMobileMenuOpen"/>
              <X v-else/>
            </button>
  
          </div>
        </div>
  
        <!-- MOBILE MENU -->
        <transition name="slide">
          <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t shadow">
            <div class="p-4 space-y-2">
  
              <router-link
                v-for="item in menuItems"
                :key="item.name"
                :to="item.href"
                @click="isMobileMenuOpen=false"
                class="mobile-link"
                active-class="mobile-active"
              >
                {{ item.name }}
              </router-link>
  
              <a
                :href="desaInfo?.link_transparansi || '#'"
                target="_blank"
                class="block text-center py-3 rounded-lg bg-emerald-600 text-white font-bold"
              >
                Transparansi Dana
              </a>
  
            </div>
          </div>
        </transition>
  
      </nav>
  
      <!-- ================= CONTENT ================= -->
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
    { name: 'Profil Desa', href: '/profile' },
    { name: 'Berita', href: '/berita' },
    { name: 'Transparansi', href: '/transparansi' },
    { name: 'Potensi', href: '/potensi' },
    { name: 'Lokasi & Wilayah', href: '/lokasi' },
    { name: 'Galeri', href: '/galeri' },
  ]
  
  const loadDesaInfo = async () => {
    const { data } = await fetchSupabase('desa', 'select=*&limit=1')
    if (data?.length) desaInfo.value = data[0]
  }
  
  onMounted(loadDesaInfo)
  </script>
  
  <style scoped>
  
  /* ===== LOGO BOX ===== */
  .logo-box{
    background:#059669;
    padding:0.65rem;
    border-radius:0.75rem;
    box-shadow:0 6px 20px rgba(16,185,129,.4);
    transition:.3s;
  }
  .logo-box:hover{
    background:#047857;
    box-shadow:0 10px 30px rgba(16,185,129,.6);
  }
  
  /* ===== MARQUEE ===== */
  .marquee-container{
    overflow:hidden;
    white-space:nowrap;
    position:relative;
  }
  .marquee-container::before,
  .marquee-container::after{
    content:"";
    position:absolute;
    top:0;
    width:70px;
    height:100%;
    z-index:2;
  }
  .marquee-container::before{
    left:0;
    background:linear-gradient(to right,#065f46,transparent);
  }
  .marquee-container::after{
    right:0;
    background:linear-gradient(to left,#065f46,transparent);
  }
  .marquee-content{
    display:inline-flex;
    gap:4rem;
    animation:marquee 26s linear infinite;
  }
  @keyframes marquee{
    from{transform:translateX(0);}
    to{transform:translateX(-50%);}
  }
  .marquee-content:hover{
    animation-play-state:paused;
  }
  
  /* ===== NAV LINK ===== */
  .nav-link{
    position:relative;
    padding:.55rem 1.1rem;
    font-size:.875rem;
    font-weight:600;
    color:#475569;
    border-radius:.65rem;
    transition:.25s;
  }
  .nav-link:hover{
    background:#ecfdf5;
    color:#047857;
  }
  .nav-link::after{
    content:"";
    position:absolute;
    left:50%;
    bottom:4px;
    width:0;
    height:2px;
    background:#10b981;
    transform:translateX(-50%);
    transition:.25s;
    border-radius:999px;
  }
  .nav-link:hover::after{
    width:60%;
  }
  .nav-active{
    background:#ecfdf5;
    color:#047857;
    font-weight:700;
  }
  .nav-active::after{
    width:60%;
  }
  
  /* ===== BUTTON ===== */
  .btn-transparansi{
    margin-left:1rem;
    padding:.65rem 1.5rem;
    background:#059669;
    color:white;
    font-size:.85rem;
    font-weight:700;
    border-radius:999px;
    box-shadow:0 6px 20px rgba(16,185,129,.4);
    transition:.25s;
  }
  .btn-transparansi:hover{
    background:#047857;
    box-shadow:0 10px 30px rgba(16,185,129,.6);
  }
  
  /* ===== MOBILE ===== */
  .mobile-link{
    padding:.8rem 1rem;
    border-radius:.7rem;
    font-weight:600;
    color:#334155;
    transition:.2s;
  }
  .mobile-link:hover{
    background:#ecfdf5;
    color:#047857;
    transform:translateX(6px);
  }
  .mobile-active{
    background:#ecfdf5;
    color:#047857;
    font-weight:700;
  }
  
  /* ===== SLIDE ===== */
  .slide-enter-active,
  .slide-leave-active{
    transition:.35s cubic-bezier(.4,0,.2,1);
  }
  .slide-enter-from,
  .slide-leave-to{
    transform:translateY(-12px);
    opacity:0;
  }
  
  </style>
  