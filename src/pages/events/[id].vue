<template>
  <div v-if="!event" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
      <p class="text-gray-500 font-medium">Loading premium event details...</p>
    </div>
  </div>

  <div v-else class="bg-gray-50 min-h-screen pb-20 font-sans">
    <!-- Hero / Featured Image Section -->
    <div class="relative h-[55vh] md:h-[60vh] bg-gray-900 group">
      <img v-if="event.images && event.images.length > 0" :src="event.images[0]?.url" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
      <div v-else class="absolute inset-0 bg-gradient-to-br from-brand-blue to-teal-900"></div>
      <div class="absolute inset-0 bg-black/40"></div>
      
      <div class="absolute inset-0 max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 z-10 w-full">
        <div class="inline-block px-4 py-1.5 bg-brand-yellow text-brand-blue font-bold text-xs uppercase tracking-wider rounded-full self-start mb-5 shadow-lg">
          {{ categoryLabel }}
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-5 drop-shadow-lg leading-tight w-full md:w-3/4">{{ event.title }}</h1>
        <div class="flex flex-wrap items-center gap-5 text-white/90 font-medium text-sm md:text-base">
          <div class="flex items-center gap-1.5 drop-shadow"><svg class="w-5 h-5 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg> {{ event.location }}</div>
          <div class="flex items-center gap-1.5 drop-shadow"><svg class="w-5 h-5 text-brand-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg> {{ new Date(event.startDate).toLocaleDateString() }}</div>
          
          <!-- Rating on Hero -->
          <div class="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/30 ml-auto md:ml-0 shadow-sm">
             <svg class="w-4 h-4 text-brand-yellow fill-current drop-shadow-sm" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
             <span class="font-bold text-white tracking-wide">{{ event.avgRating?.toFixed(1) ?? '0.0' }} Avg Rating</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-10">
      
      <!-- Left Column (Overview, Itinerary, Gallery) -->
      <div class="lg:col-span-3 space-y-10">
        
        <!-- Description -->
        <section class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-bl-full -z-0"></div>
          <h2 class="text-2xl font-extrabold text-brand-blue mb-5 relative z-10">About this Event</h2>
          <p class="text-gray-600 leading-relaxed whitespace-pre-line text-lg relative z-10">{{ event.description }}</p>
        </section>

        <!-- Amenities -->
        <section v-if="event.amenities && event.amenities.length > 0" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-2xl font-extrabold text-brand-blue mb-6">Amenities Provided</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="amenity in event.amenities" :key="amenity.amenityId" class="flex items-center gap-3 bg-gray-50/80 p-3.5 rounded-xl border border-gray-100 hover:border-brand-blue/30 transition shadow-sm">
               <svg class="w-5 h-5 text-teal-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
               <span class="text-gray-700 font-semibold text-sm">{{ getAmenityLabel(amenity) }}</span>
            </div>
          </div>
        </section>

        <!-- Itinerary / Steps -->
        <section v-if="event.steps && event.steps.length > 0" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-2xl font-extrabold text-brand-blue mb-8">Event Itinerary</h2>
          <div class="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-blue before:via-blue-200 before:to-transparent">
            <div v-for="(step, index) in event.steps" :key="step.id" class="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div class="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-brand-blue text-white font-bold text-sm shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                {{ index + 1 }}
              </div>
              <div class="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 class="font-extrabold text-gray-800 text-lg mb-2">{{ step.title }}</h3>
                <p class="text-gray-500 leading-relaxed text-sm">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Gallery -->
        <section v-if="galleryImages.length > 0" class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-2xl font-extrabold text-brand-blue mb-6">Event Gallery</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="(img, idx) in galleryImages" :key="idx" class="aspect-square rounded-xl overflow-hidden shadow border border-gray-100 hover:shadow-xl transition cursor-pointer group">
              <img :src="img.url" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
          </div>
        </section>

        <!-- Ratings & Comments -->
        <section class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-100 pb-6 gap-6">
            <h2 class="text-2xl font-extrabold text-brand-blue">Reviews & Comments</h2>
            
            <!-- Clickable Rating Component -->
            <div class="bg-gradient-to-r from-yellow-50 to-white px-5 py-3 rounded-xl border border-yellow-200 flex items-center gap-4 shadow-sm">
              <span class="text-sm font-extrabold text-yellow-800 tracking-wide uppercase">Rate Event:</span>
              <div class="flex items-center gap-1" @mouseleave="hoverRating = 0">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  @mouseover="hoverRating = star"
                  @click="submitRating(star)"
                  class="focus:outline-none transition-transform hover:scale-125"
                >
                  <svg :class="[star <= (hoverRating || currentSessionRating || Math.floor(event.avgRating)) ? 'text-brand-yellow fill-current' : 'text-gray-200']" class="w-8 h-8 transition-colors drop-shadow-sm" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Comments List -->
          <div class="space-y-6 mb-8">
            <div v-if="comments.length === 0" class="text-center py-6 text-gray-500 italic bg-gray-50 rounded-xl">Be the first to share your thoughts!</div>
            
            <transition-group name="list" tag="div" class="space-y-6">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-4 group">
                 <div class="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue to-teal-500 shadow flex-shrink-0 flex items-center justify-center font-bold text-white uppercase">{{ comment.author.substring(0, 2) }}</div>
                 <div class="bg-gray-50 p-5 rounded-2xl rounded-tl-none border border-gray-100 flex-1 shadow-sm group-hover:shadow-md transition">
                   <div class="flex justify-between items-center mb-2">
                     <h4 class="font-extrabold text-brand-blue">{{ comment.author }}</h4>
                     <span class="text-xs text-gray-400 font-medium bg-white px-2 py-1 rounded-md border">{{ comment.time }}</span>
                   </div>
                   <p class="text-gray-700 text-sm leading-relaxed">{{ comment.text }}</p>
                 </div>
              </div>
            </transition-group>
          </div>

          <!-- Comment Input -->
          <form @submit.prevent="postComment" class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-brand-yellow flex-shrink-0 flex items-center justify-center font-extrabold text-brand-blue shadow">ME</div>
            <div class="flex-1 relative">
              <textarea v-model="newComment" required rows="2" class="w-full bg-white border-2 border-gray-200 rounded-2xl px-5 py-3 text-sm focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:outline-none transition resize-none shadow-inner" placeholder="Write your comment here..."></textarea>
              <button type="submit" class="absolute bottom-3 right-3 bg-brand-blue text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5">Post</button>
            </div>
          </form>
        </section>
      </div>

      <!-- Right Sidebar (Sticky Box) -->
      <div class="lg:col-span-1">
        <div class="sticky top-6 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 border-t-[6px] border-t-brand-yellow">
          <!-- Main Action -->
          <div class="text-center mb-8 pb-8 border-b border-gray-100">
            <span class="block text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Ticket Price</span>
            <div class="text-5xl font-extrabold text-brand-blue mb-6 drop-shadow-sm">{{ !event.isPaid ? 'Free' : (event.price ? `$${event.price}` : 'Paid') }}</div>
            <button class="w-full bg-brand-yellow text-brand-blue font-extrabold text-lg py-4 rounded-xl shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all uppercase tracking-wide">Secure Tickets</button>
            <p class="text-xs text-gray-400 mt-4 flex justify-center items-center gap-1 font-medium">
               <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> Secure Vanta Checkout
            </p>
          </div>

          <!-- Quick Details -->
          <div class="space-y-6 mb-8">
            <div class="flex items-center gap-4 group">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors shadow-sm"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
              <div>
                <p class="text-xs text-gray-500 font-bold uppercase tracking-wide">Duration</p>
                <p class="text-sm font-bold text-gray-800">{{ event.duration }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 group">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors shadow-sm"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>
              <div>
                <p class="text-xs text-gray-500 font-bold uppercase tracking-wide">End Date</p>
                <p class="text-sm font-bold text-gray-800">{{ new Date(event.endDate).toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Interaction Actions -->
          <div class="flex gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
             <button @click="eventsStore.toggleLike(event.id)" :class="event.isLiked ? 'bg-white text-pink-500 shadow shadow-pink-100 border-pink-100' : 'text-gray-500 hover:bg-white hover:shadow border-transparent'" class="flex-1 flex justify-center items-center gap-2 py-3 border rounded-xl font-bold transition">
               <svg :class="{'fill-current': event.isLiked}" class="w-5 h-5 transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
               {{ event.likesCount }}
             </button>
             <div class="w-px bg-gray-200 my-2"></div>
             <button @click="eventsStore.toggleBookmark(event.id)" :class="event.isBookmarked ? 'text-brand-yellow bg-brand-blue shadow' : 'text-gray-500 hover:bg-white hover:shadow border-transparent'" class="flex-1 items-center justify-center flex rounded-xl font-bold border transition">
                <svg :class="{'fill-current': event.isBookmarked}" class="w-5 h-5 transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
             </button>
          </div>
          
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEventsStore } from '../../stores/eventsStore';
import { useAmenitiesStore } from '../../stores/amenitiesStore';
import type { Event, EventAmenity } from '../../types/event';
import { getEventCategoryLabel } from '../../utils/categoryFormatter';

const route = useRoute();
const eventsStore = useEventsStore();
const amenitiesStore = useAmenitiesStore();

const eventId = route.params.id as string;
const event = computed(() => eventsStore.getEventById(eventId) as Event | null);
const categoryLabel = computed(() => getEventCategoryLabel(event.value));
const getAmenityLabel = (amenity: EventAmenity) => {
  return amenity.amenity?.name || amenitiesStore.getAmenityName(amenity.amenityId);
};

// Images except the first one (gallery)
const galleryImages = computed(() => {
  if (event.value && event.value.images && event.value.images.length > 1) {
    return event.value.images.slice(1);
  }
  return [];
});

// Init store sync if navigated directly via URL
onMounted(() => {
  if (eventsStore.events.length === 0) {
    eventsStore.fetchEvents();
  }
  amenitiesStore.fetchAmenities();
});

// Interactive Ratings State
const hoverRating = ref(0);
const currentSessionRating = ref(0);

const submitRating = async (rating: number) => {
  if (currentSessionRating.value) return; // Allow single rating per session for demo
  currentSessionRating.value = rating;
  await eventsStore.rateEvent(eventId, rating);
};

// Mock Comments State
const newComment = ref('');
const comments = ref([
  { id: 'c1', author: 'Alex Turner', time: '2 hours ago', text: 'Im so excited for this event! I went last year and the energy was unbelievable. Can someone tell me about the parking situation though?' },
  { id: 'c2', author: 'Sarah Jenkins', time: '5 hours ago', text: 'This itinerary looks incredibly packed. Definitely grabbing the early bird tickets.' }
]);

const postComment = () => {
  if (!newComment.value.trim()) return;
  
  comments.value.unshift({
    id: 'c' + Date.now().toString(),
    author: 'You',
    time: 'Just now',
    text: newComment.value
  });
  
  newComment.value = '';
  // Optimistically increment global comment count state
  if (event.value) {
    event.value.commentsCount++;
  }
};
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
