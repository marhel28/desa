<script setup>
import { ref, onMounted } from 'vue';
// Pastikan path ini sesuai dengan konfigurasi project Anda
import api from '@/service/apis'; 

// --- STATE ---
const isLoading = ref(true);

// State untuk Kartu Ringkasan (Atas)
const stats = ref({
  totalPenduduk: 0,
  totalKK: 0,
  beritaCount: 0,
  agendaCount: 0,
  potensiCount: 0
});

// State untuk Grafik Demografi (Tengah)
const statistikDesa = ref({
  petani: 0,
  wiraswasta: 0,
  karyawan_swasta: 0,
  pns_tni_polri: 0,
  buruh: 0,
  lainnya: 0
});

const recentNews = ref([]);
const upcomingAgendas = ref([]);

// --- METHODS ---

const fetchDashboardData = async () => {
  isLoading.value = true;
  try {
    // Panggil semua API secara paralel (Promise.allSettled agar jika satu gagal, yang lain tetap jalan)
    const [resStatistik, resBerita, resAgenda, resPotensi] = await Promise.allSettled([
      api.get('/statistik/'), // Mengambil data statistik
      api.get('/berita/'),    // Mengambil data berita
      api.get('/agenda/'),    // Mengambil data agenda
      api.get('/potensi/')    // Mengambil data potensi
    ]);

    // 1. OLAH DATA STATISTIK & PROFESI
    if (resStatistik.status === 'fulfilled' && resStatistik.value.data) {
      let dataStat = resStatistik.value.data;

      // Cek apakah response berupa Array (ambil index 0) atau Object langsung
      if (Array.isArray(dataStat)) {
        dataStat = dataStat.length > 0 ? dataStat[0] : null;
      }

      if (dataStat) {
        // Mapping Data ke State Vue
        stats.value.totalPenduduk = dataStat.total_penduduk || 0;
        stats.value.totalKK = dataStat.kepala_keluarga || 0;

        // Mapping Data Profesi
        statistikDesa.value = {
          petani: dataStat.petani || 0,
          wiraswasta: dataStat.wiraswasta || 0,
          karyawan_swasta: dataStat.karyawan_swasta || 0,
          pns_tni_polri: dataStat.pns_tni_polri || 0,
          buruh: dataStat.buruh || 0,
          lainnya: dataStat.lainnya || 0
        };
      }
    }

    // 2. OLAH DATA BERITA (Untuk Count & List Terbaru)
    if (resBerita.status === 'fulfilled' && Array.isArray(resBerita.value.data)) {
      const beritaData = resBerita.value.data;
      stats.value.beritaCount = beritaData.length;
      
      // Ambil 5 berita terbaru (Sort by Tanggal Descending)
      recentNews.value = beritaData
        .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
        .slice(0, 5);
    }

    // 3. OLAH DATA AGENDA (Untuk Count & List Agenda Terdekat)
    if (resAgenda.status === 'fulfilled' && Array.isArray(resAgenda.value.data)) {
      const agendaData = resAgenda.value.data;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset jam agar perbandingan tanggal akurat

      // Filter agenda yang tanggalnya >= hari ini
      const upcoming = agendaData.filter(item => new Date(item.tanggal) >= today);
      
      stats.value.agendaCount = upcoming.length;
      
      // Tampilkan 3 agenda terdekat
      upcomingAgendas.value = upcoming
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
        .slice(0, 3);
    }

    // 4. OLAH DATA POTENSI (Untuk Count)
    if (resPotensi.status === 'fulfilled' && Array.isArray(resPotensi.value.data)) {
      stats.value.potensiCount = resPotensi.value.data.length;
    }

  } catch (error) {
    console.error("Gagal memuat dashboard:", error);
  } finally {
    isLoading.value = false;
  }
};

// Helper: Menghitung persentase bar chart
const calculatePercentage = (val) => {
  const total = stats.value.totalPenduduk || 1; // Hindari pembagian dengan nol
  return Math.round((val / total) * 100);
};

// Helper: Format Label Kategori (Snake Case -> Title Case/Readable)
const formatLabel = (key) => {
  const labels = {
    petani: 'Petani / Buruh Tani',
    wiraswasta: 'Wiraswasta / Pedagang',
    karyawan_swasta: 'Karyawan Swasta',
    pns_tni_polri: 'PNS / TNI / POLRI',
    buruh: 'Buruh Pabrik / Bangunan',
    lainnya: 'Lainnya / Tidak Bekerja'
  };
  return labels[key] || key.replace(/_/g, ' ');
};

// Helper: Warna Bar Chart berdasarkan Key Profesi
const getBarColor = (key) => {
  const colors = {
    petani: 'bg-green-500',
    wiraswasta: 'bg-blue-500',
    karyawan_swasta: 'bg-indigo-500',
    pns_tni_polri: 'bg-yellow-500',
    buruh: 'bg-orange-500',
    lainnya: 'bg-gray-400'
  };
  return colors[key] || 'bg-emerald-500';
};

// --- LIFECYCLE ---
onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <div class="space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-gray-500 text-sm">Ringkasan aktivitas dan statistik Desa Sidomukti</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded shadow-sm border border-gray-100">
          {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
       <div v-for="i in 4" :key="i" class="h-32 bg-gray-200 rounded-lg"></div>
    </div>

    <div v-else class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 flex items-center justify-between transition hover:-translate-y-1">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Penduduk</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.totalPenduduk.toLocaleString() }} <span class="text-xs text-gray-400 font-normal">Jiwa</span></p>
            <p class="text-xs text-blue-600 mt-1">{{ stats.totalKK.toLocaleString() }} Kepala Keluarga</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-full text-blue-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500 flex items-center justify-between transition hover:-translate-y-1">
          <div>
            <p class="text-sm font-medium text-gray-500">Artikel & Berita</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.beritaCount }}</p>
            <p class="text-xs text-green-600 mt-1">Terpublikasi</p>
          </div>
          <div class="p-3 bg-green-50 rounded-full text-green-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500 flex items-center justify-between transition hover:-translate-y-1">
          <div>
            <p class="text-sm font-medium text-gray-500">Potensi Desa</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.potensiCount }}</p>
            <p class="text-xs text-purple-600 mt-1">Unit Usaha/Wisata</p>
          </div>
          <div class="p-3 bg-purple-50 rounded-full text-purple-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500 flex items-center justify-between transition hover:-translate-y-1">
          <div>
            <p class="text-sm font-medium text-gray-500">Agenda Mendatang</p>
            <p class="text-2xl font-bold text-gray-800 mt-1">{{ stats.agendaCount }}</p>
            <p class="text-xs text-orange-600 mt-1">Acara Aktif</p>
          </div>
          <div class="p-3 bg-orange-50 rounded-full text-orange-600">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-gray-800">Demografi Profesi Penduduk</h3>
            <router-link to="/statistik" class="text-sm text-blue-600 hover:underline flex items-center gap-1">
              Lihat Detail <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </router-link>
          </div>
          
          <div class="space-y-5">
            <div v-for="(val, key) in statistikDesa" :key="key">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600 font-medium">{{ formatLabel(key) }}</span>
                <span class="font-bold text-gray-800">{{ val.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  class="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  :class="getBarColor(key)"
                  :style="{ width: calculatePercentage(val) + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Agenda Terdekat</h3>
          
          <div v-if="upcomingAgendas.length > 0" class="space-y-4">
            <div v-for="agenda in upcomingAgendas" :key="agenda.id" class="flex gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div class="flex-shrink-0 w-12 h-12 bg-red-50 rounded-lg flex flex-col items-center justify-center text-red-600 border border-red-100">
                <span class="text-[10px] font-bold uppercase">{{ new Date(agenda.tanggal).toLocaleString('id-ID', { month: 'short' }) }}</span>
                <span class="text-xl font-bold leading-none">{{ new Date(agenda.tanggal).getDate() }}</span>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{{ agenda.title }}</h4>
                <div class="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {{ agenda.waktu_mulai ? agenda.waktu_mulai.substring(0,5) + ' WIB' : 'Waktu belum ditentukan' }}
                </div>
                <div class="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                   <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   {{ agenda.lokasi || 'Lokasi menyusul' }}
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p class="text-sm">Tidak ada agenda mendatang.</p>
          </div>
          
          <router-link to="/agenda-admin" class="block w-full mt-4 py-2 text-center text-sm text-green-600 border border-green-600 rounded hover:bg-green-50 transition">
            Lihat Semua Agenda
          </router-link>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-800">Berita Terbaru</h3>
          <router-link to="`/berita-admin`" class="text-sm text-blue-600 hover:text-blue-800 font-medium">Kelola Berita &rarr;</router-link>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50 text-gray-500 uppercase font-medium border-b border-gray-200">
              <tr>
                <th class="px-6 py-3">Judul Berita</th>
                <th class="px-6 py-3">Tanggal</th>
                <th class="px-6 py-3">Kategori</th>
                <th class="px-6 py-3">Penulis</th>
                <th class="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="news in recentNews" :key="news.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-3 font-medium text-gray-800 max-w-md truncate">{{ news.title }}</td>
                <td class="px-6 py-3 text-gray-500 whitespace-nowrap">{{ new Date(news.tanggal).toLocaleDateString('id-ID') }}</td>
                <td class="px-6 py-3">
                  <span 
                    class="px-2 py-1 text-xs rounded-full capitalize"
                    :class="{
                      'bg-blue-100 text-blue-700': news.tipe === 'pengumuman',
                      'bg-green-100 text-green-700': news.tipe === 'kegiatan',
                      'bg-yellow-100 text-yellow-700': news.tipe === 'pembangunan',
                      'bg-purple-100 text-purple-700': news.tipe === 'layanan',
                      'bg-gray-100 text-gray-600': !['pengumuman','kegiatan','pembangunan','layanan'].includes(news.tipe)
                    }"
                  >
                    {{ news.tipe }}
                  </span>
                </td>
                <td class="px-6 py-3 text-gray-500">{{ news.penulis }}</td>
                <td class="px-6 py-3 text-center">
                  <router-link :to="`/berita-admin`" class="text-gray-400 hover:text-blue-600 transition p-1">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  </router-link>
                </td>
              </tr>
              <tr v-if="recentNews.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-400 italic">Belum ada berita yang dipublish.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>