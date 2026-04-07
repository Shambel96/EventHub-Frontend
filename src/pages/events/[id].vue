<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <!-- Loading -->
    <div v-if="eventsStore.isLoading" class="max-w-4xl mx-auto flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Event Content -->
    <div v-else-if="event" class="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm overflow-hidden">
      
      <!-- Hero Image -->
      <div class="h-80 sm:h-96 bg-gray-200 relative">
        <img 
          v-if="event.images && event.images.length > 0" 
          :src="event.images[0]?.url" 
          class="w-full h-full object-cover"
          alt="Event banner"
        />
        <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
          <!-- Fallback Image Icon -->
          <svg class="w-20 h-20 opacity-50 mb-2" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <span class="text-white/70 font-medium">No Image Available</span>
        </div>

        <!-- Category & Price Badge -->
        <div class="absolute top-6 left-6 bg-white px-4 py-2 rounded-2xl shadow font-bold text-sm">
          {{ event.category?.name || 'Event' }}
        </div>
        <div class="absolute top-6 right-6 bg-white px-5 py-2 rounded-2xl shadow font-bold">
          {{ event.isPaid ? `$${event.price}` : 'Free' }}
        </div>
      </div>

      <div class="p-8 sm:p-12">
        <h1 class="text-4xl font-bold text-gray-900 leading-tight mb-6">{{ event.title }}</h1>

        <!-- Details Grid -->
        <div class="flex flex-wrap items-center gap-x-8 gap-y-4 text-gray-600 mb-10">
          <!-- Location Icon -->
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span>{{ event.location || 'Online' }}</span>
          </div>
          
          <!-- Calendar Icon -->
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span>{{ new Date(event.date || event.startDate).toLocaleDateString() }}</span>
          </div>

          <!-- Clock Icon -->
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ event.duration }} minutes</span>
          </div>
        </div>

        <p class="text-lg text-gray-700 leading-relaxed mb-12 whitespace-pre-line">
          {{ event.description }}
        </p>

        <!-- Interaction Bar -->
        <div class="flex items-center justify-between border-y border-gray-100 py-6 mb-12">
          
          <div class="flex items-center gap-6">
            <!-- Like Button -->
            <button 
              @click="toggleLike"
              class="group flex items-center gap-2 transition active:scale-95"
              :class="event.hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
            >
              <svg 
                class="w-7 h-7 transition-transform group-hover:scale-110" 
                :fill="event.hasLiked ? 'currentColor' : 'none'" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span class="text-base font-medium text-gray-700">{{ event.likesCount || 0 }}</span>
            </button>

            <!-- Bookmark Button -->
            <button 
              @click="toggleBookmark"
              class="group flex items-center gap-2 transition active:scale-95"
              :class="event.hasBookmarked ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-500'"
            >
              <svg 
                class="w-7 h-7 transition-transform group-hover:scale-110" 
                :fill="event.hasBookmarked ? 'currentColor' : 'none'" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              <span class="text-sm font-medium text-gray-700">Save</span>
            </button>
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-2">
            <div class="flex" @mouseleave="hoverRating = 0">
              <button
                v-for="star in 5"
                :key="star"
                @mouseover="hoverRating = star"
                @click="rateEvent(star)"
                class="transition-transform active:scale-90 p-0.5"
                :class="star <= (hoverRating || event.userRating || Math.floor(event.averageRating || 0)) ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-200'"
              >
                <!-- Star Icon -->
                <svg 
                  class="w-7 h-7" 
                  :fill="star <= (hoverRating || event.userRating || Math.floor(event.averageRating || 0)) ? 'currentColor' : 'none'" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385c.148.621-.531 1.121-1.097.82l-4.644-2.464a.562.562 0 00-.546 0l-4.644 2.464c-.566.301-1.245-.199-1.097-.82l1.285-5.385a.563.563 0 00-.182-.557l-4.204-3.602c-.38-.325-.178-.948.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </button>
            </div>
            <span class="text-sm text-gray-500 font-medium ml-1">
              {{ event.averageRating ? event.averageRating.toFixed(1) : '0.0' }} 
              ({{ event.totalRatings }})
            </span>
          </div>
        </div>

        <!-- Comments Section -->
        <div>
          <h3 class="text-2xl font-bold mb-6">Comments ({{ event.comments?.length || 0 }})</h3>

          <!-- Comment Form -->
          <form @submit.prevent="submitComment" class="mb-10">
            <textarea 
              v-model="newComment"
              rows="3"
              class="w-full border border-gray-200 rounded-2xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none outline-none transition-all"
              placeholder="Share your thoughts about this event..."
              required
            ></textarea>
            <div class="flex justify-end mt-3">
              <button 
                type="submit"
                :disabled="isSubmittingComment || !newComment.trim()"
                class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold rounded-2xl transition-colors"
              >
                {{ isSubmittingComment ? 'Posting...' : 'Post Comment' }}
              </button>
            </div>
          </form>

          <!-- Comments List -->
          <div class="space-y-8">
            <div v-for="comment in event.comments" :key="comment.id" class="flex gap-4">
              <div class="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center font-bold text-indigo-600">
                {{ comment.user?.name?.charAt(0).toUpperCase() || '?' }}
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <p class="font-semibold text-gray-900">{{ comment.user?.name || 'Anonymous' }}</p>
                  <span class="text-xs text-gray-500">{{ new Date(comment.createdAt).toLocaleDateString() }}</span>
                </div>
                <p class="text-gray-700 mt-1 leading-relaxed">{{ comment.content }}</p>
              </div>
            </div>

            <div v-if="!event.comments || event.comments.length === 0" class="text-center py-10 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Not Found -->
    <div v-else class="text-center py-20 text-gray-500">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-xl font-medium text-gray-900">Event not found</p>
      <p class="mt-2 text-gray-500">The event you are looking for doesn't exist or failed to load.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useEventsStore } from '~/stores/eventsStore'

const route = useRoute()
const eventsStore = useEventsStore()

const hoverRating = ref(0)
const newComment = ref('')
const isSubmittingComment = ref(false)

const eventId = computed(() => route.params.id as string)
const event = computed(() => eventsStore.currentEvent)

onMounted(() => {
  if (eventId.value) {
    eventsStore.fetchEventById(eventId.value)
  }
})

const toggleLike = () => eventsStore.toggleLike(eventId.value)
const toggleBookmark = () => eventsStore.toggleBookmark(eventId.value)

const rateEvent = (rating: number) => {
  hoverRating.value = rating
  eventsStore.rateEvent(eventId.value, rating)
}

const submitComment = async () => {
  if (!newComment.value.trim()) return

  isSubmittingComment.value = true
  const success = await eventsStore.postComment(eventId.value, newComment.value)

  if (success) {
    newComment.value = ''
  }
  isSubmittingComment.value = false
}
</script>