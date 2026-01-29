<template>
    
    <footer class="bg-slate-900 text-slate-300 border-t-4 border-emerald-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div class="space-y-4">
            <h3 class="text-white text-lg font-bold flex items-center gap-2">
              <span class="bg-emerald-600 text-white p-1 rounded">DS</span>
              Desa Sidomukti
            </h3>
            <p class="text-sm leading-relaxed text-slate-400">
              Website resmi Pemerintah Desa Sidomukti, Kecamatan Purworejo. Sumber informasi terpercaya untuk kemajuan bersama.
            </p>
            <div class="flex gap-4 pt-2">
               <a href="#" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white">FB</a>
               <a href="#" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white">IG</a>
               <a href="#" class="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors text-white">YT</a>
            </div>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Jelajahi</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Profil Desa</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Lembaga Kemasyarakatan</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Data Kependudukan</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Peta Wilayah</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Layanan</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Surat Keterangan</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Pengaduan Masyarakat</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Cek Bantuan Sosial</a></li>
              <li><a href="#" class="hover:text-emerald-400 transition-colors">Info Pajak (PBB)</a></li>
            </ul>
          </div>

          <div>
            <h4 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Kontak Kami</h4>
            <ul class="space-y-3 text-sm">
              <li class="flex items-start gap-3">
                <MapPin class="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Jl. Raya Sidomukti No. 45, Purworejo, Jawa Tengah 54111</span>
              </li>
              <li class="flex items-center gap-3">
                <Megaphone class="w-5 h-5 text-emerald-500 shrink-0" />
                <span>(0275) 1234567</span>
              </li>
              <li class="flex items-center gap-3">
                <div class="w-5 h-5 flex items-center justify-center text-emerald-500 shrink-0">@</div>
                <span>admin@sidomukti.desa.id</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
      
      <div class="bg-slate-950 py-6 text-center text-xs text-slate-500 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p>&copy; 2024 Pemerintah Desa Sidomukti. Hak Cipta Dilindungi.</p>
          <div class="flex gap-4">
             <a href="#" class="hover:text-white">Kebijakan Privasi</a>
             <a href="#" class="hover:text-white">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
</template>