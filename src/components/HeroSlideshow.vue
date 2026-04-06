<template>
  <div class="relative w-full h-[80vh] overflow-hidden bg-gray-900 group font-sans">
    <transition-group name="fade" tag="div" class="w-full h-full relative">
      <div 
        v-for="(slide, index) in slides" 
        :key="slide.id"
        v-show="currentSlide === index"
        class="absolute inset-0 w-full h-full flex flex-col justify-center items-center text-center p-6"
        :class="slide.bgClass"
      >
        <div class="z-10 animate-slide-up max-w-4xl">
          <h2 class="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight leading-tight">{{ slide.title }}</h2>
          <p class="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow line-height-relaxed">{{ slide.description }}</p>
          <NuxtLink :to="slide.link" class="inline-block bg-brand-yellow text-brand-blue px-10 py-4 rounded-xl font-bold md:text-lg hover:bg-yellow-400 hover:-translate-y-1 transition duration-300 shadow-xl">
            {{ slide.cta }}
          </NuxtLink>
        </div>
        <!-- Tint Overlay for readability -->
        <div class="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>
    </transition-group>
    
    <!-- Controls -->
    <div class="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        @click="currentSlide = index"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="currentSlide === index ? 'bg-brand-yellow w-8' : 'bg-white/50 hover:bg-white'"
      ></button>
    </div>
    
    <!-- Arrows -->
    <button @click="prev" class="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition duration-300 z-20">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
    </button>
    <button @click="next" class="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition duration-300 z-20">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const currentSlide = ref(0);
let timer: ReturnType<typeof setInterval>;

// Placeholder slides featuring CSS gradients until real images are added
const slides = [
  {
    id: 1,
    title: 'Experience Unforgettable Events',
    description: 'Join thousands of innovators and thought leaders across the globe. Get ready for seamless entry to premier events.',
    bgClass: 'bg-gradient-to-br from-brand-blue to-teal-900',
    cta: 'Explore All Events',
    link: '/events'
  },
  {
    id: 2,
    title: 'Top-Rated Local Masterclasses',
    description: 'Elevate your skills and learn directly from industry proven experts in our interactive workshops.',
    bgClass: 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-brand-blue',
    cta: 'Find Workshops',
    link: '/events'
  },
  {
    id: 3,
    title: 'Your Ultimate Festival Pass',
    description: 'Unlock exclusive access to top-tier music and entertainment festivals happening around you this season.',
    bgClass: 'bg-gradient-to-bl from-blue-900 to-gray-900',
    cta: 'Book Now',
    link: '/events'
  }
];

const next = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prev = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

onMounted(() => {
  // Rotate every 5 seconds
  timer = setInterval(next, 5000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
}
@keyframes slideUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}
</style>
