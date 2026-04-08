<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <!-- Hero Slideshow -->
    <HeroSlideshow />

    <!-- Platform Statistics Section -->
    <section class="py-12 bg-white relative z-10 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-6xl rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row justify-around items-center gap-8 px-8">
      <div class="text-center p-4">
        <h3 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-teal-500 mb-2">5,000+</h3>
        <p class="text-gray-500 font-bold tracking-widest uppercase text-xs">Total Events Hosted</p>
      </div>
      <div class="w-full md:w-px h-px md:h-16 bg-gray-200"></div>
      <div class="text-center p-4">
        <h3 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500 mb-2">120K+</h3>
        <p class="text-gray-500 font-bold tracking-widest uppercase text-xs">Monthly Attendees</p>
      </div>
      <div class="w-full md:w-px h-px md:h-16 bg-gray-200"></div>
      <div class="text-center p-4">
        <h3 class="text-5xl font-extrabold text-brand-blue mb-2">{{ eventsStore.events.length }}+</h3>
        <p class="text-gray-500 font-bold tracking-widest uppercase text-xs">New Features Posted</p>
      </div>
    </section>

    <!-- Featured Events Section -->
    <section class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="text-center mb-16">
        <div class="inline-block px-3 py-1 mb-4 rounded-full bg-brand-yellow/20 text-brand-blue font-bold text-xs tracking-wider uppercase">Trending</div>
        <h2 class="text-4xl md:text-5xl font-extrabold text-brand-blue mb-4">Discover Top Events</h2>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">Explore high-rated events curated by our community. Tap into the most vibrant experiences happening right now.</p>
      </div>

      <div v-if="eventsStore.isLoading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <EventCard 
          v-for="event in featuredEvents" 
          :key="event.id" 
          :event="event" 
        />
      </div>

      <div class="mt-16 text-center">
        <NuxtLink to="/events" class="inline-flex items-center gap-2 text-white bg-brand-blue border border-brand-blue px-8 py-3.5 rounded-xl font-bold hover:bg-white hover:text-brand-blue transition shadow-lg hover:shadow-xl group">
          View All Active Events
          <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import HeroSlideshow from '../components/HeroSlideshow.vue';
import EventCard from '../components/EventCard.vue';
import { useEventsStore } from '../stores/eventsStore';

const eventsStore = useEventsStore();
const featuredEvents = computed<any[]>(() => eventsStore.events.slice(0, 6));

onMounted(() => {
  eventsStore.fetchEvents();
});

useHead({
  title: 'EventHub | Premium Experiences',
  meta: [
    { name: 'description', content: 'EventHub is a modern platform to discover and manage events seamlessly powered by Vanta API.' }
  ]
})

</script>
