import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // KEMBALIKAN KE SINI
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap'

const routes = [
  '/',
  '/lokasi',
  '/profile',
  '/berita',
  '/berita/agenda',
  '/transparansi',
  '/potensi',
  '/galeri'
]

export default defineConfig({
  // Konfigurasi SSG
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },

  plugins: [
    vue(),
    vueJsx(), // Pakai yang ini
    tailwindcss(),
    vueDevTools(),
    
    sitemap({
      hostname: 'https://desa-sidomukti.com',
      routes: routes
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})