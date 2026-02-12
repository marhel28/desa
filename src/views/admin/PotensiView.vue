<template>
  <div class="p-4 md:p-6 bg-slate-50 min-h-screen font-montserrat selection:bg-emerald-100 selection:text-emerald-900">

    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 md:gap-6">
      <div class="animate-fade-in w-full md:w-auto">
        <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Katalog Potensi Desa</h1>
        <p class="text-slate-500 text-xs md:text-sm mt-1">Inventarisasi aset wisata, ekonomi kreatif, dan SDA.</p>
      </div>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <div class="relative flex-grow md:flex-grow-0">
          <Filter class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select v-model="filterKategori" @change="fetchData"
            class="pl-10 pr-8 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl outline-none shadow-sm hover:border-emerald-500 transition-all appearance-none cursor-pointer w-full">
            <option value="">Semua Sektor</option>
            <option v-for="cat in KATEGORI_OPTIONS" :key="cat" :value="cat">{{ formatEnum(cat) }}</option>
          </select>
        </div>

        <button @click="openModal()"
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95">
          <Plus class="w-5 h-5" /> Tambah Data
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
      <div v-for="n in 4" :key="n"
        class="bg-white rounded-3xl h-[420px] animate-pulse border border-slate-100 shadow-sm"></div>
    </div>

    <div v-else-if="filteredList.length === 0"
      class="flex flex-col items-center justify-center py-20 md:py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 mx-2 md:mx-0">
      <div class="bg-slate-50 p-6 rounded-full mb-4">
        <PackageSearch class="w-12 h-12 text-slate-300" />
      </div>
      <h3 class="text-slate-800 font-bold text-lg">Belum Ada Data Potensi</h3>
      <p class="text-slate-400 text-sm max-w-xs text-center mt-2">Mulai tambahkan potensi unggulan desa.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20">
      <div v-for="item in filteredList" :key="item.id"
        class="group bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full relative">
        
        <div class="h-48 md:h-56 bg-slate-100 relative overflow-hidden">
          <img :src="item.foto_path || 'https://images.unsplash.com/photo-1585829365234-781f8f4244ba?q=80'"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
          
          <div class="absolute top-4 left-4 flex flex-col gap-2">
            <span
              :class="`text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-widest text-white backdrop-blur-md ${getBadgeColor(item.kategori)}`">
              {{ formatEnum(item.kategori) }}
            </span>
          </div>

          <div
            class="hidden md:flex absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 items-center justify-center gap-3 backdrop-blur-[2px]">
            <button @click="editData(item)"
              class="bg-white text-emerald-600 p-3 rounded-2xl hover:scale-110 transition-transform shadow-xl" title="Edit Data">
              <Edit3 class="w-5 h-5" />
            </button>
            <button @click="deleteData(item.id)"
              class="bg-white text-red-500 p-3 rounded-2xl hover:scale-110 transition-transform shadow-xl" title="Hapus Data">
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="p-5 md:p-6 flex flex-grow flex-col">
          <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
            {{ formatEnum(item.jenis) }}
          </span>
          <h3 class="font-black text-slate-800 text-lg md:text-xl line-clamp-1 mb-2">{{ item.nama }}</h3>
          <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 md:mb-6">{{ item.deskripsi }}</p>
          
          <div class="mt-auto pt-4 md:pt-5 border-t border-slate-50 flex justify-between items-center">
            <div class="flex items-center gap-2 text-slate-400">
              <MapPin class="w-4 h-4 text-emerald-500 shrink-0" />
              <span class="text-[11px] font-bold uppercase truncate max-w-[100px]">{{ item.lokasi || 'Desa' }}</span>
            </div>
            <div class="text-right">
              <p class="text-[9px] text-slate-400 font-bold uppercase leading-none">Estimasi</p>
              <p class="text-sm font-black text-slate-900">{{ item.harga_min ? formatRupiah(item.harga_min) : 'Free' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
        <div class="absolute inset-0 bg-slate-900/80 backdrop-blur-md" @click="closeModal"></div>
        
        <div class="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden flex flex-col h-full md:h-auto md:max-h-[95vh] animate-modal-up">

          <div class="px-5 py-4 md:px-8 md:py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
            <h3 class="text-lg md:text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tighter">
              <div class="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                <Package class="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span>{{ isEditing ? 'Perbarui Data' : 'Tambah Potensi' }}</span>
            </h3>
            <button @click="closeModal" class="p-2 md:p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <X class="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
            </button>
          </div>

          <div class="p-5 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
            <form id="potensiForm" @submit.prevent="submitForm" class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">

              <div class="space-y-6">
                <div>
                  <label class="label-pro">Foto Galeri (Maksimal 3)</label>
                  <div v-if="!isEditing" class="space-y-3">
                    <div class="grid grid-cols-3 gap-2 md:gap-3">
                      <div v-for="(preview, index) in previewImages" :key="index"
                        class="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <img :src="preview" class="w-full h-full object-cover">
                        <button @click.prevent="removeImage(index)"
                          class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600">
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                      <div v-if="previewImages.length < 3"
                        class="relative group aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                        <input type="file" @change="handleFileUpload" accept="image/*" multiple class="absolute inset-0 opacity-0 z-20 cursor-pointer">
                        <ImagePlus class="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
                        <span class="text-[9px] font-bold text-slate-400 uppercase mt-1">Tambah</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <img :src="form.foto_path" class="w-16 h-16 rounded-xl object-cover shadow-sm bg-white">
                    <p class="text-[10px] text-emerald-800 font-bold uppercase leading-tight">Edit foto galeri hanya tersedia pada mode tambah baru.</p>
                  </div>
                </div>

                <div>
                  <label class="label-pro">Geotagging & Maps</label>
                  <div class="mb-3 relative">
                    <input v-model="manualGmapsUrl" @input="parseGmapsUrl" type="text" class="input-pro text-[11px] pr-10" placeholder="Tempel Link Google Maps untuk auto-tag...">
                    <MapPin class="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div id="mapPicker" class="w-full h-48 md:h-64 bg-slate-100 rounded-[1.5rem] border border-slate-200 overflow-hidden z-0"></div>
                  <div class="grid grid-cols-2 gap-3 mt-3">
                    <div class="space-y-1">
                        <span class="text-[9px] font-bold text-slate-400 ml-1">LATITUDE</span>
                        <input v-model="form.latitude" readonly class="input-pro text-[10px] py-2 bg-slate-100 border-none">
                    </div>
                    <div class="space-y-1">
                        <span class="text-[9px] font-bold text-slate-400 ml-1">LONGITUDE</span>
                        <input v-model="form.longitude" readonly class="input-pro text-[10px] py-2 bg-slate-100 border-none">
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4 md:space-y-5">
                <div>
                  <label class="label-pro">Informasi Dasar</label>
                  <input v-model="form.nama" type="text" required class="input-pro mb-3" placeholder="Nama Potensi/Produk">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select v-model="form.kategori" required class="input-pro">
                      <option value="" disabled>Sektor</option>
                      <option v-for="c in KATEGORI_OPTIONS" :key="c" :value="c">{{ formatEnum(c) }}</option>
                    </select>
                    <select v-model="form.jenis" required class="input-pro">
                      <option value="" disabled>Jenis</option>
                      <option v-for="j in JENIS_OPTIONS" :key="j" :value="j">{{ formatEnum(j) }}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="label-pro">Kontak & Lokasi</label>
                  <input v-model="form.pengelola" type="text" class="input-pro mb-3" placeholder="Nama Pengelola/Kontak Person">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="relative">
                      <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input v-model="form.kontak_wa" type="text" class="input-pro pl-10" placeholder="628xxx">
                    </div>
                    <input v-model="form.lokasi" type="text" class="input-pro" placeholder="Dusun/RT/RW">
                  </div>
                </div>

                <div>
                  <label class="label-pro">Skema Harga</label>
                  <div class="grid grid-cols-3 gap-2 md:gap-3">
                    <input v-model.number="form.harga_min" type="number" class="input-pro px-2" placeholder="Min (Rp)">
                    <input v-model.number="form.harga_max" type="number" class="input-pro px-2" placeholder="Max (Rp)">
                    <input v-model="form.satuan_harga" type="text" class="input-pro px-2" placeholder="/pax">
                  </div>
                </div>

                <div>
                  <label class="label-pro">Deskripsi Naratif</label>
                  <textarea v-model="form.deskripsi" rows="3" class="input-pro resize-none" placeholder="Ceritakan keunggulan potensi ini..."></textarea>
                </div>

                <div class="grid grid-cols-3 gap-3">
                  <label class="status-pill" :class="{ 'active': form.is_unggulan }">
                    <input type="checkbox" v-model="form.is_unggulan" class="hidden">⭐ Unggulan
                  </label>
                  <label class="status-pill" :class="{ 'active': form.is_aktif }">
                    <input type="checkbox" v-model="form.is_aktif" class="hidden">🟢 Aktif
                  </label>
                  <label class="status-pill" :class="{ 'active': form.is_published }">
                    <input type="checkbox" v-model="form.is_published" class="hidden">🌍 Publik
                  </label>
                </div>
              </div>
            </form>
          </div>

          <div class="px-5 py-4 md:px-8 md:py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
            <button @click="closeModal" class="px-4 py-3 font-bold text-slate-400 uppercase text-[10px]">Batal</button>
            <button @click="submitForm" :disabled="isSubmitting"
              class="bg-emerald-600 text-white px-6 md:px-10 py-3 rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-emerald-100 flex items-center gap-2 transition-all active:scale-95">
              <Loader2 v-if="isSubmitting" class="w-3 h-3 animate-spin" /> Simpan Data
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import Swal from 'sweetalert2';
import api from '@/service/apis';
import { Plus, Edit3, Trash2, X, Loader2, MapPin, ImagePlus, Filter, Phone, Package, PackageSearch } from 'lucide-vue-next';

// --- CONFIG ---
const API_URL = '/potensi';
const DEFAULT_LAT = -7.5635;
const DEFAULT_LNG = 110.0543;

// --- STATE ---
const rawList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const filterKategori = ref("");
const imageFiles = ref([]);
const previewImages = ref([]);
const manualGmapsUrl = ref("");
let map = null;
let marker = null;

const form = reactive({
  id: null, nama: '', kategori: '', jenis: '', deskripsi: '', lokasi: '',
  pengelola: '', kontak_wa: '', harga_min: null, harga_max: null, satuan_harga: '',
  foto_path: null, latitude: null, longitude: null, maps_url: '',
  is_unggulan: false, is_aktif: true, is_published: true
});

const KATEGORI_OPTIONS = ["WISATA", "EKONOMI_KREATIF", "PERTANIAN", "PETERNAKAN", "PERIKANAN", "KELEMBAGAAN", "LAINNYA"];
const JENIS_OPTIONS = ["WISATA_ALAM", "WISATA_BUATAN", "WISATA_BUDAYA", "KULINER", "KRIYA", "INDUSTRI_RUMAHAN", "AGRIKULTUR", "PERKEBUNAN", "PETERNAKAN", "PERIKANAN", "KELOMPOK_TANI", "BUMDES", "KOPERASI", "UMKM_LAINNYA", "LAINNYA"];

// --- LOGIC ---

const fetchData = async () => {
  isLoading.value = true;
  try {
    const r = await fetch(`${api.defaults.baseURL}${API_URL}/`);
    const data = await r.json();
    rawList.value = Array.isArray(data) ? data : []; 
  } catch (error) {
    rawList.value = [];
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  // 1. Validasi
  if (!isEditing.value && imageFiles.value.length === 0) {
    return Swal.fire('Error', 'Wajib mengunggah minimal 1 foto.', 'error');
  }

  // 2. Sinkronisasi Final Maps URL
  form.maps_url = manualGmapsUrl.value;

  isSubmitting.value = true;
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const endpoint = isEditing.value 
        ? `${API_URL}/${form.id}` 
        : `${API_URL}/with-gallery`;
    const url = `${api.defaults.baseURL}${endpoint}`;

    let body;
    let headers = {};

    if (!isEditing.value) {
      // POST DATA (FormData untuk Galeri)
      body = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'id' || key === 'foto_path') return;
        const val = form[key];
        // Pastikan null/undefined dikirim sebagai string kosong agar FastAPI tidak error
        body.append(key, (val === null || val === undefined) ? "" : val);
      });
      imageFiles.value.forEach(file => body.append('files', file));
    } else {
      // PUT DATA (JSON)
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(form);
    }

    const res = await fetch(url, { method, headers, body });
    
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.detail || "Gagal menyimpan data");
    }

    Swal.fire({ icon: 'success', title: 'Data Berhasil Disimpan', showConfirmButton: false, timer: 1500 });
    closeModal();
    fetchData();
  } catch (e) {
    Swal.fire({ icon: 'error', title: 'Terjadi Kesalahan', text: e.message });
  } finally {
    isSubmitting.value = false;
  }
};

// --- MAPS LOGIC ---
const parseGmapsUrl = () => {
  if (!manualGmapsUrl.value) return;

  // Pattern Google Maps: @lat,lng atau q=lat,lng
  const atRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const qRegex = /[?&](q|ll|query)=(-?\d+\.\d+),(-?\d+\.\d+)/;

  let lat, lng;
  const atMatch = manualGmapsUrl.value.match(atRegex);
  const qMatch = manualGmapsUrl.value.match(qRegex);

  if (atMatch) {
    lat = parseFloat(atMatch[1]);
    lng = parseFloat(atMatch[2]);
  } else if (qMatch) {
    lat = parseFloat(qMatch[2]);
    lng = parseFloat(qMatch[3]);
  }

  if (lat && lng) {
    placeMarker(lat, lng);
  }
};

const initMap = (lat = DEFAULT_LAT, lng = DEFAULT_LNG) => {
  if (!window.L || !document.getElementById('mapPicker')) return;
  if (map) map.remove();

  map = window.L.map('mapPicker', { zoomControl: true, attributionControl: false }).setView([lat, lng], 16);
  window.L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }).addTo(map);

  if (form.latitude && form.longitude) {
    placeMarker(form.latitude, form.longitude);
  }

  map.on('click', (e) => {
    placeMarker(e.latlng.lat, e.latlng.lng);
    manualGmapsUrl.value = `https://www.google.com/maps?q=${e.latlng.lat},${e.latlng.lng}`;
  });
};

const placeMarker = (lat, lng) => {
  if (!map) return;
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = window.L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      form.latitude = pos.lat;
      form.longitude = pos.lng;
      manualGmapsUrl.value = `https://www.google.com/maps?q=${pos.lat},${pos.lng}`;
    });
  }
  form.latitude = lat;
  form.longitude = lng;
  map.flyTo([lat, lng], 17);
};

// --- UTILS ---
const handleFileUpload = (e) => {
  const selectedFiles = Array.from(e.target.files);
  const remainingSlots = 3 - imageFiles.value.length;
  selectedFiles.slice(0, remainingSlots).forEach(file => {
    imageFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (ex) => previewImages.value.push(ex.target.result);
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
  previewImages.value.splice(index, 1);
};

const openModal = () => { resetForm(); showModal.value = true; nextTick(() => initMap()); };
const editData = (item) => {
  isEditing.value = true;
  Object.assign(form, item);
  manualGmapsUrl.value = item.maps_url || "";
  showModal.value = true;
  nextTick(() => initMap(item.latitude || DEFAULT_LAT, item.longitude || DEFAULT_LNG));
};
const closeModal = () => { showModal.value = false; if (map) map.remove(); map = null; marker = null; };
const resetForm = () => {
  isEditing.value = false;
  manualGmapsUrl.value = "";
  Object.assign(form, {
    id: null, nama: '', kategori: '', jenis: '', deskripsi: '', lokasi: '',
    pengelola: '', kontak_wa: '', harga_min: null, harga_max: null, satuan_harga: '',
    latitude: null, longitude: null, maps_url: '', is_unggulan: false, is_aktif: true, is_published: true
  });
  imageFiles.value = [];
  previewImages.value = [];
};

const deleteData = async (id) => {
  const res = await Swal.fire({ title: 'Hapus data?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus' });
  if (res.isConfirmed) {
    try {
      await fetch(`${api.defaults.baseURL}${API_URL}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { Swal.fire('Error', 'Gagal menghapus', 'error'); }
  }
};

const filteredList = computed(() => !filterKategori.value ? rawList.value : rawList.value.filter(i => i.kategori === filterKategori.value));
const formatEnum = (s) => s?.replace(/_/g, ' ') || '-';
const formatRupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
const getBadgeColor = (c) => ({ WISATA: 'bg-emerald-500', EKONOMI_KREATIF: 'bg-amber-500', PERTANIAN: 'bg-lime-600' }[c] || 'bg-slate-500');

onMounted(() => {
  if (!window.L) {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(s);
  }
  fetchData();
});
</script>

<style scoped>
.shadow-soft { box-shadow: 0 10px 30px -15px rgba(0, 0, 0, 0.1); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes modalUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-modal-up { animation: modalUp 0.4s ease-out forwards; }

</style>