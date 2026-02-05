// src/service/supabase.js
import { createClient } from '@supabase/supabase-js';

// Konfigurasi dari prompt Anda
const SUPABASE_URL = 'https://yqzcaajbxcfznyrwwdxi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxemNhYWpieGNmem55cnd3ZHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMzIxNzUsImV4cCI6MjA4MzcwODE3NX0.1lTo1hqUn88KTIBExmrsfdoejMoqiw18zBU_m8_RD7Q';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload Image to Supabase Storage
 * @param {File} file - File object dari input type file
 * @param {String} fileName - Nama file yang diinginkan (tanpa ekstensi), misal: 'kades'
 * @returns {Promise<String>} - URL Publik gambar
 */
export const uploadDesaImage = async (file, fileName) => {
  // 1. Validasi Ukuran (Max 2MB)
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran file maksimal 2MB.');
  }

  // 2. Tentukan Ekstensi dan Path
  const fileExt = file.name.split('.').pop();
  // Path: desa/struktur/nama_file.ext
  const filePath = `struktur/${fileName}.${fileExt}`;

  try {
    // 3. Upload (Upsert = true agar menimpa file lama jika ada)
    const { data, error } = await supabase.storage
      .from('Desa') 
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true 
      });

    if (error) throw error;

    // 4. Ambil Public URL
    const { data: publicData } = supabase.storage
      .from('desa')
      .getPublicUrl(filePath);

    return publicData.publicUrl;

  } catch (error) {
    console.error('Supabase Upload Error:', error);
    throw error;
  }
};

export default supabase;