<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '@/service/apis';

// --- STATE ---
const isLoading = ref(false);
const isSaving = ref(false);
const hasData = ref(false); // Penanda apakah data sudah ada di DB (untuk switch POST/PUT)
const message = reactive({ type: '', text: '' });

// Default value (semua 0)
const defaultStats = {
  total_penduduk: 0,
  kepala_keluarga: 0,
  
  // Gender
  laki_laki: 0,
  perempuan: 0,
  
  // Kategori Usia (Summary)
  usia_muda: 0,
  usia_lansia: 0,

  // Detail Usia
  balita_0_5: 0,
  anak_6_12: 0,
  remaja_13_25: 0,
  dewasa_26_50: 0,
  lansia_50_plus: 0,

  // Pekerjaan
  petani: 0,
  wiraswasta: 0,
  karyawan_swasta: 0,
  pns_tni_polri: 0,
  buruh: 0,
  lainnya: 0
};

const form = reactive({ ...defaultStats });

// --- COMPUTED (Validasi Sederhana) ---
const totalGender = computed(() => form.laki_laki + form.perempuan);
const isGenderMismatch = computed(() => form.total_penduduk !== totalGender.value);

// --- METHODS ---

/**
 * 1. GET: Ambil Data Statistik
 */
const fetchStatistik = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/statistik/');
    
    // Jika ada data
    if (response.data) {
      Object.assign(form, response.data);
      hasData.value = true; // Mode Edit (PUT)
    } else {
      hasData.value = false; // Mode Create (POST)
    }

  } catch (error) {
    // Jika 404, artinya belum ada data statistik -> Mode Create
    if (error.response && error.response.status === 404) {
      hasData.value = false;
      console.log("Data statistik belum ada, siap untuk dibuat baru.");
    } else {
      console.error("Error fetching statistik:", error);
    }
  } finally {
    isLoading.value = false;
  }
};

/**
 * 2. POST / PUT: Simpan Data
 */
const handleSave = async () => {
  isSaving.value = true;
  message.text = '';

  try {
    let response;
    
    if (hasData.value) {
      // Jika data sudah ada -> PUT (Update)
      response = await api.put('/statistik', form);
      message.text = 'Data statistik berhasil diperbarui!';
    } else {
      // Jika data belum ada -> POST (Create)
      response = await api.post('/statistik', form);
      hasData.value = true; // Setelah create, status berubah jadi ada data
      message.text = 'Data statistik berhasil dibuat!';
    }

    message.type = 'success';
    window.scrollTo(0, 0);

  } catch (error) {
    console.error(error);
    message.type = 'error';
    message.text = error.response?.data?.detail || 'Gagal menyimpan data.';
    window.scrollTo(0, 0);
  } finally {
    isSaving.value = false;
  }
};

/**
 * 3. DELETE: Reset Data
 */
const handleDelete = async () => {
  if (!confirm("Apakah Anda yakin ingin me-reset semua data statistik menjadi 0? Data di database akan dihapus.")) {
    return;
  }

  isSaving.value = true;
  message.text = '';

  try {
    await api.delete('/statistik');
    
    // Reset form ke 0
    Object.assign(form, defaultStats);
    hasData.value = false; // Kembali ke mode Create
    
    message.type = 'success';
    message.text = 'Data statistik berhasil di-reset.';
    window.scrollTo(0, 0);

  } catch (error) {
    console.error(error);
    message.type = 'error';
    message.text = error.response?.data?.detail || 'Gagal menghapus data.';
  } finally {
    isSaving.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchStatistik();
});
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Data Statistik Desa</h2>
        <p class="text-gray-500 text-sm mt-1">
          Kelola data kependudukan, demografi, dan mata pencaharian.
          <span v-if="hasData" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 ml-2">Mode Edit</span>
          <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">Mode Input Baru</span>
        </p>
      </div>
      <div v-if="isLoading" class="text-sm text-gray-500 animate-pulse">Memuat data...</div>
    </div>

    <div v-if="message.text" :class="`p-4 rounded-md shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`">
      {{ message.text }}
    </div>

    <div v-if="form.total_penduduk > 0 && isGenderMismatch" class="p-4 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-md flex items-start gap-3">
      <svg class="w-6 h-6 text-yellow-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
      <div>
        <h4 class="font-bold text-sm">Peringatan Data:</h4>
        <p class="text-sm mt-1">Total Penduduk ({{ form.total_penduduk }}) tidak sama dengan jumlah Laki-laki + Perempuan ({{ totalGender }}). Mohon cek kembali inputan Anda.</p>
      </div>
    </div>

    <form @submit.prevent="handleSave" class="space-y-6">

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Populasi & Gender</h3>
        </div>
        <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Total Penduduk</label>
            <div class="relative rounded-md shadow-sm">
              <input v-model.number="form.total_penduduk" type="number" min="0" class="block w-full rounded-md border-gray-300 pl-4 py-3 focus:ring-green-500 focus:border-green-500 text-lg font-semibold text-gray-900 bg-gray-50"/>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">Jiwa</span>
              </div>
            </div>
          </div>

          <div class="col-span-1 md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Kepala Keluarga (KK)</label>
            <div class="relative rounded-md shadow-sm">
              <input v-model.number="form.kepala_keluarga" type="number" min="0" class="block w-full rounded-md border-gray-300 pl-4 py-3 focus:ring-green-500 focus:border-green-500"/>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 sm:text-sm">KK</span>
              </div>
            </div>
          </div>

          <div class="col-span-1 md:col-span-2 border-t pt-4 md:border-t-0 md:pt-0">
            <label class="block text-sm font-medium text-blue-700 mb-1">Laki-Laki</label>
            <input v-model.number="form.laki_laki" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"/>
          </div>

          <div class="col-span-1 md:col-span-2 border-t pt-4 md:border-t-0 md:pt-0">
            <label class="block text-sm font-medium text-pink-700 mb-1">Perempuan</label>
            <input v-model.number="form.perempuan" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-pink-500 focus:border-pink-500"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Demografi Usia</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
             <div class="bg-green-50 p-4 rounded-lg border border-green-100">
                <label class="block text-sm font-medium text-green-800 mb-1">Usia Muda / Produktif</label>
                <input v-model.number="form.usia_muda" type="number" min="0" class="block w-full rounded-md border-green-300 focus:ring-green-500 focus:border-green-500"/>
             </div>
             <div class="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <label class="block text-sm font-medium text-orange-800 mb-1">Usia Lansia / Non-Produktif</label>
                <input v-model.number="form.usia_lansia" type="number" min="0" class="block w-full rounded-md border-orange-300 focus:ring-orange-500 focus:border-orange-500"/>
             </div>
          </div>
          
          <h4 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">Detail Rentang Usia</h4>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Balita (0-5 th)</label>
              <input v-model.number="form.balita_0_5" type="number" min="0" class="w-full rounded border-gray-300 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Anak (6-12 th)</label>
              <input v-model.number="form.anak_6_12" type="number" min="0" class="w-full rounded border-gray-300 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Remaja (13-25 th)</label>
              <input v-model.number="form.remaja_13_25" type="number" min="0" class="w-full rounded border-gray-300 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Dewasa (26-50 th)</label>
              <input v-model.number="form.dewasa_26_50" type="number" min="0" class="w-full rounded border-gray-300 focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Lansia (50+ th)</label>
              <input v-model.number="form.lansia_50_plus" type="number" min="0" class="w-full rounded border-gray-300 focus:ring-green-500 focus:border-green-500"/>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Mata Pencaharian</h3>
        </div>
        <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Petani</label>
            <input v-model.number="form.petani" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Wiraswasta / Pedagang</label>
            <input v-model.number="form.wiraswasta" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Karyawan Swasta</label>
            <input v-model.number="form.karyawan_swasta" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">PNS / TNI / POLRI</label>
            <input v-model.number="form.pns_tni_polri" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buruh</label>
            <input v-model.number="form.buruh" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"/>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lainnya</label>
            <input v-model.number="form.lainnya" type="number" min="0" class="block w-full rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"/>
          </div>

        </div>
      </div>

      <div class="flex justify-between items-center pt-4">
        <button 
          v-if="hasData"
          type="button" 
          @click="handleDelete"
          class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-transparent rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          :disabled="isSaving"
        >
          Reset Data Statistik
        </button>
        <div v-else></div> <button 
          type="submit" 
          class="inline-flex justify-center px-6 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="isSaving"
        >
          <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>

    </form>
  </div>
</template>