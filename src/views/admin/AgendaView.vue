<template>
  <div class="p-6 bg-slate-50 min-h-screen font-montserrat">

    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Agenda Desa</h1>
        <p class="text-slate-500 text-sm">Jadwalkan musyawarah, kegiatan desa, dan acara penting.</p>
      </div>
      <button @click="openModal()"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5">
        <CalendarPlus class="w-5 h-5" />
        Buat Agenda
      </button>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 3" :key="n"
        class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse h-40"></div>
    </div>

    <div v-else-if="agendaList.length === 0"
      class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
      <div class="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar class="w-10 h-10 text-emerald-400" />
      </div>
      <h3 class="text-lg font-bold text-slate-700">Belum Ada Agenda</h3>
      <p class="text-slate-500 text-sm">Silakan tambahkan jadwal kegiatan baru.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in agendaList" :key="item.id"
        class="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
        <div v-if="item.pin"
          class="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
          PINNED
        </div>

        <div class="flex gap-5 items-start">
          <div
            class="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <span class="text-xs font-bold uppercase tracking-wide">{{ getMonth(item.tanggal) }}</span>
            <span class="text-2xl font-black">{{ getDay(item.tanggal) }}</span>
          </div>

          <div class="flex-grow">
            <h3
              class="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
              {{ item.title }}
            </h3>

            <div class="space-y-1.5">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <Clock class="w-3.5 h-3.5 text-emerald-500" />
                <span>{{ formatTime(item.waktu_mulai) }} - {{ formatTime(item.waktu_selesai) || 'Selesai' }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <MapPin class="w-3.5 h-3.5 text-emerald-500" />
                <span class="truncate max-w-[150px]">{{ item.lokasi || 'Lokasi menyusul' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-6 pt-4 border-t border-slate-50 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button @click="editAgenda(item)"
            class="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            <Edit3 class="w-3.5 h-3.5" /> Edit
          </button>
          <button @click="deleteAgenda(item.id)"
            class="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            <Trash2 class="w-3.5 h-3.5" /> Hapus
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">

        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
            <Calendar class="w-5 h-5 text-emerald-600" />
            {{ isEditing ? 'Edit Jadwal' : 'Tambah Agenda Baru' }}
          </h3>
          <button @click="closeModal" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X class="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-5">

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">Nama Kegiatan</label>
            <input v-model="form.title" type="text" required
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Contoh: Musrenbangdes 2026">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Tanggal</label>
              <input v-model="form.tanggal" type="date" required
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Lokasi</label>
              <input v-model="form.lokasi" type="text" placeholder="Balai Desa..."
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Mulai</label>
              <input v-model="form.waktu_mulai" type="time"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-1">Selesai</label>
              <input v-model="form.waktu_selesai" type="time"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none">
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <input v-model="form.pin" type="checkbox" id="pinned"
              class="w-5 h-5 text-amber-500 rounded focus:ring-amber-500 border-gray-300 cursor-pointer">
            <label for="pinned" class="text-sm font-bold text-slate-700 cursor-pointer flex-1">
              Pin Agenda Ini?
              <span class="block text-xs font-normal text-slate-500">Agenda akan muncul di halaman depan dashboard
                warga.</span>
            </label>
          </div>

          <div class="pt-2 flex justify-end gap-3">
            <button type="button" @click="closeModal"
              class="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Agenda' }}
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/service/apis';

import {
  CalendarPlus, Calendar, MapPin, Clock, Edit3, Trash2, X, Loader2
} from 'lucide-vue-next';

// --- CONFIG ---
const API_URL = '/agenda'; // ✅ FIXED

// --- STATE ---
const agendaList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const showModal = ref(false);
const isEditing = ref(false);

const form = reactive({
  id: null,
  title: '',
  tanggal: '',
  lokasi: '',
  waktu_mulai: '',
  waktu_selesai: '',
  pin: false
});

// --- API ACTIONS ---

// 1. Fetch Data
const fetchAgenda = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(`${api.defaults.baseURL}${API_URL}/`);
    if (!res.ok) throw new Error("Gagal mengambil data");

    const data = await res.json();
    agendaList.value = data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Gagal memuat agenda', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 2. Submit (Create / Update)
const submitForm = async () => {
  if (!form.title || !form.tanggal) {
    Swal.fire('Peringatan', 'Judul dan Tanggal wajib diisi', 'warning');
    return;
  }

  isSubmitting.value = true;
  try {
    const payload = {
      title: form.title,
      tanggal: form.tanggal,
      lokasi: form.lokasi,
      waktu_mulai: form.waktu_mulai || null,
      waktu_selesai: form.waktu_selesai || null,
      pin: form.pin
    };

    let res;
    let msg;

    if (isEditing.value) {
      res = await fetch(`${api.defaults.baseURL}${API_URL}/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      msg = 'Agenda berhasil diperbarui';
    } else {
      res = await fetch(`${api.defaults.baseURL}${API_URL}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      msg = 'Agenda baru ditambahkan';
    }

    if (!res.ok) throw new Error("Gagal menyimpan data");

    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: msg,
      timer: 1500,
      showConfirmButton: false
    });

    closeModal();
    fetchAgenda();

  } catch (error) {
    console.error(error);
    Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// 3. Delete
const deleteAgenda = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Agenda?',
    text: "Jadwal yang dihapus tidak bisa dikembalikan.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${api.defaults.baseURL}${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Gagal menghapus");

      Swal.fire('Terhapus', 'Agenda telah dihapus.', 'success');
      fetchAgenda();
    } catch (error) {
      Swal.fire('Error', 'Gagal menghapus data', 'error');
    }
  }
};

// --- HANDLERS ---

const openModal = () => {
  resetForm();
  isEditing.value = false;
  showModal.value = true;
};

const editAgenda = (item) => {
  isEditing.value = true;
  form.id = item.id;
  form.title = item.title;
  form.tanggal = item.tanggal;
  form.lokasi = item.lokasi;
  form.waktu_mulai = item.waktu_mulai ? item.waktu_mulai.substring(0, 5) : '';
  form.waktu_selesai = item.waktu_selesai ? item.waktu_selesai.substring(0, 5) : '';
  form.pin = item.pin;

  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.id = null;
  form.title = '';
  form.tanggal = new Date().toISOString().split('T')[0];
  form.lokasi = '';
  form.waktu_mulai = '';
  form.waktu_selesai = '';
  form.pin = false;
};

// --- HELPERS ---

const getMonth = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('id-ID', { month: 'short' });
};

const getDay = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getDate();
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5) + ' WIB';
};

// --- LIFECYCLE ---
onMounted(() => {
  fetchAgenda();
});
</script>


<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>