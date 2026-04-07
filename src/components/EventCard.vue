<template>
  <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <!-- Image Header -->
    <div class="h-44 bg-gradient-to-br from-brand-blue to-blue-800 flex items-center justify-center p-4 relative group text-center overflow-hidden">
      <!-- Thumbnail fallback vs specific image -->
      <img v-if="event.images && event.images.length > 0" :src="event.images[0]?.url" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
      <div v-else class="absolute inset-0"></div>

      <h3 class="text-white text-xl font-bold tracking-wide z-10 drop-shadow-md text-brand-yellow px-2">{{ event.title }}</h3>
      <div class="absolute inset-0 bg-brand-blue/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Bookmark Pill positioned top right inside image -->
      <button @click.stop="eventsStore.toggleBookmark(event.id)" class="absolute top-3 right-3 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-1.5 rounded-full transition shadow text-white z-20">
         <svg :class="{ 'fill-brand-yellow text-brand-yellow': event.isBookmarked }" class="w-5 h-5 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
      </button>
      <!-- Rating Pill positioned top left inside image -->
      <div class="absolute top-3 left-3 bg-white/90 text-yellow-500 px-2 py-1 rounded-full text-xs font-bold flex items-center shadow z-20">
         <svg class="w-3.5 h-3.5 mr-0.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
         {{ event.avgRating?.toFixed(1) ?? '—' }}
      </div>
    </div>
    
    <div class="p-5 flex flex-col justify-between min-h-[15rem]">
      <div>
        <p class="text-sm text-gray-600 line-clamp-2 mb-2 leading-relaxed">{{ event.description }}</p>
        <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-brand-yellow/20 text-brand-blue border border-brand-yellow/30 mb-2">
          {{ categoryLabel }}
        </span>
      </div>
      
      <div class="mt-auto">
        <!-- Stats Row -->
        <div class="flex flex-col gap-2 mb-3">
          <div class="flex items-center justify-between text-sm text-gray-500 font-medium">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ event.duration }}
            </span>
            <span class="font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
              {{ !event.isPaid ? 'Free' : (event.price ? `$${event.price}` : 'Paid') }}
            </span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <svg class="w-4 h-4 text-brand-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="truncate">{{ event.location }}</span>
          </div>
        </div>
        
        <!-- Social Interactions Row -->
        <div class="flex gap-5 items-center mb-4 border-t border-gray-100 pt-3">
          <button @click.stop="eventsStore.toggleLike(event.id)" :class="{'text-pink-500': event.isLiked, 'text-gray-400': !event.isLiked}" class="flex items-center gap-1.5 hover:text-pink-400 transition text-sm font-semibold group">
            <svg :class="{'fill-pink-500': event.isLiked}" class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span>{{ event.likesCount }}</span>
          </button>
          
          <div class="flex items-center gap-1.5 text-gray-400 text-sm font-semibold hover:text-brand-blue transition cursor-pointer group">
            <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            <span>{{ event.commentsCount }}</span>
          </div>
        </div>

        <!-- Action Button -->
        <NuxtLink :to="'/events/' + event.id" class="w-full bg-brand-blue text-white py-2.5 rounded-lg font-semibold hover:bg-blue-900 transition flex items-center justify-center gap-2 shadow-sm hover:shadow">
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Event } from '../types/event';
import { useEventsStore } from '../stores/eventsStore';
import { computed } from 'vue';
import { getEventCategoryLabel } from '../utils/categoryFormatter';

const props = defineProps<{
  event: Event;
}>();

const eventsStore = useEventsStore();
const categoryLabel = computed(() => getEventCategoryLabel(props.event));
</script>
