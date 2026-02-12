<template>
  <Transition @leave="onLeave">
    <div v-if="isLoading" class="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center font-montserrat">
      <div class="relative flex flex-col items-center">
        <div ref="orbit" class="absolute w-32 h-32 md:w-40 md:h-40 border-2 border-emerald-100 border-t-emerald-600 rounded-full"></div>
        
        <div ref="logoRef" class="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white rounded-full p-2">
          <img 
            v-if="desaInfo?.logo_desa_path" 
            :src="desaInfo.logo_desa_path" 
            :alt="`Logo Resmi Desa ${desaInfo?.nama_desa || ''}`"
            class="w-full h-full object-contain drop-shadow-md"
          />
          <div v-else class="w-12 h-12 bg-emerald-100 rounded-full animate-pulse"></div>
        </div>

        <div class="mt-6 overflow-hidden">
          <h1 ref="nameRef" class="text-emerald-900 font-black text-xl md:text-2xl uppercase tracking-[0.2em] opacity-0 translate-y-full">
            {{ desaInfo?.nama_desa || 'Portal Resmi Desa' }}
          </h1>
        </div>
        
        <div class="mt-4 w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div ref="progressRef" class="h-full bg-emerald-500 w-0"></div>
        </div>
      </div>
    </div>
  </Transition>

  <main v-show="!isLoading" class="animate-content">
    <router-view></router-view>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { fetchSupabase } from '@/service/api.js'
import { useHead } from '@unhead/vue' // Helper untuk SEO
import gsap from 'gsap'

const isLoading = ref(true)
const desaInfo = ref(null)

// Refs untuk animasi
const orbit = ref(null)
const logoRef = ref(null)
const nameRef = ref(null)
const progressRef = ref(null)

/**
 * SEO Management
 * Mengupdate Title dan Meta Description secara dinamis
 */
useHead({
  title: 'Memuat Halaman...',
  meta: [
    { name: 'description', content: 'Selamat datang di Website Resmi Desa.' },
    { property: 'og:type', content: 'website' }
  ]
})

// Update SEO saat data desa berhasil dimuat
watch(desaInfo, (newVal) => {
  if (newVal) {
    useHead({
      title: `Desa ${newVal.nama_desa} - Website Resmi`,
      meta: [
        { 
          name: 'description', 
          content: `Portal informasi resmi Desa ${newVal.nama_desa}. Layanan publik, berita desa, dan transparansi data.` 
        },
        { property: 'og:title', content: `Desa ${newVal.nama_desa}` },
        { property: 'og:image', content: newVal.logo_desa_path }
      ]
    })
  }
})

const loadInitialData = async () => {
  const startTime = Date.now()
  
  try {
    // Ambil data desa
    const { data } = await fetchSupabase('desa', 'select=nama_desa,logo_desa_path&limit=1')
    if (data?.length) {
      desaInfo.value = data[0]
    }
  } catch (error) {
    console.error("Loader Error:", error)
  } finally {
    // SEO FIX: Kurangi waktu tunggu agar LCP (Largest Contentful Paint) lebih cepat
    const elapsedTime = Date.now() - startTime
    const remainingTime = Math.max(1200 - elapsedTime, 0) // Dikurangi dari 2 detik ke 1.2 detik

    setTimeout(() => {
      const tl = gsap.timeline({ 
        onComplete: () => {
          isLoading.value = false
        } 
      })

      tl.to(progressRef.value, { width: '100%', duration: 0.4 })
        .to(logoRef.value, { scale: 0, opacity: 0, duration: 0.3, ease: "back.in" })
        .to(nameRef.value, { y: -20, opacity: 0, duration: 0.2 }, "-=0.1")
    }, remainingTime)
  }
}

onMounted(() => {
  loadInitialData()

  // Animasi Orbit
  gsap.to(orbit.value, {
    rotation: 360,
    duration: 1.5,
    repeat: -1,
    ease: "none"
  })

  // Animasi Nama Muncul
  setTimeout(() => {
    if (nameRef.value) {
      gsap.to(nameRef.value, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power4.out"
      })
    }
    
    if (progressRef.value) {
      gsap.to(progressRef.value, {
        width: '70%',
        duration: 1.5,
        ease: "power1.inOut"
      })
    }
  }, 300)
})

const onLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    duration: 0.4,
    onComplete: done
  })
}
</script>

<style scoped>
.animate-content {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>