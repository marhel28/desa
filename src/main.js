import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import VCalendar from 'v-calendar'

// CSS Imports
import 'v-calendar/style.css'
import './index.css' // Pastikan CSS utama kamu diimpor

import App from './App.vue'
import { routes } from './router' // Pastikan di router.js kamu export const routes

// ViteSSG menggantikan createApp(App).mount('#app')
export const createApp = ViteSSG(
  App,
  // 1. Konfigurasi Router
  { routes },
  // 2. Fungsi Callback Hook (untuk install plugin)
  ({ app, router, routes, isClient, initialState }) => {
    // Buat head manager
    const head = createHead()
    app.use(head)

    // Install Pinia
    app.use(createPinia())

    // Install VCalendar
    app.use(VCalendar, {})

    // Jika kamu punya logic yang hanya boleh jalan di browser (client-side)
    if (isClient) {
      // Contoh: analytics atau library yang butuh 'window'
    }
  }
)