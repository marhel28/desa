<template>
    <transition name="bubble">
      <button
        v-show="isVisible"
        @click="scrollToTop"
        class="fixed z-[999] bottom-6 right-6 md:bottom-10 md:right-10 p-3 md:p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-500/40 border border-emerald-400/20 backdrop-blur-sm group transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
        aria-label="Kembali ke atas"
      >
        <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping group-hover:opacity-40"></span>
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="3" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="w-5 h-5 md:w-6 md:h-6 relative z-10 group-hover:-translate-y-1 transition-transform duration-300"
        >
          <path d="m18 15-6-6-6 6"/>
        </svg>
      </button>
    </transition>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const isVisible = ref(false);
  
  const checkScroll = () => {
    // Muncul jika scroll lebih dari 300px
    isVisible.value = window.scrollY > 300;
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  onMounted(() => {
    window.addEventListener('scroll', checkScroll);
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll);
  });
  </script>
  
  <style scoped>
  /* Animasi Bubble Pop Up */
  .bubble-enter-active,
  .bubble-leave-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .bubble-enter-from,
  .bubble-leave-to {
    opacity: 0;
    transform: translateY(50px) scale(0.5);
  }
  
  .bubble-enter-to,
  .bubble-leave-from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  </style>