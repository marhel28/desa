<template>
    <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-montserrat overflow-hidden">
        <div class="absolute top-8 flex flex-col items-center animate-fade-in">
            <img v-if="desaInfo?.logo_desa_path" :src="desaInfo.logo_desa_path"
                class="h-16 md:h-20 w-auto mb-2 drop-shadow-md" />
            <h2 class="text-emerald-900 font-bold tracking-widest text-xs md:text-sm uppercase">
                {{ desaInfo?.nama_desa || 'DESA SIDOMUKTI' }}
            </h2>
        </div>

        <div class="text-center z-10">
            <div class="relative flex justify-center items-center mb-8">
                <div ref="loader"
                    class="absolute w-64 h-64 md:w-80 md:h-80 border-4 border-dashed border-emerald-200 rounded-full">
                </div>
                <div ref="loaderInner"
                    class="absolute w-48 h-48 md:w-60 md:h-60 border-4 border-emerald-500/20 rounded-full border-t-emerald-600">
                </div>

                <img :src="logo" alt="404 Not Found" ref="errorImg"
                    class="w-56 md:w-72 relative z-10 drop-shadow-2xl" />
            </div>

            <div ref="textSection">
                <h1 class="text-4xl md:text-6xl font-black text-emerald-950 mb-2">Waduh!</h1>
                <p class="text-slate-600 text-sm md:text-base max-w-md mx-auto mb-8 px-4">
                    Halaman yang Anda cari tidak ada atau telah dipindahkan. Yuk, kembali ke jalan yang benar.
                </p>

                <router-link to="/"
                    class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
                    </svg>
                    Kembali ke Beranda
                </router-link>
            </div>
        </div>

        <div class="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import logo from "@/assets/404-error.svg"
import { fetchSupabase } from '@/service/api.js'
import gsap from 'gsap'

const desaInfo = ref(null)
const loader = ref(null)
const loaderInner = ref(null)
const errorImg = ref(null)
const textSection = ref(null)

const loadDesaInfo = async () => {
    try {
        const { data } = await fetchSupabase('desa', 'select=nama_desa,logo_desa_path&limit=1')
        if (data?.length) {
            desaInfo.value = data[0]
        }
    } catch (error) {
        console.error("Error loading branding:", error)
    }
}

onMounted(() => {
    loadDesaInfo()

    // 1. Animasi Muter-Muter (Infinite)
    gsap.to(loader.value, {
        rotation: 360,
        duration: 10,
        repeat: -1,
        ease: "none"
    })

    gsap.to(loaderInner.value, {
        rotation: -360,
        duration: 4,
        repeat: -1,
        ease: "power1.inOut"
    })

    // 2. Animasi Floating SVG (Naik Turun Halus)
    gsap.to(errorImg.value, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    })

    // 3. Animasi Muncul (Entrance)
    gsap.from(textSection.value, {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "power3.out"
    })
})
</script>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 1s ease-out forwards;
}
</style>