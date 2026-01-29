<template>
  <div class="font-montserrat bg-slate-50 min-h-screen pb-20 selection:bg-emerald-100 selection:text-emerald-900">

    <div class="relative bg-emerald-950 h-[400px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-teal-400 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/2"></div>

      <div class="relative z-10 text-center px-4 -mt-10 max-w-4xl animate-fade-in">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-emerald-300 text-[10px] md:text-xs font-black tracking-[0.2em] mb-8 uppercase animate-fade-in-down shadow-2xl">
          <span class="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Transparansi Anggaran TA {{ currentYear }}
        </div>
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
          Akuntabilitas <span class="text-emerald-400">Keuangan</span>
        </h1>
        <p class="text-emerald-100/80 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
          Mewujudkan tata kelola pemerintahan desa yang bersih, transparan, dan dapat dipertanggungjawabkan kepada seluruh masyarakat.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
      
      <div v-if="isLoading" class="bg-white/80 backdrop-blur-md p-16 rounded-[2.5rem] shadow-2xl text-center border border-white mb-12">
        <div class="animate-spin w-16 h-16 border-t-4 border-emerald-500 border-r-4 border-r-transparent rounded-full mx-auto mb-6"></div>
        <p class="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Menghubungkan ke Pusat Data...</p>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
          <div class="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 group hover:border-emerald-500 transition-all duration-500">
            <div class="flex justify-between items-start mb-6">
              <div class="p-4 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                <TrendingUp class="w-8 h-8" />
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pendapatan</p>
                <h3 class="text-2xl font-black text-slate-800">{{ formatRupiah(summary.pendapatan) }}</h3>
              </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div class="bg-emerald-500 h-full rounded-full transition-all duration-1000 w-full animate-grow-width"></div>
            </div>
            <p class="text-[10px] font-bold text-slate-400">Target Realisasi: 100%</p>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 group hover:border-amber-500 transition-all duration-500">
            <div class="flex justify-between items-start mb-6">
              <div class="p-4 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                <ShoppingCart class="w-8 h-8" />
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Belanja Desa</p>
                <h3 class="text-2xl font-black text-slate-800">{{ formatRupiah(summary.belanja) }}</h3>
              </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div class="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                   :style="{ width: penyerapanPersen + '%' }"></div>
            </div>
            <p class="text-[10px] font-bold text-slate-400">Rasio Penyerapan: {{ penyerapanPersen }}%</p>
          </div>

          <div class="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 group hover:border-blue-500 transition-all duration-500">
            <div class="flex justify-between items-start mb-6">
              <div class="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Wallet class="w-8 h-8" />
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sisa Anggaran</p>
                <h3 class="text-2xl font-black text-slate-800">{{ formatRupiah(summary.pendapatan - summary.belanja) }}</h3>
              </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div class="bg-blue-500 h-full rounded-full w-full opacity-50"></div>
            </div>
            <p class="text-[10px] font-bold text-slate-400">Estimasi SILPA Akhir Tahun</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-fade-in-up" style="animation-delay: 200ms;">
          <div class="bg-white rounded-[2rem] shadow-soft border border-slate-100 p-8 md:p-10 relative overflow-hidden">
            <div class="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
              <div class="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <PieChart class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-black text-slate-800 uppercase tracking-tighter">Sumber Pendapatan</h3>
            </div>
            
            <div class="space-y-8">
              <div v-for="(item, index) in pendapatanData" :key="index" class="group">
                <div class="flex justify-between items-end mb-3">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">{{ item.label }}</span>
                    <span class="text-xs text-slate-400 font-medium italic">{{ item.keterangan || ' Dana Masuk' }}</span>
                  </div>
                  <span class="font-black text-slate-800">{{ formatRupiah(item.total) }}</span>
                </div>
                <div class="w-full bg-slate-50 rounded-full h-3.5 p-1 border border-slate-100 shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    :style="{ width: summary.pendapatan > 0 ? `${(item.total / summary.pendapatan) * 100}%` : '0%' }"
                  ></div>
                </div>
              </div>
              
              <div v-if="pendapatanData.length === 0" class="py-12 text-center">
                <FileText class="w-12 h-12 text-slate-200 mx-auto mb-4"/>
                <p class="text-slate-400 italic text-sm">Menunggu publikasi data pendapatan...</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2rem] shadow-soft border border-slate-100 p-8 md:p-10">
            <div class="flex items-center gap-4 mb-10 border-b border-slate-50 pb-6">
              <div class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                <BarChart3 class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-black text-slate-800 uppercase tracking-tighter">Proporsi Belanja</h3>
            </div>

            <div class="space-y-8">
              <div v-for="(item, index) in belanjaData" :key="index" class="group">
                <div class="flex justify-between items-end mb-3">
                  <div class="flex flex-col">
                    <span class="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{{ item.label }}</span>
                    <span class="text-xs text-slate-400 font-medium italic">{{ item.keterangan }}</span>
                  </div>
                  <span class="font-black text-slate-800">{{ formatRupiah(item.total) }}</span>
                </div>
                <div class="w-full bg-slate-50 rounded-full h-3.5 p-1 border border-slate-100 shadow-inner">
                  <div 
                    class="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                    :style="{ width: summary.belanja > 0 ? `${(item.total / summary.belanja) * 100}%` : '0%' }"
                  ></div>
                </div>
              </div>

              <div v-if="belanjaData.length === 0" class="py-12 text-center">
                <FileText class="w-12 h-12 text-slate-200 mx-auto mb-4"/>
                <p class="text-slate-400 italic text-sm">Menunggu publikasi data belanja...</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-20 animate-fade-in-up" style="animation-delay: 400ms;">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div class="max-w-xl">
              <span class="text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px] bg-emerald-50 px-3 py-1 rounded-lg">Update Fisik Lapangan</span>
              <h2 class="text-3xl md:text-4xl font-black text-slate-800 mt-4 leading-tight">Progress Pembangunan</h2>
              <p class="text-slate-500 mt-2 font-medium">Realisasi titik pembangunan infrastruktur yang dibiayai dana desa tahun ini.</p>
            </div>
            <div class="flex items-center gap-2 text-slate-400 text-xs font-bold bg-white px-4 py-2 rounded-xl border border-slate-100">
               <Calendar class="w-4 h-4" /> {{ currentYear }}
            </div>
          </div>

          <div v-if="pembangunanData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="item in pembangunanData" :key="item.id" class="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              <div class="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <img v-if="item.foto" :src="item.foto" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                <div v-else class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-emerald-900"></div>
                
                <MapPin class="w-12 h-12 text-white opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all relative z-10" />
                
                <div class="absolute top-6 right-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black shadow-2xl z-20 flex items-center gap-2"
                     :class="item.persentase >= 100 ? 'text-emerald-600' : 'text-amber-600'">
                  <div class="w-2 h-2 rounded-full" :class="item.persentase >= 100 ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'"></div>
                  {{ item.persentase || 0 }}% REALISASI
                </div>
              </div>
              
              <div class="p-8 flex flex-col flex-grow">
                <h4 class="font-black text-slate-800 mb-2 leading-tight text-lg group-hover:text-emerald-600 transition-colors">{{ item.nama }}</h4>
                <p class="text-xs text-slate-400 mb-6 flex items-center gap-1 font-bold uppercase tracking-wider">
                  <Banknote class="w-3.5 h-3.5 text-emerald-500" /> {{ formatRupiah(item.nominal) }}
                </p>
                
                <div class="mt-auto">
                  <div class="w-full bg-slate-50 rounded-full h-3 mb-3 border border-slate-100 p-0.5">
                    <div class="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-1000" :style="{ width: `${item.persentase || 0}%` }"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest">{{ item.keterangan || 'In Progress' }}</span>
                    <span class="text-[10px] font-black text-emerald-600">{{ item.persentase }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="bg-white rounded-[3rem] border border-slate-100 shadow-soft p-20 text-center">
             <div class="bg-emerald-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12 group-hover:rotate-0 transition-all">
               <Hammer class="w-10 h-10 text-emerald-500" />
             </div>
             <h3 class="text-2xl font-black text-slate-800 mb-3 tracking-tighter">Infrastruktur Masih Direncanakan</h3>
             <p class="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">Belum ada titik pembangunan fisik yang diinput. Seluruh dokumentasi akan dipublikasikan secara bertahap.</p>
          </div>
        </div>

        <div class="bg-emerald-950 rounded-[3rem] p-10 md:p-20 relative overflow-hidden text-center text-white shadow-2xl animate-fade-in-up" style="animation-delay: 600ms;">
          <div class="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500 rounded-full blur-[120px] opacity-20"></div>
          <div class="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-400 rounded-full blur-[120px] opacity-10"></div>

          <div class="relative z-10">
            <h2 class="text-3xl md:text-5xl font-black mb-6 tracking-tighter">Transparansi <span class="text-emerald-400">Tanpa Batas</span></h2>
            <p class="text-emerald-100/70 mb-12 max-w-2xl mx-auto font-medium text-base md:text-xl leading-relaxed">
              Kami berkomitmen menyediakan akses dokumen secara utuh. Unduh salinan resmi dokumen perencanaan desa di sini.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center gap-6">
              <a href="#" class="bg-white text-emerald-950 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-50 hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-2xl group">
                <FileText class="w-5 h-5 group-hover:text-emerald-600" />
                Dokumen APBDes {{ currentYear }}
              </a>
              <a href="#" class="bg-emerald-800/30 backdrop-blur-xl border border-emerald-500/30 text-emerald-200 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-800/50 hover:text-white transition-all flex items-center justify-center gap-3">
                <FileText class="w-5 h-5" />
                Dokumen RKPDes {{ currentYear }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  TrendingUp, ShoppingCart, Wallet, 
  PieChart, BarChart3, MapPin, 
  Banknote, FileText, AlertTriangle, Hammer
} from 'lucide-vue-next';
import { fetchSupabase } from '@/service/api.js';

// --- STATE ---
const isLoading = ref(true);
const errorMsg = ref(null);
const rawData = ref([]);
const currentYear = ref(new Date().getFullYear());

// --- FETCH DATA ---
const loadData = async () => {
  isLoading.value = true;
  errorMsg.value = null;
  try {
    const { data, error } = await fetchSupabase('transparansi', `tahun_anggaran=eq.${currentYear.value}&is_published=eq.true`);
    if (error) throw new Error(error);
    if (data) rawData.value = data;
  } catch (e) {
    console.error('System Error:', e);
    errorMsg.value = "Koneksi ke server terputus. Silakan muat ulang halaman.";
  } finally {
    isLoading.value = false;
  }
};

// --- COMPUTED LOGIC ---
const pendapatanData = computed(() => {
  return rawData.value
    .filter(item => item.kategori.toUpperCase() === 'PENDAPATAN')
    .map(item => ({
      label: item.nama,
      total: item.nominal,
      keterangan: item.keterangan
    }))
    .sort((a, b) => b.total - a.total);
});

const belanjaData = computed(() => {
  const filtered = rawData.value.filter(item => {
    const k = item.kategori.toUpperCase();
    return k !== 'PENDAPATAN' && k !== 'APBDES';
  });

  const grouped = filtered.reduce((acc, curr) => {
    const existing = acc.find(item => item.label === curr.kategori);
    if (existing) {
      existing.total += curr.nominal;
    } else {
      acc.push({ label: curr.kategori, total: curr.nominal, keterangan: `Rencana Belanja ${curr.kategori}` });
    }
    return acc;
  }, []);

  return grouped.sort((a, b) => b.total - a.total);
});

const pembangunanData = computed(() => {
  return rawData.value.filter(item => 
    item.kategori.toUpperCase() === 'PEMBANGUNAN' || 
    item.jenis?.toUpperCase() === 'FISIK'
  );
});

const summary = computed(() => {
  const totalPendapatan = rawData.value
    .filter(item => item.kategori.toUpperCase() === 'PENDAPATAN')
    .reduce((sum, item) => sum + item.nominal, 0);

  const totalBelanja = rawData.value
    .filter(item => {
      const k = item.kategori.toUpperCase();
      return k !== 'PENDAPATAN' && k !== 'APBDES';
    })
    .reduce((sum, item) => sum + item.nominal, 0);

  return { pendapatan: totalPendapatan, belanja: totalBelanja };
});

const penyerapanPersen = computed(() => {
  if (summary.value.pendapatan === 0) return 0;
  return ((summary.value.belanja / summary.value.pendapatan) * 100).toFixed(1);
});

// --- HELPER ---
const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(num);
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.shadow-soft {
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(40px);
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(-40px);
}

.animate-grow-width {
  animation: growWidth 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
  width: 0;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { to { opacity: 1; transform: translateY(0); } }
@keyframes growWidth { to { width: 100%; } }
</style>