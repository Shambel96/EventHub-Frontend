<template>
  <div class="min-h-screen bg-zinc-950 text-white">
    <!-- Hero Section -->
    <div class="relative h-[65vh] overflow-hidden">
      <img 
        v-if="(event?.images?.length ?? 0) > 0" 
        :src="event?.images?.[0]?.url" 
        class="absolute inset-0 w-full h-full object-cover"
        alt="Event banner"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/70 to-zinc-950"></div>

      <div class="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-sm mb-6 w-fit">
          <span class="text-yellow-400">●</span>
          {{ event?.category?.name || 'Event' }}
        </div>

        <h1 class="text-5xl md:text-6xl font-bold leading-tight mb-6">
          {{ event?.title }}
        </h1>

        <div class="flex flex-wrap items-center gap-x-8 gap-y-3 text-white/80">
          <div class="flex items-center gap-2">
            <span class="text-xl">📍</span>
            <span>{{ event?.location }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xl">📅</span>
            <span>{{ formattedStartDate }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xl">⏱️</span>
            <span>{{ event?.duration }} minutes</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      <!-- Main Content -->
      <div class="lg:col-span-8 space-y-16">
        
        <!-- Description -->
        <section>
          <h2 class="text-3xl font-bold mb-6">About this Event</h2>
          <p class="text-lg leading-relaxed text-zinc-300 whitespace-pre-line">
            {{ event?.description }}
          </p>
        </section>

        <!-- Amenities -->
        <section v-if="event?.amenities?.length">
          <h2 class="text-3xl font-bold mb-6">What's Included</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="amenity in event.amenities" :key="amenity.amenityId" 
                 class="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-5 rounded-2xl flex items-start gap-4 transition">
              <div class="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mt-0.5">✓</div>
              <div>
                <p class="font-semibold">{{ amenity.amenity?.name || 'Amenity' }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Itinerary / Steps -->
        <section v-if="event?.steps?.length">
          <h2 class="text-3xl font-bold mb-8">Event Itinerary</h2>
          <div class="space-y-8">
            <div v-for="(step, index) in event.steps" :key="step.id" 
                 class="flex gap-6 group">
              <div class="w-12 h-12 shrink-0 rounded-2xl bg-zinc-800 flex items-center justify-center text-xl font-bold border border-zinc-700 group-hover:border-brand-blue transition">
                {{ Number(index) + 1 }}
              </div>
              <div class="flex-1 pt-2">
                <h3 class="font-semibold text-xl mb-2">{{ step.title || step.content }}</h3>
                <p class="text-zinc-400 leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Gallery -->
        <section v-if="(event?.images?.length ?? 0) > 1">
          <h2 class="text-3xl font-bold mb-6">Gallery</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(img, i) in (event?.images ?? []).slice(1)" :key="i" 
                 class="aspect-video rounded-2xl overflow-hidden border border-zinc-800">
              <img :src="img.url" class="w-full h-full object-cover hover:scale-105 transition duration-500" />
            </div>
          </div>
        </section>

        <!-- Comments Section -->
        <section>
          <h2 class="text-3xl font-bold mb-8">Community Comments</h2>
          
          <!-- Comment Input -->
          <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-10">
            <textarea 
              v-model="newComment" 
              rows="3"
              class="w-full bg-zinc-950 border border-zinc-700 rounded-2xl p-5 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Share your thoughts about this event..."
            ></textarea>
            <button 
              @click="postComment"
              class="mt-4 px-8 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition"
            >
              Post Comment
            </button>
          </div>

          <!-- Comments List -->
          <div class="space-y-8">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-5">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex-shrink-0"></div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <p class="font-semibold">{{ comment.author }}</p>
                  <span class="text-xs text-zinc-500">{{ comment.time }}</span>
                </div>
                <p class="text-zinc-400 mt-1">{{ comment.text }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-4">
        <div class="sticky top-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div class="text-center mb-8">
            <div class="text-5xl font-bold mb-1">
              {{ event?.isPaid ? `$${event.price}` : 'Free' }}
            </div>
            <p class="text-zinc-400 text-sm">per person</p>
          </div>

          <button class="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition mb-4">
            Get Tickets
          </button>

          <!-- Interaction Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="toggleLike"
              class="flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
            >
              ❤️ <span>{{ event?.likesCount || 0 }}</span>
            </button>
            <button 
              @click="toggleBookmark"
              class="flex items-center justify-center gap-3 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition"
            >
              🔖 Bookmark
            </button>
          </div>

          <!-- Rating -->
          <div class="mt-10">
            <p class="text-sm text-zinc-400 mb-4">Rate this event</p>
            <div class="flex gap-2">
              <button v-for="star in 5" :key="star" 
                @click="rateEvent(star)"
                class="text-4xl transition hover:scale-110"
                :class="star <= (userRating || Math.floor(event?.avgRating || 0)) ? 'text-yellow-400' : 'text-zinc-700'">
                ★
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const eventsStore = useEventsStore()

const eventId = route.params.id as string
const newComment = ref('')

type CommentItem = {
  id: string
  author: string
  time: string
  text: string
}

const comments = ref<CommentItem[]>([])

onMounted(() => {
  eventsStore.fetchEventById(eventId)
})

const event = computed(() => eventsStore.currentEvent)
const userRating = ref(0)

const formattedStartDate = computed(() => {
  const startDate = event.value?.startDate
  if (!startDate) return 'Date TBA'
  return new Date(startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
})

const toggleLike = () => eventsStore.toggleLike(eventId)
const toggleBookmark = () => eventsStore.toggleBookmark(eventId)

const rateEvent = (rating: number) => {
  userRating.value = rating
  eventsStore.rateEvent(eventId, rating)
}

const postComment = () => {
  const text = newComment.value.trim()
  if (!text) return

  comments.value.unshift({
    id: crypto.randomUUID(),
    author: 'You',
    time: 'Just now',
    text
  })

  // Call backend comment endpoint here later
  console.log('Comment posted:', text)
  newComment.value = ''
}
</script>