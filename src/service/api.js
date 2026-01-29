// Konfigurasi Supabase
const SUPABASE_URL = "https://yqzcaajbxcfznyrwwdxi.supabase.co";
const ANON_KEY = "sb_publishable_wDtdY5XV-Id4I51RCVFbDg_A4Mb039X";

// Base URL untuk REST API Supabase
const BASE_URL = `${SUPABASE_URL}/rest/v1`;

// Header standar yang wajib ada
const headers = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  "Content-Type": "application/json"
};

/**
 * Fungsi Helper untuk mengambil data dari Supabase
 * @param {string} table - Nama tabel (contoh: 'user', 'berita')
 * @param {string} query - Query tambahan (contoh: 'select=*' atau 'id=eq.1')
 */
export const fetchSupabase = async (table, query = 'select=*') => {
  try {
    const response = await fetch(`${BASE_URL}/${table}?${query}`, {
      method: "GET",
      headers: headers
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
    
  } catch (err) {
    console.error("Supabase Fetch Error:", err);
    return { data: null, error: err.message };
  }
};

// Export konstanta jika ingin melakukan custom fetch manual di file lain
export { SUPABASE_URL, ANON_KEY, headers };