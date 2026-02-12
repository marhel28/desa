import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import sitemap from 'vite-plugin-sitemap'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    vueDevTools(),

    // 🔥 PRERENDER ROUTES
    vitePrerenderPlugin({
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
    }),

    // 🔥 SITEMAP
    sitemap({
      hostname: 'https://desa-sidomukti.com',
      dynamicRoutes: [
        '/',
        '/lokasi',
        '/profile',
        '/berita',
        '/berita/agenda',
        '/transparansi',
        '/potensi',
        '/galeri'
      ],
      readable: true
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  build: {
    sourcemap: false,
    minify: 'esbuild'
  }
})
