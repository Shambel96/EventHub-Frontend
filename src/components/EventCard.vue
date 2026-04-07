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

      <!-- Category badge -->
      <div class="absolute top-4 left-4 bg-white/95 text-xs font-bold px-3 py-1 rounded-full shadow-sm text-brand-blue">
        {{ categoryLabel }}
      </div>

      <!-- Price badge -->
      <div class="absolute top-4 right-4 bg-white/95 text-xs font-bold px-3 py-1 rounded-full shadow-sm text-gray-700">
        {{ event.isPaid && event.price ? `$${event.price}` : 'Free' }}
      </div>
    </div>

    <!-- Body -->
    <div class="p-6">
      <h3 class="font-bold text-xl leading-tight mb-3 line-clamp-2 text-gray-900 group-hover:text-brand-blue transition-colors">
        {{ event.title }}
      </h3>

      <p class="text-gray-600 text-sm line-clamp-3 mb-5 leading-relaxed">
        {{ event.description }}
      </p>

      <!-- Meta -->
      <div class="flex items-center justify-between text-xs text-gray-500 mb-6">
        <div class="flex items-center gap-1.5">
          <MapPin class="w-3.5 h-3.5 flex-shrink-0" />
          <span class="truncate max-w-[140px]">{{ event.location || 'Online' }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <Clock class="w-3.5 h-3.5 flex-shrink-0" />
          <span>{{ event.duration }} min</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between border-t border-gray-100 pt-5">

        <!-- Like -->
        <button
          @click.stop="toggleLike"
          class="flex items-center gap-1.5 text-sm transition-colors"
          :class="event.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
        >
          <Heart
            class="w-4 h-4 transition-all"
            :class="event.isLiked ? 'fill-red-500' : ''"
          />
          <span class="font-medium">{{ event.likesCount || 0 }}</span>
        </button>

        <!-- Bookmark -->
        <button
          @click.stop="toggleBookmark"
          class="flex items-center gap-1.5 text-sm transition-colors"
          :class="event.isBookmarked ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'"
        >
          <Bookmark
            class="w-4 h-4 transition-all"
            :class="event.isBookmarked ? 'fill-amber-500' : ''"
          />
        </button>

        <!-- Rating -->
        <div class="flex items-center gap-1 text-sm text-amber-500">
          <Star class="w-4 h-4 fill-amber-400" />
          <span class="font-medium text-gray-700">
            {{ event.avgRating ? event.avgRating.toFixed(1) : '—' }}
          </span>
        </div>

        <NuxtLink
          :to="`/events/${event.id}`"
          class="flex items-center gap-1 text-brand-blue font-semibold text-sm hover:underline"
        >
          View
          <ArrowRight class="w-3.5 h-3.5" />
        </NuxtLink>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Clock, Heart, Bookmark, Star, ArrowRight, CalendarDays } from 'lucide-vue-next'
import { useEventsStore } from '../stores/eventsStore'
import { getEventCategoryLabel } from '../utils/categoryFormatter'

const props = defineProps<{ event: any }>()

const eventsStore = useEventsStore()

const categoryLabel = computed(() => getEventCategoryLabel(props.event))

const toggleLike     = () => eventsStore.toggleLike(props.event.id)
const toggleBookmark = () => eventsStore.toggleBookmark(props.event.id)
</script>