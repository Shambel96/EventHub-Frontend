<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Loading -->
    <div v-if="eventsStore.isLoading" class="flex justify-center items-center py-40">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
    </div>

    <!-- Error -->
    <div v-else-if="eventsStore.error" class="max-w-3xl mx-auto px-4 py-20 text-center">
      <p class="text-red-500 font-medium">{{ eventsStore.error }}</p>
      <NuxtLink to="/events" class="mt-4 inline-block text-brand-blue hover:underline">← Back to Events</NuxtLink>
    </div>

    <template v-else-if="event">

      <!-- Hero Image -->
      <div class="relative h-80 md:h-[420px] bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
        <img
          v-if="event.images?.length"
          :src="event.images[0]?.url"
          class="w-full h-full object-cover"
          alt="Event cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <NuxtLink
          to="/events"
          class="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/30 transition"
        >
          <ArrowLeft class="w-4 h-4" />
          Back
        </NuxtLink>

        <div class="absolute top-6 right-6 flex gap-2">
          <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            {{ event.category?.name || event.categoryId }}
          </span>
          <span class="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
            {{ event.isPaid && event.price ? `$${event.price}` : 'Free' }}
          </span>
        </div>

        <div class="absolute bottom-0 left-0 right-0 px-6 md:px-10 py-8">
          <h1 class="text-3xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg">
            {{ event.title }}
          </h1>
        </div>
      </div>

      <!-- Main content -->
      <div class="max-w-5xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Left -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Description -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 class="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText class="w-5 h-5 text-brand-blue" /> About this event
            </h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ event.description }}</p>
          </div>

          <!-- Steps -->
          <div v-if="event.steps?.length" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 class="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <List class="w-5 h-5 text-brand-blue" /> Itinerary
            </h2>
            <div class="space-y-4">
              <div v-for="(step, idx) in event.steps" :key="step.id" class="flex gap-4">
                <div class="flex-shrink-0 w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {{ Number(idx) + 1 }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800">{{ step.title }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rating -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 class="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              <Star class="w-5 h-5 text-amber-400 fill-amber-400" /> Rate this event
            </h2>
            <p class="text-sm text-gray-400 mb-5">
              {{ event.totalRatings }} rating{{ event.totalRatings !== 1 ? 's' : '' }} ·
              avg {{ event.avgRating ? event.avgRating.toFixed(1) : '—' }} / 5
            </p>

            <div class="flex items-center gap-1 mb-3">
              <button
                v-for="n in 5"
                :key="n"
                type="button"
                @click="submitRating(n)"
                @mouseenter="hoverRating = n"
                @mouseleave="hoverRating = 0"
                :disabled="ratingLoading"
                class="transition-transform hover:scale-110 disabled:cursor-wait"
              >
                <Star
                  class="w-8 h-8 transition-colors"
                  :class="n <= (hoverRating || event.userRating || 0)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 fill-gray-200'"
                />
              </button>
              <span v-if="ratingLoading" class="ml-3 text-xs text-gray-400">Saving...</span>
              <span v-else-if="event.userRating" class="ml-3 text-xs text-green-500 font-medium flex items-center gap-1">
                <CheckCircle class="w-3.5 h-3.5" /> You rated {{ event.userRating }}/5
              </span>
            </div>
            <p v-if="ratingError" class="text-xs text-red-500">{{ ratingError }}</p>
          </div>

          <!-- Comments -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 class="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <MessageCircle class="w-5 h-5 text-brand-blue" />
              Comments
              <span class="ml-auto text-sm font-normal text-gray-400">{{ event.comments?.length || 0 }}</span>
            </h2>

            <!-- Post comment -->
            <div class="mb-6">
              <textarea
                v-model="commentText"
                rows="3"
                placeholder="Share your thoughts about this event..."
                class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none transition"
                :disabled="commentLoading"
              />
              <div class="flex justify-between items-center mt-2">
                <p v-if="commentError" class="text-xs text-red-500">{{ commentError }}</p>
                <button
                  @click="submitComment"
                  :disabled="!commentText.trim() || commentLoading"
                  class="ml-auto flex items-center gap-2 bg-brand-blue text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send class="w-4 h-4" />
                  {{ commentLoading ? 'Posting...' : 'Post' }}
                </button>
              </div>
            </div>

            <!-- Comments list -->
            <div v-if="event.comments?.length" class="space-y-4">
              <div v-for="comment in event.comments" :key="comment.id" class="flex gap-3">
                <div class="flex-shrink-0 w-9 h-9 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm flex items-center justify-center uppercase">
                  {{ (comment.user?.name || comment.user?.email || 'U').charAt(0) }}
                </div>
                <div class="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-semibold text-gray-800">
                      {{ comment.user?.name || comment.user?.email || 'Anonymous' }}
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDate(comment.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-gray-600 leading-relaxed">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-400 text-sm italic">
              No comments yet. Be the first to comment!
            </div>
          </div>

        </div>

        <!-- Right sidebar -->
        <div class="space-y-5">

          <!-- Social actions — always enabled, backend handles auth rejection -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-around">

            <button
              @click="handleLike"
              :disabled="likeLoading"
              class="flex flex-col items-center gap-1.5 group disabled:cursor-wait"
            >
              <div class="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                :class="event.isLiked ? 'bg-red-50' : 'bg-gray-50 group-hover:bg-red-50'">
                <Heart class="w-5 h-5 transition-all"
                  :class="event.isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-400'" />
              </div>
              <span class="text-xs font-semibold" :class="event.isLiked ? 'text-red-500' : 'text-gray-500'">
                {{ event.likesCount || 0 }}
              </span>
            </button>

            <button
              @click="handleBookmark"
              :disabled="bookmarkLoading"
              class="flex flex-col items-center gap-1.5 group disabled:cursor-wait"
            >
              <div class="w-11 h-11 rounded-full flex items-center justify-center transition-colors"
                :class="event.isBookmarked ? 'bg-amber-50' : 'bg-gray-50 group-hover:bg-amber-50'">
                <Bookmark class="w-5 h-5 transition-all"
                  :class="event.isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-gray-400 group-hover:text-amber-400'" />
              </div>
              <span class="text-xs font-semibold" :class="event.isBookmarked ? 'text-amber-500' : 'text-gray-500'">
                {{ event.isBookmarked ? 'Saved' : 'Save' }}
              </span>
            </button>

            <div class="flex flex-col items-center gap-1.5">
              <div class="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center">
                <MessageCircle class="w-5 h-5 text-gray-400" />
              </div>
              <span class="text-xs font-semibold text-gray-500">{{ event.commentsCount || 0 }}</span>
            </div>

          </div>

          <!-- Event meta -->
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide">Event Details</h3>

            <div class="flex items-start gap-3 text-sm text-gray-600">
              <MapPin class="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0" />
              <span>{{ event.location || 'Online' }}</span>
            </div>
            <div class="flex items-start gap-3 text-sm text-gray-600">
              <Clock class="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0" />
              <span>{{ event.duration }}</span>
            </div>
            <div v-if="event.startDate" class="flex items-start gap-3 text-sm text-gray-600">
              <CalendarDays class="w-4 h-4 text-brand-blue mt-0.5 flex-shrink-0" />
              <span>{{ formatDate(event.startDate) }}</span>
            </div>
            <div class="flex items-start gap-3 text-sm text-gray-600">
              <Star class="w-4 h-4 text-amber-400 fill-amber-400 mt-0.5 flex-shrink-0" />
              <span>{{ event.avgRating ? event.avgRating.toFixed(1) : 'No ratings yet' }} / 5</span>
            </div>
          </div>

          <!-- Gallery -->
          <div v-if="event.images?.length > 1" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="font-bold text-gray-800 text-sm uppercase tracking-wide mb-4">Gallery</h3>
            <div class="grid grid-cols-2 gap-2">
              <img
                v-for="img in event.images.slice(1)"
                :key="img.id"
                :src="img.url"
                class="w-full aspect-square object-cover rounded-xl"
                alt="Event image"
              />
            </div>
          </div>

        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, Heart, Bookmark, Star, MessageCircle,
  MapPin, Clock, CalendarDays, FileText, List, Send, CheckCircle
} from 'lucide-vue-next'
import { useEventsStore } from '../../stores/eventsStore'

const route       = useRoute()
const eventsStore = useEventsStore()

const eventId = computed(() => route.params.id as string)
const event   = computed(() => eventsStore.currentEvent)

const hoverRating     = ref(0)
const ratingLoading   = ref(false)
const ratingError     = ref('')
const commentText     = ref('')
const commentLoading  = ref(false)
const commentError    = ref('')
const likeLoading     = ref(false)
const bookmarkLoading = ref(false)

onMounted(() => eventsStore.fetchEventById(eventId.value))

async function handleLike() {
  likeLoading.value = true
  try { await eventsStore.toggleLike(eventId.value) } catch {}
  finally { likeLoading.value = false }
}

async function handleBookmark() {
  bookmarkLoading.value = true
  try { await eventsStore.toggleBookmark(eventId.value) } catch {}
  finally { bookmarkLoading.value = false }
}

async function submitRating(score: number) {
  ratingError.value = ''
  ratingLoading.value = true
  try {
    await eventsStore.rateEvent(eventId.value, score)
  } catch (err: any) {
    ratingError.value = err.message || 'Failed to submit rating.'
  } finally {
    ratingLoading.value = false
  }
}

async function submitComment() {
  if (!commentText.value.trim()) return
  commentError.value = ''
  commentLoading.value = true
  try {
    await eventsStore.postComment(eventId.value, commentText.value.trim())
    commentText.value = ''
  } catch (err: any) {
    commentError.value = err.message || 'Failed to post comment.'
  } finally {
    commentLoading.value = false
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>