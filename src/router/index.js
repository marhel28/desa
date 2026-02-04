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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PublicLayout,
      children:[
        {
          path:'',
          name:'Home',
          component:HomeView
        },
        {
          path:'lokasi',
          name:'Lokasi & Wilayah',
          component:LokasiView
        },
        {
          path:'profile',
          name:'Profil Desa',
          component:ProfileDesaVIew
        },
        {
          path:'berita',
          name:'Berita Desa',
          component:DesaPageView,
          children:[
            {
              path:'agenda',
              name:'agenda',
              component:AgendaDesa
            },
            {
              path:'beritaperpage',
              name:'beritaperpage',
              component:BeritaPerPage
            }
          ]
        },
        {
          path:'transparansi',
          name:'Transparansi',
          component:TransparansiView
        },
        {
          path:'potensi',
          name:'potensi desa',
          component:PotensiDesaview
        },
        {
          path:'/galeri',
          name:'galeri desa',
          component:GaleriDesaView
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: ErrorPage
    }
  ],
})

export default router
