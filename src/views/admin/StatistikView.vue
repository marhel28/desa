<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from '@/service/apis';

/* =========================
   STATE
========================= */
const isLoading = ref(false);
const isSaving = ref(false);
const hasData = ref(false);
const message = reactive({ type: '', text: '' });

// 🔥 Retry control
const retryCount = ref(0);
const maxRetry = 3;

/* =========================
   DEFAULT VALUE
========================= */
const defaultStats = {
  total_penduduk: 0,
  kepala_keluarga: 0,
  laki_laki: 0,
  perempuan: 0,
  usia_muda: 0,
  usia_lansia: 0,
  balita_0_5: 0,
  anak_6_12: 0,
  remaja_13_25: 0,
  dewasa_26_50: 0,
  lansia_50_plus: 0,
  petani: 0,
  wiraswasta: 0,
  karyawan_swasta: 0,
  pns_tni_polri: 0,
  buruh: 0,
  lainnya: 0
};

const form = reactive({ ...defaultStats });

/* =========================
   COMPUTED
========================= */
const totalGender = computed(() => form.laki_laki + form.perempuan);
const isGenderMismatch = computed(() => form.total_penduduk !== totalGender.value);

/* =========================
   FETCH DATA (AUTO RETRY)
========================= */
const fetchStatistik = async () => {
  isLoading.value = true;
  message.text = '';

  try {
    const response = await api.get('/statistik');

    if (response.data) {
      Object.assign(form, response.data);
      hasData.value = true;
      retryCount.value = 0; // reset kalau sukses
    } else {
      hasData.value = false;
    }

  } catch (error) {

    if (error.response && error.response.status === 404) {
      // Data belum ada → mode create
      hasData.value = false;
      retryCount.value = 0;
    } else {
      console.error("Error fetching statistik:", error);

      // 🔥 Auto retry max 3x
      if (retryCount.value < maxRetry) {
        retryCount.value++;
        console.log(`Retry ke-${retryCount.value}...`);
        setTimeout(() => fetchStatistik(), 1000);
        return;
      }

      message.type = 'error';
      message.text = 'Gagal mengambil data. Silakan klik tombol Ambil Ulang Data.';
    }

  } finally {
    isLoading.value = false;
  }
};

/* =========================
   SAVE DATA
========================= */
const handleSave = async () => {
  if (isGenderMismatch.value) {
    message.type = 'error';
    message.text = 'Total penduduk tidak sesuai dengan jumlah laki-laki + perempuan.';
    return;
  }

  isSaving.value = true;
  message.text = '';

  try {
    if (hasData.value) {
      await api.put('/statistik', form);
      message.type = 'success';
      message.text = 'Data berhasil diperbarui.';
    } else {
      await api.post('/statistik', form);
      hasData.value = true;
      message.type = 'success';
      message.text = 'Data berhasil disimpan.';
    }
  } catch (error) {
    console.error(error);
    message.type = 'error';
    message.text = 'Gagal menyimpan data.';
  } finally {
    isSaving.value = false;
  }
};

/* =========================
   DELETE DATA
========================= */
const handleDelete = async () => {
  if (!confirm('Yakin ingin menghapus data statistik?')) return;

  try {
    await api.delete('/statistik');
    Object.assign(form, defaultStats);
    hasData.value = false;
    message.type = 'success';
    message.text = 'Data berhasil dihapus.';
  } catch (error) {
    console.error(error);
    message.type = 'error';
    message.text = 'Gagal menghapus data.';
  }
};

/* =========================
   LIFECYCLE
========================= */
onMounted(() => {
  fetchStatistik();
});
</script>

<template>
  <div class="space-y-6">

    <!-- HEADER -->
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Data Statistik Desa</h2>
        <p class="text-gray-500 text-sm mt-1">
          Kelola data kependudukan dan demografi.
          <span v-if="hasData" class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
            Mode Edit
          </span>
          <span v-else class="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
            Mode Input Baru
          </span>
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchStatistik"
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
        >
          🔄 Ambil Ulang Data
        </button>

        <div v-if="isLoading" class="text-sm text-gray-500 animate-pulse">
          Memuat...
        </div>
      </div>
    </div>

    <!-- MESSAGE -->
    <div v-if="message.text"
         :class="[
           'p-4 rounded-md text-sm',
           message.type === 'success' ? 'bg-green-100 text-green-800' : '',
           message.type === 'error' ? 'bg-red-100 text-red-800' : ''
         ]">
      {{ message.text }}
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleSave" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label>Total Penduduk</label>
          <input v-model.number="form.total_penduduk" type="number" class="input" />
        </div>
        <div>
          <label>Kepala Keluarga</label>
          <input v-model.number="form.kepala_keluarga" type="number" class="input" />
        </div>
        <div>
          <label>Laki-laki</label>
          <input v-model.number="form.laki_laki" type="number" class="input" />
        </div>
        <div>
          <label>Perempuan</label>
          <input v-model.number="form.perempuan" type="number" class="input" />
        </div>
      </div>

      <div v-if="isGenderMismatch" class="text-red-600 text-sm">
        ⚠ Jumlah laki-laki + perempuan tidak sesuai dengan total penduduk.
      </div>

      <div class="flex justify-between pt-4">
        <button type="submit"
                :disabled="isSaving"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-60">
          {{ isSaving ? 'Menyimpan...' : 'Simpan Data' }}
        </button>

        <button v-if="hasData"
                type="button"
                @click="handleDelete"
                class="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Hapus Data
        </button>
      </div>

    </form>

  </div>
</template>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 0.5rem;
  border-radius: 0.375rem;
}
</style>
