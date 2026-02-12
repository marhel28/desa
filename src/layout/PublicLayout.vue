<template>
  <div class="font-montserrat text-slate-800">
    <header class="bg-emerald-950 text-white/90 py-2 text-[10px] md:text-xs border-b border-white/10">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center gap-3 md:gap-5">
          <a 
            :href="desaInfo?.nomor_desa ? `https://wa.me/${desaInfo.nomor_desa.replace(/\D/g,'')}` : '#'" 
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 hover:text-emerald-400 transition"
            :aria-label="`Hubungi WhatsApp Desa ${desaInfo?.nama_desa}`"
          >
            <svg class="h-3 w-3 md:h-4 md:w-4 fill-emerald-400" viewBox="0 0 24 24">
              <path :d="mdiWhatsapp" />
            </svg>
            <span class="hidden xs:inline">{{ desaInfo?.nomor_desa || '+62 000-0000' }}</span>
            <span class="xs:hidden">Kontak</span>
          </a>
          <a 
            :href="desaInfo?.email_desa ? `mailto:${desaInfo.email_desa}` : '#'"
            class="flex items-center gap-1.5 hover:text-emerald-400 transition"
            :aria-label="`Email Resmi Desa ${desaInfo?.nama_desa}`"
          >
            <svg class="h-3 w-3 md:h-4 md:w-4 fill-emerald-400" viewBox="0 0 24 24">
              <path :d="mdiEmail" />
            </svg>
            <span class="hidden sm:inline">{{ desaInfo?.email_desa || 'kontak@desa.id' }}</span>
            <span class="sm:hidden text-[9px]">Email</span>
          </a>
        </div>
        
        <div class="flex items-center gap-4">
          <a v-if="desaInfo?.facebook_url" :href="desaInfo.facebook_url" target="_blank" rel="noopener" class="hover:text-emerald-400 transition" aria-label="Facebook">
            <svg class="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24"><path :d="mdiFacebook" /></svg>
          </a>
          <a v-if="desaInfo?.instagram_url" :href="desaInfo.instagram_url" target="_blank" rel="noopener" class="hover:text-emerald-400 transition" aria-label="Instagram">
            <svg class="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24"><path :d="mdiInstagram" /></svg>
          </a>
          <a v-if="desaInfo?.youtube_url" :href="desaInfo.youtube_url" target="_blank" rel="noopener" class="hover:text-emerald-400 transition" aria-label="Youtube">
            <svg class="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 24 24"><path :d="mdiYoutube" /></svg>
          </a>
        </div>
      </div>
    </header>

    <section class="bg-emerald-800 text-white py-1.5 border-b border-emerald-700 overflow-hidden" aria-label="Informasi Berjalan">
      <div class="marquee-container">
        <div class="marquee-content text-[10px] md:text-xs font-semibold tracking-wide">
          <span v-for="i in 2" :key="i" :class="i === 2 ? 'ml-16' : ''">
            ● {{ desaInfo?.master_kata || 'Selamat Datang di Website Resmi Desa' }}
            ● Pelayanan Kantor 08.00 - 15.00 WIB
            ● Wujudkan Desa {{ desaInfo?.nama_desa || 'Sidomukti' }} Mandiri & Asri
          </span>
        </div>
      </div>
    </section>

    <nav class="sticky top-0 z-[60] bg-white/95 backdrop-blur-xl shadow-sm border-b border-emerald-100">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16 md:h-20">
          
          <router-link to="/" class="flex items-center gap-3 md:gap-4 group" title="Kembali ke Beranda">
            <div class="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 transition-transform duration-500 group-hover:scale-110">
              <img 
                v-if="desaInfo?.logo_desa_path" 
                :src="desaInfo.logo_desa_path" 
                :alt="`Logo Desa ${desaInfo?.nama_desa}`"
                class="h-full w-full object-contain drop-shadow-md"
              />
              <svg v-else class="h-8 w-8 md:h-10 md:w-10 fill-emerald-600" viewBox="0 0 24 24">
                <path :d="mdiHome" />
              </svg>
            </div>
            
            <div class="flex flex-col border-l-2 border-emerald-100 pl-3 md:pl-4">
              <div class="flex items-center">
                <h1 ref="brandName" class="text-sm md:text-xl font-extrabold uppercase tracking-tight text-emerald-900 leading-none min-h-[1em]">
                  {{ desaInfo?.nama_desa || 'DESA SIDOMUKTI' }}
                </h1>
                <span class="cursor-blinker bg-emerald-500 w-[2px] h-4 md:h-5 ml-1"></span>
              </div>
              <p ref="brandSub" class="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-emerald-600 leading-none uppercase mt-1 opacity-0">
                KABUPATEN PURWOREJO
              </p>
            </div>
          </router-link>

          <div class="hidden lg:flex items-center gap-1">
            <template v-for="item in menuItems" :key="item.name">
              <div v-if="item.name === 'Berita desa'" class="relative group">
                <button class="nav-link flex items-center gap-1 group-hover:bg-emerald-50 group-hover:text-emerald-700" aria-haspopup="true">
                  {{ item.name }}
                  <svg class="w-4 h-4 transition-transform group-hover:rotate-180 fill-current" viewBox="0 0 24 24">
                    <path :d="mdiChevronDown" />
                  </svg>
                </button>
                <div class="absolute top-full left-0 w-48 bg-white border border-emerald-50 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top scale-95 group-hover:scale-100">
                  <button v-for="cat in categories" :key="cat" @click="go('berita', cat === 'Semua' ? null : cat)"
                    class="w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors capitalize">
                    {{ cat }}
                  </button>
                </div>
              </div>
              <router-link v-else :to="item.href" class="nav-link" active-class="nav-active">
                {{ item.name }}
              </router-link>
            </template>
            <button @click="$router.push('/dashboard')" class="btn-transparansi">Login</button>
          </div>

          <button @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="lg:hidden p-2 rounded-lg bg-emerald-50 text-emerald-700"
            :aria-label="isMobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'">
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path :d="mdiMenu" /></svg>
            <svg v-else class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path :d="mdiClose" /></svg>
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
                  <span>Berita Desa</span>
                  <svg class="w-4 h-4 transition-transform duration-300 fill-current" :class="{'rotate-180': isBeritaOpen}" viewBox="0 0 24 24">
                    <path :d="mdiChevronDown" />
                  </svg>
                </button>
                <transition name="expand">
                  <div v-if="isBeritaOpen" class="overflow-hidden bg-slate-50/50 rounded-xl ml-4 border-l-2 border-emerald-100">
                    <button v-for="cat in categories" :key="cat" @click="go('berita', cat)" 
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
              <a href="/dashboard" class="block w-full text-center py-3.5 rounded-xl bg-emerald-600 text-white font-bold shadow-lg">Login</a>
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <main class="min-h-screen">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer/>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue' // WAJIB: npm install @unhead/vue
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { 
  mdiWhatsapp, mdiEmail, mdiFacebook, mdiInstagram, 
  mdiYoutube, mdiHome, mdiMenu, mdiClose, mdiChevronDown 
} from '@mdi/js'
import { fetchSupabase } from '@/service/api.js'

gsap.registerPlugin(TextPlugin)

const router = useRouter()
const isMobileMenuOpen = ref(false)
const isBeritaOpen = ref(false) 
const desaInfo = ref(null)

const brandName = ref(null)
const brandSub = ref(null)

const categories = ['Semua', 'Pengumuman', 'Pembangunan', 'Kegiatan', 'Layanan'];
const menuItems = [
  { name: 'Beranda', href: '/' },
  { name: 'Profil', href: '/profile' },
  { name: 'Berita desa', href: '/berita' },
  { name: 'Transparansi', href: '/transparansi' },
  { name: 'Potensi', href: '/potensi' },
  { name: 'Wilayah', href: '/lokasi' },
  { name: 'Galeri', href: '/galeri' },
]

// SEO Dynamic Meta Tags
useHead({
  title: 'Website Resmi Desa',
  meta: [
    { name: 'description', content: 'Situs web resmi pelayanan dan transparansi informasi desa.' },
    { name: 'robots', content: 'index, follow' }
  ]
})

// Update SEO saat data desa masuk
watch(desaInfo, (newVal) => {
  if (newVal) {
    useHead({
      title: `Website Resmi Desa ${newVal.nama_desa}`,
      meta: [
        { name: 'description', content: `Selamat datang di portal informasi resmi Desa ${newVal.nama_desa}, Kabupaten Purworejo. Akses berita, transparansi, dan layanan masyarakat.` }
      ]
    })
  }
})

const go = (page, category = null) => {
  const routeName = page === 'berita' ? 'Berita desa' : page;
  const targetQuery = {};
  if (category && category !== 'Semua') targetQuery.filter = category.toLowerCase();

  router.push({ name: routeName, query: targetQuery });
  isMobileMenuOpen.value = false;
};

const initAnimations = () => {
  const targetName = desaInfo.value?.nama_desa || 'DESA SIDOMUKTI';
  
  // Animasi Typing (SEO Aman karena teks asli sudah ada di DOM)
  gsap.to(brandName.value, {
    duration: 2.5,
    text: targetName,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
    repeatDelay: 4,
  });

  gsap.to(brandSub.value, {
    opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power2.out"
  });

  gsap.to(".cursor-blinker", {
    opacity: 0, repeat: -1, duration: 0.6, ease: "power2.inOut"
  });
}

const loadDesaInfo = async () => {
  try {
    const { data } = await fetchSupabase('desa', 'select=*&limit=1')
    if (data?.length) {
      desaInfo.value = data[0]
      setTimeout(() => initAnimations(), 300)
    }
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}

onMounted(() => {
  loadDesaInfo()
})
</script>

<style scoped>
/* Page Transition */
.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.3s ease; }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; }

/* Existing Styles */
.expand-enter-active, .expand-leave-active { transition: all 0.3s ease-in-out; max-height: 300px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }

.marquee-container { overflow: hidden; white-space: nowrap; }
.marquee-content { display: inline-flex; gap: 4rem; animation: marquee 26s linear infinite; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

.nav-link { padding: .55rem 1rem; font-size: .875rem; font-weight: 600; color: #475569; border-radius: .65rem; transition: .25s; }
.nav-link:hover, .nav-active { background: #ecfdf5; color: #047857; }

.btn-transparansi { margin-left: 1rem; padding: .65rem 1.25rem; background: #059669; color: white; font-size: .85rem; font-weight: 700; border-radius: 999px; box-shadow: 0 6px 20px rgba(16,185,129,.4); display: inline-block; transition: .3s; }
.btn-transparansi:hover { background: #047857; transform: translateY(-2px); }

.mobile-link { border-radius: .7rem; font-weight: 600; color: #334155; transition: .2s; }
.mobile-active { background: #ecfdf5; color: #047857; padding-left: 1.5rem !important; }

.slide-enter-active, .slide-leave-active { transition: .35s cubic-bezier(.4, 0, .2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateY(-10px); opacity: 0; }
</style>