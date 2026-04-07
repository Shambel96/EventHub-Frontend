<template>
  <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
    <div class="relative h-52 bg-zinc-200 overflow-hidden">
      <img 
        v-if="event.images && event.images.length > 0" 
        :src="event.images[0]?.url" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        alt="Event image"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
        <span class="text-white text-6xl opacity-20">🎉</span>
      </div>

      <div class="absolute top-4 left-4 bg-white/95 text-xs font-bold px-3 py-1 rounded-full shadow-sm text-brand-blue">
        {{ categoryLabel }}
      </div>

      <!-- Price Badge -->
      <div class="absolute top-4 right-4 bg-white/95 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
        {{ event.isPaid && event.price ? `$${event.price}` : 'Free' }}
      </div>
    </div>

    <div class="p-6">
      <!-- Title -->
      <h3 class="font-bold text-xl leading-tight mb-3 line-clamp-2 text-gray-900 group-hover:text-brand-blue transition-colors">
        {{ event.title }}
      </h3>

      <!-- Description -->
      <p class="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
        {{ event.description }}
      </p>

      <!-- Meta Info -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-6">
        <div class="flex items-center gap-1.5">
          <span>📍</span>
          <span class="truncate max-w-[140px]">{{ event.location || 'Online' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span>⏱️</span>
          <span>{{ event.duration }} min</span>
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-gray-100 pt-5">
        <button 
          @click.stop="toggleLike"
          class="flex items-center gap-2 text-sm transition hover:text-red-500"
          :class="{ 'text-red-500': event.isLiked }"
        >
          <span class="text-xl">❤️</span>
          <span class="font-medium">{{ event.likesCount || 0 }}</span>
        </button>

        <button 
          @click.stop="toggleBookmark"
          class="flex items-center gap-2 text-sm transition hover:text-amber-500"
          :class="{ 'text-amber-500': event.isBookmarked }"
        >
          <span class="text-xl">🔖</span>
        </button>

        <div class="flex items-center gap-1 text-sm text-amber-500">
          <span>★</span>
          <span class="font-medium">{{ event.avgRating ? event.avgRating.toFixed(1) : '—' }}</span>
        </div>

        <NuxtLink 
          :to="`/events/${event.id}`" 
          class="text-brand-blue font-semibold text-sm hover:underline flex items-center gap-1"
        >
          View 
          <span class="text-xs">→</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventsStore } from '../stores/eventsStore';
import { computed } from 'vue';
import { getEventCategoryLabel } from '../utils/categoryFormatter';

const props = defineProps<{
  event: any;
}>();

const eventsStore = useEventsStore();

const categoryLabel = computed(() => getEventCategoryLabel(props.event));

const toggleLike = () => {
  eventsStore.toggleLike(props.event.id);
};

const toggleBookmark = () => {
  eventsStore.toggleBookmark(props.event.id);
};
</script>