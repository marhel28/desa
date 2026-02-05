<script setup>
import { ref, reactive, onMounted } from 'vue';
import api from '@/service/apis';
import { 
  Save, Trash2, UploadCloud, Info, Map as MapIcon, 
  UserCircle, Phone, Mail, Globe, CheckCircle, AlertCircle, X 
} from 'lucide-vue-next';

// --- STATE ---
const isLoading = ref(false);
const isUploading = ref(false); 
const message = reactive({ type: '', text: '' });

const defaultState = {
  nama_desa: 'Desa Sidomukti',
  luas_wilayah: 0,
  sejarah_desa: '',
  visi: '',
  misi: '',
  logo_desa_path: null,
  cover_desa_path: [], // Disimpan sebagai Array di Frontend
  master_kata: '',
  periode_kades: '',
  kata_kades: '',
  batas_utara: '',
  batas_timur: '',
  batas_selatan: '',
  batas_barat: '',
  nomor_bumdes: '',
  nomor_desa: '',
  email_desa: '',
  link_transparansi: '',
  kades: '', sekdes: '', kaur_perencanaan: '', kaur_keuangan: '',
  kasi_pemerintahan: '', kasi_kesra: '', kadus_1: '', kadus_2: '',
  foto_kades_path: null, foto_sekdes_path: null, foto_kaur_perencanaan_path: null,
  foto_kaur_keuangan_path: null, foto_kasi_pemerintahan_path: null,
  foto_kasi_kesra_path: null, foto_kadus_1_path: null, foto_kadus_2_path: null
};

const form = reactive({ ...defaultState });

// --- METHODS ---
const fetchProfilDesa = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/desa');
    if (response.data) {
      const data = response.data;
      // Konversi string "url1,url2" dari DB menjadi Array untuk UI
      if (data.cover_desa_path && typeof data.cover_desa_path === 'string') {
        data.cover_desa_path = data.cover_desa_path.split(',').filter(url => url !== "");
      } else {
        data.cover_desa_path = [];
      }
      Object.assign(form, data);
    }
  } catch (error) {
    console.log("Input data baru diperlukan.");
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  isLoading.value = true;
  message.text = '';
  try {
    const payload = { ...form };
    // Pastikan array dikonversi ke string jika model DB-nya string
    payload.cover_desa_path = Array.isArray(form.cover_desa_path) 
                              ? form.cover_desa_path.join(',') 
                              : form.cover_desa_path;

    console.log("Sending payload:", payload); // DEBUG: Cek isi data sebelum kirim

    const response = await api.put('/desa/', payload);
    message.type = 'success';
    message.text = 'Profil Desa berhasil diperbarui!';
  } catch (error) {
    console.error("Error Detail:", error.response?.data); // DEBUG: Cek error dari FastAPI
    message.type = 'error';
    message.text = error.response?.data?.detail || 'Gagal menyimpan data.';
  } finally {
    isLoading.value = false;
  }
};

const handleDelete = async () => {
  if (!confirm("Hapus seluruh data profil? Tindakan ini tidak dapat dibatalkan.")) return;
  isLoading.value = true;
  try {
    await api.delete('/desa/');
    Object.assign(form, defaultState);
    message.type = 'success';
    message.text = 'Data berhasil direset.';
  } catch (error) {
    message.type = 'error';
    message.text = 'Gagal menghapus data.';
  } finally {
    isLoading.value = false;
  }
};

// Handle upload untuk single image (Logo & Foto Perangkat)
const handleFileChange = async (event, fieldModel, targetName) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    isUploading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', `${targetName}_${Date.now()}`);
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    form[fieldModel] = response.data.url;
  } catch (error) {
    alert(`Gagal upload: ${error.message}`);
  } finally {
    isUploading.value = false;
  }
};

// Handle upload khusus untuk Multiple Covers (Maks 3)
const handleCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  if (form.cover_desa_path.length >= 3) {
    alert("Maksimal 3 foto cover diperbolehkan.");
    return;
  }

  try {
    isUploading.value = true;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', `cover_banner_${Date.now()}`);

    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    form.cover_desa_path.push(response.data.url);
  } catch (error) {
    alert(`Gagal upload cover: ${error.message}`);
  } finally {
    isUploading.value = false;
  }
};

const removeCover = (index) => {
  form.cover_desa_path.splice(index, 1);
};

onMounted(fetchProfilDesa);
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
    <div class="max-w-5xl mx-auto">
      
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Konfigurasi Profil Desa</h1>
          <p class="text-slate-500 font-medium">Personalisasi identitas publik dan struktur pemerintahan.</p>
        </div>
        <div class="flex gap-3">
           <button @click="handleDelete" class="flex items-center gap-2 px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
             <Trash2 class="w-4 h-4" /> Reset
           </button>
        </div>
      </div>

      <Transition name="slide">
        <div v-if="message.text" :class="`mb-8 p-4 rounded-2xl border flex items-center gap-3 shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`">
          <CheckCircle v-if="message.type === 'success'" class="w-5 h-5" />
          <AlertCircle v-else class="w-5 h-5" />
          <span class="font-bold text-sm">{{ message.text }}</span>
        </div>
      </Transition>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="md:col-span-2 space-y-8">
            <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
              <div class="flex items-center gap-3 mb-6">
                <Info class="w-5 h-5 text-emerald-600" />
                <h3 class="font-black text-slate-800 uppercase tracking-widest text-sm">Identitas Utama</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="col-span-2">
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nama Resmi Desa</label>
                  <input v-model="form.nama_desa" type="text" required class="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"/>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Luas Wilayah (km²)</label>
                  <input v-model.number="form.luas_wilayah" type="number" step="0.01" class="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"/>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Periode Jabatan</label>
                  <input v-model="form.periode_kades" type="text" placeholder="2024 - 2030" class="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all"/>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 space-y-6">
              <div>
                <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Sejarah Desa</label>
                <textarea v-model="form.sejarah_desa" rows="5" class="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 text-slate-700 leading-relaxed"></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Visi</label>
                  <textarea v-model="form.visi" rows="3" class="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 text-sm"></textarea>
                </div>
                <div>
                  <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Misi</label>
                  <textarea v-model="form.misi" rows="3" class="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Pisahkan poin dengan koma (,)"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Logo Instansi</label>
              <div class="relative group aspect-square rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center justify-center">
                <img v-if="form.logo_desa_path" :src="form.logo_desa_path" class="w-full h-full object-contain p-4" />
                <UploadCloud v-else class="w-10 h-10 text-slate-300" />
                <input type="file" @change="(e) => handleFileChange(e, 'logo_desa_path', 'logo_desa')" class="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
            
            <div class="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
              <label class="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                Gallery Cover ({{ form.cover_desa_path.length }}/3)
              </label>
              
              <div class="space-y-4">
                <div v-for="(url, idx) in form.cover_desa_path" :key="idx" class="relative group aspect-video rounded-2xl overflow-hidden border border-slate-100">
                  <img :src="url" class="w-full h-full object-cover" />
                  <button @click.prevent="removeCover(idx)" class="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                    <X class="w-4 h-4" />
                  </button>
                </div>

                <div v-if="form.cover_desa_path.length < 3" class="relative group aspect-video rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-500 transition-all flex flex-col items-center justify-center">
                  <UploadCloud class="w-8 h-8 text-slate-300 group-hover:text-emerald-500" />
                  <span class="text-[10px] font-black text-slate-400 uppercase mt-2">Tambah Cover</span>
                  <input type="file" @change="handleCoverUpload" class="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <div class="flex items-center gap-3 mb-6 text-emerald-600">
              <MapIcon class="w-5 h-5" />
              <h3 class="font-black uppercase tracking-widest text-sm text-slate-800">Batas Wilayah</h3>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="dir in ['Utara', 'Timur', 'Selatan', 'Barat']" :key="dir">
                <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Arah {{ dir }}</label>
                <input v-model="form[`batas_${dir.toLowerCase()}`]" type="text" class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"/>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <div class="flex items-center gap-3 mb-6 text-emerald-600">
              <Phone class="w-5 h-5" />
              <h3 class="font-black uppercase tracking-widest text-sm text-slate-800">Kontak & Akses</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-4">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">No. Desa (WA)</label>
                  <input v-model="form.nomor_desa" type="text" placeholder="08..." class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"/>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Email Resmi</label>
                  <input v-model="form.email_desa" type="email" placeholder="@desa.id" class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"/>
                </div>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">No. BUMDes</label>
                  <input v-model="form.nomor_bumdes" type="text" placeholder="08..." class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"/>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-slate-400 uppercase mb-1">Link Transparansi</label>
                  <input v-model="form.link_transparansi" type="url" placeholder="https://..." class="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-bold"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div class="absolute top-0 right-0 p-12 opacity-10">
            <UserCircle class="w-40 h-40 text-white" />
          </div>
          <div class="relative z-10 flex flex-col md:flex-row gap-10">
            <div class="md:w-1/3">
               <h3 class="text-emerald-400 font-black uppercase tracking-widest text-xs mb-4">Sambutan Resmi</h3>
               <p class="text-white text-lg font-medium leading-relaxed italic">"{{ form.master_kata || 'Membangun desa dengan hati dan teknologi.' }}"</p>
               <input v-model="form.master_kata" placeholder="Slogan sambutan..." class="mt-4 w-full bg-white/10 border-none rounded-xl p-2 text-xs text-emerald-200" />
            </div>
            <div class="md:w-2/3">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Isi Pesan Kepala Desa</label>
              <textarea v-model="form.kata_kades" rows="5" class="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:ring-2 focus:ring-emerald-500 focus:bg-white/10 transition-all"></textarea>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-800 uppercase tracking-widest text-sm">Struktur Pemerintahan</h3>
            <span class="text-xs bg-slate-200 px-3 py-1 rounded-full font-bold text-slate-500">8 Posisi Terdaftar</span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(role, key) in {
              kades: 'Kepala Desa', sekdes: 'Sekretaris',
              kaur_perencanaan: 'Kaur Perencana', kaur_keuangan: 'Kaur Keuangan',
              kasi_pemerintahan: 'Kasi Pem.', kasi_kesra: 'Kasi Kesra',
              kadus_1: 'Kadus I', kadus_2: 'Kadus II'
            }" :key="key" class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div class="relative w-20 h-20 mx-auto mb-4">
                <img :src="form[`foto_${key}_path`] || `https://ui-avatars.com/api/?name=${form[key] || role}&background=random`" class="w-full h-full object-cover rounded-2xl border-4 border-slate-50 group-hover:border-emerald-100 transition-all shadow-sm" />
                <label class="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2 rounded-xl cursor-pointer hover:bg-emerald-700 shadow-lg border-2 border-white transition-all scale-90">
                  <UploadCloud class="w-3 h-3" />
                  <input type="file" @change="(e) => handleFileChange(e, `foto_${key}_path`, key)" class="hidden" />
                </label>
              </div>
              <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center mb-1">{{ role }}</p>
              <input v-model="form[key]" type="text" placeholder="Nama..." class="w-full text-center bg-transparent border-none p-0 focus:ring-0 font-black text-slate-800 placeholder:text-slate-300 text-sm"/>
            </div>
          </div>
        </div>

        <div class="sticky bottom-6 z-40 flex justify-center">
          <button type="submit" :disabled="isLoading || isUploading" class="flex items-center gap-3 px-10 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] rounded-full shadow-2xl shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95 disabled:bg-slate-400">
            <Save v-if="!isLoading" class="w-5 h-5" />
            <span v-if="isLoading" class="animate-pulse">Menyimpan...</span>
            <span v-else>Simpan Perubahan</span>
          </button>
        </div>

      </form>
    </div>

    <div v-if="isUploading" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div class="bg-white p-10 rounded-[3rem] shadow-2xl text-center space-y-6 animate-modal">
        <div class="relative w-24 h-24 mx-auto">
          <div class="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
          <UploadCloud class="absolute inset-0 m-auto w-10 h-10 text-emerald-600" />
        </div>
        <div>
          <h4 class="text-xl font-black text-slate-800 tracking-tight">Sedang Mengunggah</h4>
          <p class="text-slate-500 font-medium">Optimasi media dan sinkronisasi CDN...</p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f5f9; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #10b981; }

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.slide-enter-active, .slide-leave-active { transition: all 0.4s ease; }
.slide-enter-from { opacity: 0; transform: translateY(-10px); }

.animate-modal {
  animation: modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>