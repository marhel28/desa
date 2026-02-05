<template>
  <div class="p-6 bg-slate-50 min-h-screen font-montserrat">

    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Manajemen Berita</h1>
        <p class="text-slate-500 text-sm">Kelola pengumuman, kegiatan, dan layanan desa.</p>
      </div>
      <button @click="openModal()"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all">
        <Plus class="w-5 h-5" />
        Tambah Berita
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex items-center gap-4">
      <div class="relative flex-1">
        <Search class="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input v-model="searchQuery" @input="handleSearch" type="text" placeholder="Cari judul atau isi berita..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
      </div>
      <button @click="fetchBerita"
        class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th class="p-4 border-b border-slate-100">Cover</th>
              <th class="p-4 border-b border-slate-100">Judul & Penulis</th>
              <th class="p-4 border-b border-slate-100">Kategori</th>
              <th class="p-4 border-b border-slate-100 text-center">Tanggal</th>
              <th class="p-4 border-b border-slate-100 text-center">Status</th>
              <th class="p-4 border-b border-slate-100 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="isLoading" class="animate-pulse">
              <td colspan="6" class="p-8 text-center text-slate-400">Memuat data...</td>
            </tr>
            <tr v-else-if="beritaList.length === 0">
              <td colspan="6" class="p-8 text-center text-slate-500">Belum ada berita yang dipublikasikan.</td>
            </tr>
            <tr v-for="item in beritaList" :key="item.id" class="hover:bg-slate-50 transition-colors group">
              <td class="p-4 w-24">
                <img :src="item.image_url || 'https://via.placeholder.com/150?text=No+Image'"
                  class="w-16 h-16 object-cover rounded-lg shadow-sm bg-slate-200" alt="Cover" />
              </td>
              <td class="p-4 max-w-xs">
                <div class="font-bold text-slate-800 line-clamp-2">{{ item.title }}</div>
                <div class="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User class="w-3 h-3" /> {{ item.penulis }}
                </div>
              </td>
              <td class="p-4">
                <span :class="getBadgeClass(item.tipe)">
                  {{ item.tipe }}
                </span>
              </td>
              <td class="p-4 text-center text-sm text-slate-600">
                {{ formatDate(item.tanggal) }}
              </td>
              <td class="p-4 text-center">
                <div v-if="item.pinned"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold">
                  <Pin class="w-3 h-3 fill-amber-700" /> Pinned
                </div>
                <span v-else class="text-slate-400 text-xs">-</span>
              </td>
              <td class="p-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="editBerita(item)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button @click="deleteBerita(item.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>

      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">

        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-lg text-slate-800">
            {{ isEditing ? 'Edit Berita' : 'Tambah Berita Baru' }}
          </h3>
          <button @click="closeModal" class="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X class="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div class="p-6 overflow-y-auto custom-scrollbar">
          <form @submit.prevent="submitForm" class="space-y-6">

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div class="lg:col-span-1 space-y-4">
                <div>
                  <label class="block text-sm font-bold text-slate-700 mb-2">Cover Berita</label>
                  <div v-if="!isEditing"
                    class="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group min-h-[140px] flex flex-col items-center justify-center">
                    <input type="file" @change="handleFileUpload" accept="image/*"
                      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20">

                    <div v-if="previewImage" class="relative z-10 w-full h-full">
                      <img :src="previewImage" class="w-full h-32 object-cover rounded-lg shadow-sm">
                      <p class="text-xs text-emerald-600 mt-2 font-bold bg-white/80 inline-block px-2 py-1 rounded">
                        Ganti Foto</p>
                    </div>
                    <div v-else class="flex flex-col items-center gap-1 text-slate-400">
                      <ImageIcon class="w-8 h-8 group-hover:text-emerald-500 transition-colors" />
                      <span class="text-xs">Max 2MB</span>
                    </div>
                  </div>
                  <div v-else class="bg-slate-50 border border-slate-200 rounded-xl p-3 flex gap-3 items-center">
                    <img v-if="form.image_url" :src="form.image_url"
                      class="w-12 h-12 object-cover rounded-lg bg-white border">
                    <p class="text-xs text-slate-500 italic leading-tight">Foto tidak dapat diedit di mode cepat. Hapus
                      & buat baru jika perlu.</p>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Judul</label>
                  <input v-model="form.title" type="text" required class="input-field" placeholder="Judul berita...">
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Penulis</label>
                    <input v-model="form.penulis" type="text" required class="input-field">
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Kategori</label>
                    <select v-model="form.tipe" required class="input-field">
                      <option value="" disabled>Pilih...</option>
                      <option value="pengumuman">Pengumuman</option>
                      <option value="pembangunan">Pembangunan</option>
                      <option value="kegiatan">Kegiatan</option>
                      <option value="layanan">Layanan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 mb-1 uppercase">Tanggal</label>
                  <input v-model="form.tanggal" type="date" required class="input-field mb-3">

                  <div class="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <input v-model="form.pinned" type="checkbox" id="pinned"
                      class="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 border-gray-300">
                    <label for="pinned" class="text-xs font-bold text-slate-700 cursor-pointer">
                      Pin ke Atas?
                    </label>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-2 flex flex-col h-full min-h-[400px]">
                <label class="block text-sm font-bold text-slate-700 mb-2">Konten Berita</label>
                <div class="flex-grow bg-white rounded-xl border border-slate-300 overflow-hidden flex flex-col">
                  <QuillEditor v-model:content="form.isi" contentType="html" theme="snow" toolbar="essential"
                    class="flex-grow h-full" />
                </div>
              </div>

            </div>

          </form>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button @click="closeModal"
            class="px-5 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors">
            Batal
          </button>
          <button @click="submitForm" :disabled="isSubmitting"
            class="px-5 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
            {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Publikasikan') }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import Swal from 'sweetalert2';
import api from '@/service/apis'; // ✅ TAMBAH
import {
  Plus, Search, RefreshCw, User, Edit3, Trash2, X,
  Image as ImageIcon, Pin, Loader2
} from 'lucide-vue-next';

// --- IMPORT QUILL ---
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// --- CONFIG ---
const API_URL = '/berita'; // ✅ FIXED

// --- STATE ---
const beritaList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const searchQuery = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const previewImage = ref(null);
const imageFile = ref(null);

const form = reactive({
  id: null,
  title: '',
  penulis: '',
  tipe: '',
  tanggal: new Date().toISOString().split('T')[0],
  isi: '',
  pinned: false,
  image_url: null
});

// --- API ACTIONS ---

// 1. GET ALL
const fetchBerita = async () => {
  isLoading.value = true;
  try {
    const params = new URLSearchParams({ sort_by: 'tanggal', order: 'desc' });
    if (searchQuery.value) params.append('search', searchQuery.value);

    const res = await fetch(`${api.defaults.baseURL}${API_URL}/?${params}`);
    if (!res.ok) throw new Error("Gagal mengambil data");

    beritaList.value = await res.json();
  } catch (error) {
    console.error(error);
    Swal.fire('Error', 'Gagal memuat berita', 'error');
  } finally {
    isLoading.value = false;
  }
};

// 2. CREATE & UPDATE
const submitForm = async () => {
  const cleanContent = form.isi.replace(/<[^>]*>/g, '').trim();

  if (!form.title || !cleanContent || !form.penulis || !form.tipe) {
    Swal.fire('Peringatan', 'Mohon lengkapi semua field (Isi berita tidak boleh kosong)', 'warning');
    return;
  }

  isSubmitting.value = true;

  try {
    if (isEditing.value) {
      const payload = {
        title: form.title,
        isi: form.isi,
        penulis: form.penulis,
        tipe: form.tipe,
        tanggal: form.tanggal,
        pinned: form.pinned
      };

      const res = await fetch(`${api.defaults.baseURL}${API_URL}/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Gagal update berita");
      Swal.fire('Sukses', 'Berita berhasil diperbarui', 'success');

    } else {
      if (imageFile.value) {
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('isi', form.isi);
        formData.append('penulis', form.penulis);
        formData.append('tipe', form.tipe);
        formData.append('tanggal', form.tanggal);
        formData.append('pinned', form.pinned);
        formData.append('file', imageFile.value);

        const res = await fetch(`${api.defaults.baseURL}${API_URL}/with-image`, {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Gagal upload berita");
        }

      } else {
        const payload = {
          title: form.title,
          isi: form.isi,
          penulis: form.penulis,
          tipe: form.tipe,
          tanggal: form.tanggal,
          pinned: form.pinned
        };

        const res = await fetch(`${api.defaults.baseURL}${API_URL}/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Gagal membuat berita");
      }

      Swal.fire('Sukses', 'Berita berhasil diterbitkan', 'success');
    }

    closeModal();
    fetchBerita();

  } catch (error) {
    console.error(error);
    Swal.fire('Gagal', error.message, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

// 3. DELETE
const deleteBerita = async (id) => {
  const result = await Swal.fire({
    title: 'Hapus Berita?',
    text: "Data hilang permanen",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus'
  });

  if (result.isConfirmed) {
    try {
      const res = await fetch(`${api.defaults.baseURL}${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error("Gagal menghapus");
      Swal.fire('Terhapus!', '', 'success');
      fetchBerita();
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
    }
  }
};

// --- HANDLERS ---
const handleSearch = () => { setTimeout(() => fetchBerita(), 500); };

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) return Swal.fire('Error', 'Max 2MB', 'error');
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => previewImage.value = e.target.result;
    reader.readAsDataURL(file);
  }
};

const openModal = () => { resetForm(); isEditing.value = false; showModal.value = true; };

const editBerita = (item) => {
  isEditing.value = true;
  form.id = item.id;
  form.title = item.title;
  form.penulis = item.penulis;
  form.tipe = item.tipe;
  form.tanggal = item.tanggal;
  form.isi = item.isi;
  form.pinned = item.pinned;
  form.image_url = item.image_url;
  imageFile.value = null;
  previewImage.value = null;
  showModal.value = true;
};

const closeModal = () => { showModal.value = false; resetForm(); };

const resetForm = () => {
  form.id = null;
  form.title = '';
  form.penulis = '';
  form.tipe = '';
  form.tanggal = new Date().toISOString().split('T')[0];
  form.isi = '';
  form.pinned = false;
  form.image_url = null;
  imageFile.value = null;
  previewImage.value = null;
};

// --- HELPERS ---
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

const getBadgeClass = (tipe) => {
  const base = "px-2 py-1 rounded text-xs font-bold uppercase tracking-wider";
  switch (tipe) {
    case 'pengumuman': return `${base} bg-blue-100 text-blue-700`;
    case 'pembangunan': return `${base} bg-amber-100 text-amber-700`;
    case 'kegiatan': return `${base} bg-emerald-100 text-emerald-700`;
    case 'layanan': return `${base} bg-purple-100 text-purple-700`;
    default: return `${base} bg-slate-100 text-slate-700`;
  }
};

onMounted(() => fetchBerita());
</script>


<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

/* Styling Quill Editor agar lebih tinggi */
:deep(.ql-editor) {
  min-height: 300px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
}

:deep(.ql-toolbar) {
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

:deep(.ql-container) {
  border: none;
}
</style>