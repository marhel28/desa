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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Jika ada posisi yang disimpan (saat klik tombol back/forward browser)
    if (savedPosition) {
      return savedPosition
    } else {
      // Selalu scroll ke paling atas (x: 0, y: 0)
      return { top: 0, behavior: 'smooth' } // Tambahkan behavior smooth jika ingin efek halus
    }
  },
  routes: [
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
              path: 'beritaperpage', // Lebih baik gunakan nama yang jelas
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
          path: 'galeri', // Hilangkan '/' di awal agar mengikuti parent
          name: 'galeri-desa',
          component: GaleriDesaView
        }
      ]
    },

    // --- ADMIN / DASHBOARD ROUTES ---
    {
      path: '/', // Ubah dari /login ke /admin agar lebih masuk akal
      component: MainLayout,
      meta: { requiresAuth: true },
      redirect: '/dashboard', // Redirect otomatis ke dashboard
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

    // --- AUTH ROUTE (Login Page) ---
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/admin/LoginView.vue'), // Asumsi kamu punya LoginView
      meta: { requiresGuest: true }
    },

    // --- 404 PAGE ---
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: ErrorPage
    }
  ],
})

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    // Jika butuh login tapi tidak ada token, lari ke /login
    next('/login'); 
  } else if (to.meta.requiresGuest && token) {
    // Jika user sudah login tapi coba buka halaman login lagi
    next('/dashboard');
  } else {
    next();
  }
});

export default router