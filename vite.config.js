import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { sitemapPlugin } from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    vueDevTools(),

    // 🔥 SITEMAP
    sitemapPlugin({
      hostname: 'https://desa-sidomukti.com',
      routes: [
        '/',
        '/lokasi',
        '/profile',
        '/berita',
        '/berita/agenda',
        '/transparansi',
        '/potensi',
        '/galeri'
      ]
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
