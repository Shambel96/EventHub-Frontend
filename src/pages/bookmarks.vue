<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-gray-200 pb-6">
      <div>
        <h1 class="text-4xl font-extrabold text-brand-blue mb-2 flex items-center gap-3">
          <svg class="w-8 h-8 text-brand-yellow" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
          Your Bookmarks
        </h1>
        <p class="text-gray-600 text-lg">Events you have saved for later.</p>
      </div>
      <div>
        <NuxtLink to="/events?focusSearch=true" class="inline-block bg-white text-brand-blue border-2 border-brand-blue px-6 py-2.5 rounded-lg font-bold shadow hover:bg-blue-50 transition">
          Discover More Events
        </NuxtLink>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="eventsStore.isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="eventsStore.bookmarkedEvents.length === 0" class="text-center py-24 bg-white border-2 border-dashed border-gray-200 rounded-2xl shadow-sm max-w-2xl mx-auto">
      <svg class="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
      <h3 class="text-2xl font-bold text-gray-800 mb-3">No Bookmarks Yet</h3>
      <p class="text-gray-500 mb-8 max-w-md mx-auto">You haven't saved any events to your collection. Explore the discovery feed, find something exciting, and click the bookmark icon to save it here!</p>
      <NuxtLink to="/events" class="inline-block bg-brand-blue text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all">
        Explore Events
      </NuxtLink>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <EventCard 
        v-for="event in eventsStore.bookmarkedEvents" 
        :key="event.id" 
        :event="event" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useEventsStore } from '../stores/eventsStore';
import EventCard from '../components/EventCard.vue';

const eventsStore = useEventsStore();

onMounted(() => {
  if (eventsStore.events.length === 0) {
    eventsStore.fetchEvents();
  }
});
</script>
