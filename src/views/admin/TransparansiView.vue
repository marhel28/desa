<template>
    <div class="p-6 bg-slate-50 min-h-screen font-montserrat">
      
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Transparansi Anggaran</h1>
          <p class="text-slate-500 text-sm">Kelola data APBDes, realisasi, dan progres pembangunan fisik.</p>
        </div>
        <div class="flex gap-3">
          <select v-model="filterTahun" @change="fetchData" class="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-4 py-2.5 focus:ring-emerald-500 outline-none shadow-sm">
             <option v-for="year in yearOptions" :key="year" :value="year">Tahun {{ year }}</option>
          </select>
          
          <button 
            @click="openModal()" 
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
          >
            <Plus class="w-5 h-5" />
            Input Data
          </button>
        </div>
      </div>
  
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
               <Wallet class="w-24 h-24" />
            </div>
            <div class="relative z-10">
               <p class="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Total Pendapatan</p>
               <h3 class="text-2xl md:text-3xl font-bold">{{ formatRupiah(summary.pendapatan) }}</h3>
               <p class="text-xs text-emerald-100 mt-2 opacity-80">Tahun Anggaran {{ filterTahun }}</p>
            </div>
         </div>
  
         <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
               <TrendingDown class="w-24 h-24" />
            </div>
            <div class="relative z-10">
               <p class="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">Total Belanja</p>
               <h3 class="text-2xl md:text-3xl font-bold">{{ formatRupiah(summary.belanja) }}</h3>
               <p class="text-xs text-amber-100 mt-2 opacity-80">Realisasi & Pembangunan</p>
            </div>
         </div>
  
         <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg relative overflow-hidden">
            <div class="flex items-center justify-between mb-4">
               <div>
                  <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Surplus / Defisit</p>
                  <h3 :class="`text-2xl md:text-3xl font-bold ${summary.pendapatan - summary.belanja >= 0 ? 'text-blue-600' : 'text-red-600'}`">
                     {{ formatRupiah(summary.pendapatan - summary.belanja) }}
                  </h3>
               </div>
               <div class="bg-slate-50 p-3 rounded-full">
                  <PieChart class="w-8 h-8 text-slate-400" />
               </div>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-1.5">
               <div class="bg-blue-500 h-1.5 rounded-full" :style="{ width: '100%' }"></div>
            </div>
         </div>
      </div>
  
      <div v-if="isLoading" class="text-center py-10">
         <Loader2 class="w-10 h-10 animate-spin text-emerald-500 mx-auto" />
         <p class="text-slate-400 mt-2">Memuat data...</p>
      </div>
  
      <div v-else-if="filteredList.length === 0" class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
         <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <FileText class="w-8 h-8" />
         </div>
         <h3 class="text-lg font-bold text-slate-700">Tidak ada data</h3>
         <p class="text-slate-500">Belum ada data transparansi untuk tahun {{ filterTahun }}.</p>
      </div>
  
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in filteredList" :key="item.id" 
             class="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative group overflow-hidden">
           
           <div :class="`h-1.5 w-full ${getCategoryColor(item.kategori)}`"></div>
  
           <div class="p-5 flex flex-col h-full">
              <div class="flex justify-between items-start mb-3">
                 <span :class="`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${getCategoryBadge(item.kategori)}`">
                    {{ item.kategori }}
                 </span>
                 <div class="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button @click="editData(item)" class="text-slate-400 hover:text-blue-600 transition-colors">
                       <Edit3 class="w-4 h-4" />
                    </button>
                    <button @click="deleteData(item.id)" class="text-slate-400 hover:text-red-600 transition-colors">
                       <Trash2 class="w-4 h-4" />
                    </button>
                 </div>
              </div>
  
              <h3 class="font-bold text-slate-800 text-lg mb-1 line-clamp-2">{{ item.nama }}</h3>
              <p class="text-xs text-slate-400 mb-4">{{ item.jenis }}</p>
  
              <div class="mt-auto">
                 <div class="flex items-end justify-between mb-2">
                    <span class="text-sm font-bold text-slate-600">Anggaran</span>
                    <span class="text-lg font-bold text-slate-800">{{ formatRupiah(item.nominal) }}</span>
                 </div>
  
                 <div v-if="item.persentase !== null" class="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div 
                       :class="`h-2 rounded-full transition-all duration-1000 ${getCategoryColor(item.kategori)}`" 
                       :style="{ width: `${item.persentase}%` }"
                    ></div>
                 </div>
                 
                 <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-500 italic">{{ item.keterangan || 'Tidak ada keterangan' }}</span>
                    <span v-if="item.persentase" class="font-bold text-slate-700">{{ item.persentase }}%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
  
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal"></div>
        
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-lg text-slate-800">
              {{ isEditing ? 'Edit Data' : 'Tambah Data Baru' }}
            </h3>
            <button @click="closeModal" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
              <X class="w-5 h-5 text-slate-500" />
            </button>
          </div>
  
          <div class="p-6 overflow-y-auto">
            <form @submit.prevent="submitForm" class="space-y-4">
              
              <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Tahun</label>
                    <input v-model.number="form.tahun_anggaran" type="number" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                 </div>
                 <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Kategori</label>
                    <select v-model="form.kategori" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                       <option value="PENDAPATAN">PENDAPATAN</option>
                       <option value="BELANJA">BELANJA</option>
                       <option value="PEMBANGUNAN">PEMBANGUNAN</option>
                       <option value="APBDES">APBDES (Ringkasan)</option>
                    </select>
                 </div>
              </div>
  
              <div>
                 <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Nama Kegiatan / Sumber Dana</label>
                 <input v-model="form.nama" type="text" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Contoh: Dana Desa, Pembangunan Jalan...">
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                 <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Jenis / Sub-Kategori</label>
                    <input v-model="form.jenis" type="text" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="cth: FISIK / HONOR">
                 </div>
                 <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Nominal (Rp)</label>
                    <input v-model.number="form.nominal" type="number" required class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                 </div>
              </div>
  
              <div class="grid grid-cols-2 gap-4 items-center">
                 <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Realisasi (%)</label>
                    <input v-model.number="form.persentase" type="number" step="0.1" min="0" max="100" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                 </div>
                 <div class="pt-5">
                    <label class="flex items-center gap-2 cursor-pointer">
                       <input v-model="form.is_published" type="checkbox" class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300">
                       <span class="text-sm font-bold text-slate-700">Publikasikan?</span>
                    </label>
                 </div>
              </div>
  
              <div>
                 <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Keterangan (Opsional)</label>
                 <textarea v-model="form.keterangan" rows="3" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
              </div>
  
            </form>
          </div>
  
          <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button @click="closeModal" class="px-5 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">
              Batal
            </button>
            <button 
              @click="submitForm" 
              :disabled="isSubmitting"
              class="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Data' }}
            </button>
          </div>
  
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import Swal from 'sweetalert2';
import api from '@/service/apis';
import {
   Plus, Edit3, Trash2, X, Loader2, Wallet, TrendingDown, PieChart, FileText
} from 'lucide-vue-next';

// --- CONFIG ---
const API_URL = '/transparansi';

// --- STATE ---
const rawList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const filterTahun = ref(new Date().getFullYear());

// Generate Year Options (Current Year +/- 2)
const yearOptions = computed(() => {
   const current = new Date().getFullYear();
   return [current + 1, current, current - 1, current - 2];
});

const form = reactive({
   id: null,
   tahun_anggaran: new Date().getFullYear(),
   kategori: 'BELANJA',
   jenis: '',
   nama: '',
   nominal: 0,
   persentase: 0,
   keterangan: '',
   is_published: true
});

// --- COMPUTED ---
const filteredList = computed(() => {
   return rawList.value.filter(
      item => item.tahun_anggaran === filterTahun.value
   );
});

const summary = computed(() => {
   let pendapatan = 0;
   let belanja = 0;

   filteredList.value.forEach(item => {
      const kat = item.kategori.toUpperCase();
      if (kat === 'PENDAPATAN') {
         pendapatan += item.nominal;
      } else if (kat === 'BELANJA' || kat === 'PEMBANGUNAN') {
         belanja += item.nominal;
      }
   });

   return { pendapatan, belanja };
});

// --- API ACTIONS ---

// 1. GET
const fetchData = async () => {
   isLoading.value = true;
   try {
      const res = await api.get(
         `${API_URL}/?tahun=${filterTahun.value}`
      );

      rawList.value = res.data;
   } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Gagal memuat data transparansi', 'error');
   } finally {
      isLoading.value = false;
   }
};

// 2. POST & PUT
const submitForm = async () => {
   if (!form.nama || !form.nominal || !form.kategori) {
      Swal.fire('Peringatan', 'Mohon lengkapi field wajib', 'warning');
      return;
   }

   isSubmitting.value = true;
   try {
      const payload = {
         tahun_anggaran: form.tahun_anggaran,
         kategori: form.kategori,
         jenis: form.jenis,
         nama: form.nama,
         nominal: form.nominal,
         persentase: form.persentase,
         keterangan: form.keterangan,
         is_published: form.is_published
      };

      if (isEditing.value) {
         await api.put(
            `${API_URL}/${form.id}`,
            payload
         );
      } else {
         await api.post(
            `${API_URL}/`,
            payload
         );
      }

      Swal.fire('Sukses', 'Data berhasil disimpan', 'success');
      closeModal();
      fetchData();

   } catch (error) {
      console.error(error);
      Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
   } finally {
      isSubmitting.value = false;
   }
};

// 3. DELETE
const deleteData = async (id) => {
   const result = await Swal.fire({
      title: 'Hapus Data?',
      text: "Data anggaran yang dihapus tidak dapat dikembalikan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus'
   });

   if (result.isConfirmed) {
      try {
         await api.delete(`${API_URL}/${id}`);

         Swal.fire('Terhapus', 'Data telah dihapus', 'success');
         fetchData();
      } catch (error) {
         Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
   }
};

// --- HANDLERS ---

const openModal = () => {
   resetForm();
   isEditing.value = false;
   form.tahun_anggaran = filterTahun.value;
   showModal.value = true;
};

const editData = (item) => {
   isEditing.value = true;
   form.id = item.id;
   form.tahun_anggaran = item.tahun_anggaran;
   form.kategori = item.kategori;
   form.jenis = item.jenis;
   form.nama = item.nama;
   form.nominal = item.nominal;
   form.persentase = item.persentase;
   form.keterangan = item.keterangan;
   form.is_published = item.is_published;
   showModal.value = true;
};

const closeModal = () => {
   showModal.value = false;
   resetForm();
};

const resetForm = () => {
   form.id = null;
   form.tahun_anggaran = filterTahun.value;
   form.kategori = 'BELANJA';
   form.jenis = '';
   form.nama = '';
   form.nominal = 0;
   form.persentase = 0;
   form.keterangan = '';
   form.is_published = true;
};

// --- VISUAL HELPERS ---

const formatRupiah = (number) => {
   return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
   }).format(number);
};

const getCategoryColor = (cat) => {
   switch (cat) {
      case 'PENDAPATAN': return 'bg-emerald-500';
      case 'BELANJA': return 'bg-amber-500';
      case 'PEMBANGUNAN': return 'bg-blue-500';
      case 'APBDES': return 'bg-purple-500';
      default: return 'bg-slate-500';
   }
};

const getCategoryBadge = (cat) => {
   switch (cat) {
      case 'PENDAPATAN': return 'bg-emerald-100 text-emerald-700';
      case 'BELANJA': return 'bg-amber-100 text-amber-700';
      case 'PEMBANGUNAN': return 'bg-blue-100 text-blue-700';
      case 'APBDES': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
   }
};

// --- LIFECYCLE ---
onMounted(() => {
   fetchData();
});
</script>

  
  <style scoped>
  /* Transisi Smooth */
  .list-enter-active, .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from, .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
  </style>