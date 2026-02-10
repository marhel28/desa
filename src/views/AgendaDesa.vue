<template>
  <div class="fixed inset-0 z-[200] px-5 py-5  flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-hidden" @click.self="goBack">
    
    <div class="bg-white w-full rounded-2xl max-w-5xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-[90vh] max-h-screen sm:max-h-[90vh] animate-scale-up">
      
      <div class="bg-emerald-900 p-5 sm:p-6 flex justify-between items-center shrink-0 border-b border-emerald-800">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Calendar class="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            Agenda Desa
          </h2>
          <p class="text-emerald-200 text-xs sm:text-sm mt-0.5">Jadwal kegiatan pemerintahan.</p>
        </div>
        <button @click="goBack" class="p-2 bg-emerald-800 text-emerald-100 rounded-full hover:bg-emerald-700 transition-colors">
          <X class="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div class="flex flex-col lg:flex-row flex-grow overflow-y-auto lg:overflow-hidden">
        
        <div class="w-full lg:w-1/2 p-4 sm:p-6 bg-slate-50 border-r border-slate-100 lg:overflow-y-auto custom-scrollbar shrink-0">
          <div class="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-100">
            <VCalendar 
              v-model="selectedDate" 
              :attributes="calendarAttributes"
              expanded
              transparent
              borderless
              title-position="left"
              class="custom-calendar"
              is-required
              @dayclick="onDayClick"
            />
          </div>

          <div class="mt-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hidden sm:block">
             <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Keterangan</h4>
             <div class="flex flex-col gap-3">
                <div class="flex items-center gap-3">
                   <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                   <div class="text-sm"><span class="font-bold text-slate-700">Agenda Penting</span></div>
                </div>
                <div class="flex items-center gap-3">
                   <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <div class="text-sm"><span class="font-bold text-slate-700">Agenda Umum</span></div>
                </div>
             </div>
          </div>
        </div>

        <div class="w-full lg:w-1/2 p-4 sm:p-6 bg-white lg:overflow-y-auto relative custom-scrollbar flex-grow">
          
          <div class="sticky top-[-1px] bg-white/95 backdrop-blur-sm z-10 mb-6 border-b border-slate-100 pb-4 pt-1">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agenda Tanggal</span>
                <h3 class="font-bold text-slate-800 text-lg sm:text-xl capitalize">
                  {{ formatDateFull(selectedDate) }}
                </h3>
              </div>
              <span 
                :class="`text-xs font-bold px-3 py-1 rounded-full border ${filteredAgendas.length > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`"
              >
                {{ filteredAgendas.length }} Kegiatan
              </span>
            </div>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
             <div class="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-3"></div>
          </div>

          <div v-else-if="filteredAgendas.length > 0" class="space-y-4 pb-10">
            <div 
              v-for="(agenda, index) in filteredAgendas" 
              :key="agenda.id"
              class="relative pl-6 group animate-fade-in-right"
              :style="{ animationDelay: `${index * 50}ms` }"
            >
              <div class="absolute left-0 top-3 bottom-[-16px] w-0.5 bg-slate-100 group-last:hidden"></div>
              <div :class="`absolute left-[-4px] top-4 w-2.5 h-2.5 rounded-full border-2 border-white z-10 ${agenda.pin ? 'bg-red-500' : 'bg-emerald-500'}`"></div>

              <div :class="`p-4 rounded-2xl border transition-all ${agenda.pin ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-100'} shadow-sm`">
                <div class="flex justify-between items-start mb-2">
                  <span :class="`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${agenda.pin ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`">
                    {{ agenda.pin ? 'Penting' : 'Umum' }}
                  </span>
                  <div class="flex items-center gap-1 text-slate-500 text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded">
                    <Clock class="w-3 h-3" /> {{ formatTime(agenda.waktu_mulai) }}
                  </div>
                </div>
                <h4 class="font-bold text-slate-800 text-md leading-tight mb-2">{{ agenda.title }}</h4>
                <div class="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{{ agenda.lokasi || 'Lokasi belum ditentukan' }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
            <Calendar class="w-10 h-10 text-slate-300 mb-2" />
            <p class="text-slate-800 font-bold">Tidak ada agenda</p>
            <p class="text-slate-500 text-xs px-6">Silakan pilih tanggal lain pada kalender.</p>
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

const toLocalYYYYMMDD = (dateObj) => {
  if (!dateObj) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const loadAgendas = async () => {
  isLoading.value = true;
  try {
    const { data } = await fetchSupabase('agenda', 'select=*&order=waktu_mulai.asc');
    if (data) allAgendas.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const onDayClick = (day) => {
  selectedDate.value = day.date;
  // Di mobile, kita bisa tambahkan auto-scroll ke daftar agenda jika diinginkan
  if (window.innerWidth < 1024) {
    // Logic scroll ke elemen agenda bisa ditaruh di sini
  }
};

const filteredAgendas = computed(() => {
  if (!selectedDate.value) return [];
  const selectedStr = toLocalYYYYMMDD(selectedDate.value);
  return allAgendas.value.filter(agenda => agenda.tanggal === selectedStr);
});

const calendarAttributes = computed(() => {
  const attrs = [{
    key: 'today',
    highlight: { color: 'emerald', fillMode: 'light' },
    dates: new Date(),
  }];

  allAgendas.value.forEach(agenda => {
    const [y, m, d] = agenda.tanggal.split('-').map(Number);
    attrs.push({
      key: `agenda-${agenda.id}`,
      dot: { color: agenda.pin ? 'red' : 'emerald', class: agenda.pin ? 'animate-pulse' : '' },
      dates: new Date(y, m - 1, d),
    });
  });
  return attrs;
});

const goBack = () => { router.push({ name: 'Berita desa' }); };
const formatDateFull = (date) => {
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};
const formatTime = (t) => t ? t.substring(0, 5) : '--:--';

onMounted(loadAgendas);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

.animate-scale-up {
  animation: scaleUp 0.3s ease-out forwards;
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade-in-right {
  animation: fadeInRight 0.3s ease-out forwards;
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>