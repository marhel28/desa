import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap'

// Pindahkan daftar rute ke variabel agar bisa dipakai di sitemap dan ssgOptions
const publicRoutes = [
  '/',
  '/lokasi',
  '/profile',
  '/berita',
  '/berita/agenda',
  '/transparansi',
  '/potensi',
  '/galeri',
  '/login' // Tambahkan login agar di-render statis (cepat dimuat)
]

export default defineConfig({
  // Konfigurasi SSG
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    // KUNCI PERBAIKAN: Hanya render halaman publik saja
    includedRoutes(paths, routes) {
      return publicRoutes
    },
    // Jika ada error saat pre-rendering rute tertentu (misal halaman admin yang butuh window)
    onPageRenderError: (route, err) => {
      console.warn(`Error rendering ${route}: ${err.message}`)
    }
  },

  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    vueDevTools(),
    
    sitemap({
      hostname: 'https://desa-sidomukti.com',
      // Gunakan publicRoutes agar dashboard admin tidak masuk ke Google Search
      routes: publicRoutes 
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})