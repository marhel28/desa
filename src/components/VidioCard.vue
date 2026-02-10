<template>
    <article 
      class="group relative bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 w-full max-w-md md:max-w-2xl mx-auto flex flex-col md:flex-row"
      aria-labelledby="video-title"
    >
      
      <div class="relative w-full md:w-5/12 aspect-video md:aspect-auto overflow-hidden bg-slate-100">
        <img 
          :src="thumbnailUrl" 
          :alt="`Thumbnail video ${videoTitle}`"
          loading="lazy"
          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
  
        <a 
          :href="link" 
          target="_blank" 
          rel="noopener noreferrer"
          class="absolute inset-0 flex items-center justify-center group/play"
          aria-label="Putar Video Profil Desa Sidomukti"
        >
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 group-hover/play:scale-110 group-hover/play:bg-emerald-500 group-hover/play:border-emerald-500 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white ml-1">
              <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
            </svg>
          </div>
        </a>
  
        <span class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md">
          05:47
        </span>
      </div>
  
      <div class="p-5 md:p-6 flex flex-col justify-center w-full md:w-7/12">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black tracking-widest uppercase border border-red-100">
            YouTube
          </span>
          <span class="flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-slate-300">
               <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5 .75.75 0 0 0 0 1.5Z" />
               <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
            </svg>
            <time datetime="2026-02-04">04 Feb 2026</time>
          </span>
        </div>
  
        <h3 id="video-title" class="text-lg md:text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">
          {{ videoTitle }}
        </h3>
  
        <p class="text-sm text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 md:mb-6">
          Menelusuri keindahan Desa Sidomukti, potensi wisata Ciblon Park, kerajinan bambu, dan kehidupan masyarakat yang asri.
        </p>
  
        <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
          <div class="flex items-center gap-2">
             <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
               <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             </div>
             <div class="flex flex-col">
               <span class="text-[10px] font-bold text-slate-700 uppercase">KPM 52 Unsiq</span>
               <span class="text-[9px] text-slate-400">Official Channel</span>
             </div>
          </div>
  
          <a 
            :href="link" 
            target="_blank" 
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Tonton
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  
  // Data Video
  const link = "https://youtu.be/9b_YKpaFlFI?si=SOwZdgs6pW54dHR5";
  const videoId = "9b_YKpaFlFI";
  const videoTitle = "Profile Desa Sidomukti";
  const description = "Jelajahi keindahan dan potensi Desa Sidomukti: Wisata Ciblon Park, Kerajinan Bambu, & Susu Kambing.";
  const uploadDate = "2026-02-04";
  
  // Mengambil Thumbnail Resolusi Tinggi
  const thumbnailUrl = computed(() => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  });
  
  // JSON-LD Structured Data untuk SEO Google Search (Rich Snippets)
  const injectJsonLd = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": videoTitle,
      "description": description,
      "thumbnailUrl": [
        `https://img.youtube.com/vi/${videoId}/default.jpg`,
        `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      ],
      "uploadDate": uploadDate,
      "duration": "PT5M47S", // Format ISO 8601 (5 menit 47 detik)
      "contentUrl": link,
      "embedUrl": `https://www.youtube.com/embed/${videoId}`,
      "interactionStatistic": {
        "@type": "InteractionCounter",
        "interactionType": { "@type": "WatchAction" },
        "userInteractionCount": 52 // Like count (contoh statis)
      }
    };
  
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  };
  
  onMounted(() => {
    injectJsonLd();
  });
  </script>
  
  <style scoped>
  /* Pastikan Anda sudah menginstall Tailwind CSS */
  </style>