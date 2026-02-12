import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LokasiView from '@/views/LokasiView.vue'
import PublicLayout from '@/layout/PublicLayout.vue'
import ProfileDesaVIew from '@/views/ProfileDesaVIew.vue'
import DesaPageView from '@/views/DesaPageView.vue'
import TransparansiView from '@/views/TransparansiView.vue'
import PotensiDesaview from '@/views/PotensiDesaview.vue'
import GaleriDesaView from '@/views/GaleriDesaView.vue'
import AgendaDesa from '@/views/AgendaDesa.vue'
import BeritaPerPage from '@/views/BeritaPerPage.vue'
import ErrorPage from '@/views/ErrorPage.vue'
import MainLayout from "@/layout/MainLayout.vue"

// 1. Export variabel routes agar bisa digunakan oleh ViteSSG di main.js
export const routes = [
  // --- PUBLIC ROUTES ---
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView
      },
      {
        path: 'lokasi',
        name: 'lokasi',
        component: LokasiView
      },
      {
        path: 'profile',
        name: 'profile-desa',
        component: ProfileDesaVIew
      },
      {
        path: 'berita',
        name: 'Berita desa',
        component: DesaPageView,
        children: [
          {
            path: 'agenda',
            name: 'agenda',
            component: AgendaDesa
          },
          {
            path: 'beritaperpage',
            name: 'beritaperpage',
            component: BeritaPerPage
          }
        ]
      },
      {
        path: 'transparansi',
        name: 'transparansi-publik',
        component: TransparansiView
      },
      {
        path: 'potensi',
        name: 'potensi-desa',
        component: PotensiDesaview
      },
      {
        path: 'galeri',
        name: 'galeri-desa',
        component: GaleriDesaView
      }
    ]
  },

  // --- ADMIN / DASHBOARD ROUTES ---
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/DashboardView.vue'),
      },
      {
        path: 'desa-admin',
        name: 'admin-desa',
        component: () => import('@/views/admin/DesaView.vue'),
      },
      {
        path: 'statistik-admin',
        name: 'admin-statistik',
        component: () => import('@/views/admin/StatistikView.vue'),
      },
      {
        path: 'berita-admin',
        name: 'admin-berita',
        component: () => import('@/views/admin/BeritaView.vue'),
      },
      {
        path: 'agenda-admin',
        name: 'admin-agenda',
        component: () => import('@/views/admin/AgendaView.vue'),
      },
      {
        path: 'potensi-admin',
        name: 'admin-potensi',
        component: () => import('@/views/admin/PotensiView.vue'),
      },
      {
        path: 'transparansi-admin',
        name: 'admin-transparansi',
        component: () => import('@/views/admin/TransparansiView.vue'),
      }
    ]
  },

  // --- AUTH ROUTE ---
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/admin/LoginView.vue'),
    meta: { requiresGuest: true }
  },

  // --- 404 PAGE ---
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: ErrorPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
  routes,
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // Cek apakah kode sedang berjalan di browser (Client) atau server (Node saat build)
  const isClient = typeof window !== 'undefined'

  if (isClient) {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth && !token) {
      next('/login')
    } else if (to.meta.requiresGuest && token) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    // Jika sedang di server (build time), langsung lewatkan
    next()
  }
})

export default router