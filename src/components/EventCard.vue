<template>
  <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
    
    <!-- Image -->
    <div class="relative h-52 bg-zinc-200 overflow-hidden">
      <img
        v-if="event.images && event.images.length > 0"
        :src="event.images[0]?.url"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        alt="Event image"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
        <CalendarDays class="w-16 h-16 text-white/20" />
      </div>

      <!-- Category -->
      <div class="absolute top-4 left-4 bg-white/95 text-xs font-bold px-3 py-1 rounded-full shadow-sm text-brand-blue">
        {{ categoryLabel }}
      </div>

      <!-- Price -->
      <div class="absolute top-4 right-4 bg-white/95 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
        {{ event.isPaid && event.price ? `$${event.price}` : 'Free' }}
      </div>
    </div>

    <div class="p-6">
      <h3 class="font-bold text-xl leading-tight mb-3 line-clamp-2 text-gray-900 group-hover:text-brand-blue transition-colors">
        {{ event.title }}
      </h3>

      <p class="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
        {{ event.description }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-6">
        <div class="flex items-center gap-1.5">
          <MapPin class="w-3.5 h-3.5" />
          <span class="truncate">{{ event.location || 'Online' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Clock class="w-3.5 h-3.5" />
          <span>{{ event.duration }} min</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between border-t border-gray-100 pt-5">

        <!-- Like -->
        <button
          @click.stop="toggleLike"
          class="flex items-center gap-2 text-sm font-medium transition-all active:scale-95"
          :class="event.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
        >
          <Heart 
            class="w-5 h-5 transition-all" 
            :class="event.isLiked ? 'fill-red-500' : ''"
          />
          <span>{{ event.likesCount || 0 }}</span>
        </button>

        <!-- Bookmark -->
        <button
          @click.stop="toggleBookmark"
          class="flex items-center gap-2 text-sm font-medium transition-all active:scale-95"
          :class="event.isBookmarked ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'"
        >
          <Bookmark 
            class="w-5 h-5 transition-all" 
            :class="event.isBookmarked ? 'fill-amber-500' : ''"
          />
        </button>

        <!-- Rating -->
        <div class="flex items-center gap-1 text-amber-500 text-sm">
          <Star class="w-4 h-4 fill-amber-400" />
          <span>{{ event.avgRating ? event.avgRating.toFixed(1) : '—' }}</span>
        </div>

        <!-- View -->
        <NuxtLink 
          :to="`/events/${event.id}`"
          class="text-brand-blue font-semibold text-sm hover:underline flex items-center gap-1"
        >
          View 
          <ArrowRight class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapPin, Clock, Heart, Bookmark, Star, ArrowRight, CalendarDays } from 'lucide-vue-next'
import { useEventsStore } from '../stores/eventsStore'
import { getEventCategoryLabel } from '../utils/categoryFormatter'

const props = defineProps<{
  event: any
}>()

const eventsStore = useEventsStore()

const categoryLabel = computed(() => getEventCategoryLabel(props.event))

// Real interactions
const toggleLike = () => eventsStore.toggleLike(props.event.id)
const toggleBookmark = () => eventsStore.toggleBookmark(props.event.id)
</script>