<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" @click.self="goBack">
    
    <div class="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
      
      <div class="bg-emerald-900 p-6 flex justify-between items-center shrink-0 border-b border-emerald-800">
        <div>
          <h2 class="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar class="w-6 h-6 text-emerald-400" />
            Kalender Kegiatan Desa
          </h2>
          <p class="text-emerald-200 text-sm mt-1">Jadwal kegiatan pemerintahan dan kemasyarakatan.</p>
        </div>
        <button @click="goBack" class="p-2 bg-emerald-800 text-emerald-100 rounded-full hover:bg-emerald-700 transition-colors group">
          <X class="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div class="flex flex-col lg:flex-row flex-grow overflow-hidden">
        
        <div class="lg:w-1/2 p-6 bg-slate-50 border-r border-slate-100 overflow-y-auto">
          <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <VCalendar 
              v-model="selectedDate" 
              :attributes="calendarAttributes"
              expanded
              transparent
              borderless
              title-position="left"
              class="custom-calendar"
              is-required
            />
          </div>

          <div class="mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
             <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Keterangan Penanda</h4>
             <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                   <div class="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-100 animate-pulse"></div>
                   <div class="text-sm">
                      <span class="font-bold text-slate-700">Agenda Penting</span>
                      <p class="text-xs text-slate-500">Kegiatan wajib atau prioritas tinggi.</p>
                   </div>
                </div>
                <div class="flex items-center gap-3">
                   <div class="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></div>
                   <div class="text-sm">
                      <span class="font-bold text-slate-700">Agenda Umum</span>
                      <p class="text-xs text-slate-500">Kegiatan rutin pemerintahan desa.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div class="lg:w-1/2 p-6 bg-white overflow-y-auto relative">
          
          <div class="sticky top-0 bg-white/95 backdrop-blur-sm z-10 mb-6 border-b border-slate-100 pb-4 pt-1">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Agenda Tanggal</span>
                <h3 class="font-bold text-slate-800 text-xl capitalize transition-all duration-300">
                  {{ formatDateFull(selectedDate) }}
                </h3>
              </div>
              <span 
                :class="`text-xs font-bold px-3 py-1 rounded-full border transition-colors ${filteredAgendas.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`"
              >
                {{ filteredAgendas.length }} Kegiatan
              </span>
            </div>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
             <div class="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mb-3"></div>
             <span class="text-slate-400 text-sm">Memuat jadwal...</span>
          </div>

          <div v-else-if="filteredAgendas.length > 0" class="space-y-6 pb-10">
            <div 
              v-for="(agenda, index) in filteredAgendas" 
              :key="agenda.id"
              class="relative pl-6 group animate-fade-in-right"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="absolute left-0 top-3 bottom-[-24px] w-0.5 bg-slate-200 group-last:hidden"></div>
              
              <div :class="`absolute left-[-4px] top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${agenda.pin ? 'bg-red-500 ring-2 ring-red-100' : 'bg-emerald-500 ring-2 ring-emerald-100'}`"></div>

              <div :class="`p-5 rounded-2xl border transition-all duration-300 ${agenda.pin ? 'bg-red-50 border-red-100 hover:shadow-red-100' : 'bg-white border-slate-100 hover:border-emerald-200'} shadow-sm hover:shadow-md cursor-default group-hover:translate-x-1`">
                
                <div class="flex justify-between items-start mb-3">
                  <span v-if="agenda.pin" class="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-red-100 text-red-700">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Penting
                  </span>
                  <span v-else class="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Umum
                  </span>
                  
                  <div class="flex items-center gap-1 text-slate-500 text-xs font-mono bg-slate-100 px-2 py-1 rounded-md">
                    <Clock class="w-3 h-3" />
                    {{ formatTime(agenda.waktu_mulai) }} - {{ formatTime(agenda.waktu_selesai) }}
                  </div>
                </div>
                
                <h4 class="font-bold text-slate-800 mb-2 text-lg leading-snug">{{ agenda.title }}</h4>
                
                <div class="flex items-start gap-2 text-sm text-slate-600 bg-white/50 p-2 rounded-lg border border-transparent" :class="agenda.pin ? 'border-red-100' : ''">
                  <MapPin class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span class="font-medium">{{ agenda.lokasi || 'Lokasi belum ditentukan' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-100 rounded-3xl m-4 bg-slate-50/50">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Calendar class="w-8 h-8 text-slate-300" />
            </div>
            <p class="text-slate-800 font-bold text-lg">Tidak ada agenda</p>
            <p class="text-slate-500 text-sm max-w-xs leading-relaxed mt-1">
              Belum ada kegiatan yang dijadwalkan pada tanggal 
              <span class="font-bold text-emerald-600 block mt-1 border-b border-emerald-200 pb-0.5 w-fit mx-auto">
                {{ formatDateFull(selectedDate) }}
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Calendar, X, Clock, MapPin } from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js';

const router = useRouter();
const selectedDate = ref(new Date()); 
const allAgendas = ref([]);
const isLoading = ref(true);

// --- PERBAIKAN UTAMA: FORMAT TANGGAL LOKAL ---
// Menggunakan getFullYear, getMonth, getDate untuk menghindari pergeseran hari akibat UTC
const toLocalYYYYMMDD = (dateObj) => {
  if (!dateObj) return '';
  const year = dateObj.getFullYear();
  // Month dimulai dari 0 (Januari), jadi +1. padStart memastikan "1" jadi "01"
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// --- API FETCH ---
const loadAgendas = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await fetchSupabase('agenda', 'select=*&order=waktu_mulai.asc');
    if (data) {
      allAgendas.value = data;
    } else {
      console.warn('Gagal load agenda:', error);
    }
  } catch (e) {
    console.error('Error system:', e);
  } finally {
    isLoading.value = false;
  }
};

// --- COMPUTED: FILTER YANG DIPERBAIKI ---
const filteredAgendas = computed(() => {
  if (!selectedDate.value) return [];
  
  // Gunakan fungsi format lokal yang baru
  const selectedStr = toLocalYYYYMMDD(selectedDate.value);

  // Debugging (Cek di console browser jika masih error)
  // console.log("Tanggal Dipilih:", selectedStr); 
  // console.log("Data Agenda:", allAgendas.value);

  return allAgendas.value.filter(agenda => {
    // agenda.tanggal dari database harus format 'YYYY-MM-DD'
    return agenda.tanggal === selectedStr;
  });
});

// --- ATTRIBUTES UNTUK TITIK DI KALENDER ---
const calendarAttributes = computed(() => {
  const attrs = [
    {
      key: 'today',
      highlight: { color: 'emerald', fillMode: 'light' },
      dates: new Date(),
    }
  ];

  allAgendas.value.forEach(agenda => {
    // Kita perlu memastikan titik di kalender muncul di tanggal yang benar
    // new Date("2026-01-21") di JS kadang dianggap UTC dan mundur ke tgl 20 di WIB
    // Solusi: Parse manual YYYY-MM-DD ke komponen lokal
    const [y, m, d] = agenda.tanggal.split('-').map(Number);
    const agendaDate = new Date(y, m - 1, d); // Bulan di Date constructor mulai dari 0

    attrs.push({
      key: agenda.id,
      dot: {
        color: agenda.pin ? 'red' : 'emerald',
        class: agenda.pin ? 'animate-pulse' : '',
      },
      dates: agendaDate,
      popover: {
        label: agenda.title,
        visibility: 'hover',
        hideIndicator: true,
      }
    });
  });

  return attrs;
});

// --- HELPERS ---
const goBack = () => {
  router.push({ name: 'Berita Desa' }); 
};

const formatDateFull = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(date);
};

const formatTime = (timeString) => {
  if (!timeString) return '--:--';
  return timeString.substring(0, 5);
};

onMounted(() => {
  loadAgendas();
});
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: scale(0.95);
}

.animate-fade-in-right {
  animation: fadeInRight 0.4s ease-out forwards;
  opacity: 0;
  transform: translateX(10px);
}

@keyframes scaleUp {
  to { opacity: 1; transform: scale(1); }
}

@keyframes fadeInRight {
  to { opacity: 1; transform: translateX(0); }
}

div::-webkit-scrollbar { width: 6px; }
div::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }
div::-webkit-scrollbar-track { background: transparent; }
</style>