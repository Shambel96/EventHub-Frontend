<template>
  <div v-if="event" class="max-w-5xl mx-auto space-y-12">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
      <NuxtLink to="/admin" class="hover:text-brand-blue transition-colors">Admin</NuxtLink>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      <NuxtLink to="/admin/events" class="hover:text-brand-blue transition-colors">Events Manager</NuxtLink>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      <span class="text-brand-blue">Event Details</span>
    </nav>

    <!-- Event Header / Hero -->
    <div class="relative group">
      <div class="h-64 lg:h-80 w-full rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <img 
          :src="event.images?.[0]?.url || '/placeholder-event.jpg'" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          alt="Event Hero"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-brand-blue/20 to-transparent"></div>
        
        <!-- Quick Stats Overlay -->
        <div class="absolute bottom-8 left-8 right-8 flex justify-between items-end">
          <div>
            <span class="px-3 py-1 bg-brand-yellow text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-lg mb-3 inline-block">
              {{ event.category?.name || 'Uncategorized' }}
            </span>
            <h1 class="text-3xl lg:text-5xl font-black text-white tracking-tight">{{ event.title }}</h1>
          </div>
          <div class="flex gap-3">
             <button @click="openEditModal" class="px-6 py-3 bg-white text-brand-blue rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                Edit Details
             </button>
             <button @click="triggerDelete" class="w-12 h-12 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-red-600 transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Left Column: Primary Content -->
      <div class="lg:col-span-2 space-y-12">
        <!-- Description -->
        <section>
          <h2 class="text-xl font-black text-brand-blue mb-6 flex items-center gap-3">
            <span class="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue">
               <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
            </span>
            Deep Dive: Experience Description
          </h2>
          <div class="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm leading-relaxed text-gray-600 font-medium">
            {{ event.description }}
          </div>
        </section>

        <!-- Dynamic Steps / Experience Flow -->
        <section v-if="event.steps && event.steps.length">
          <h2 class="text-xl font-black text-brand-blue mb-8 border-b border-gray-50 pb-4">The Experience Flow</h2>
          <div class="space-y-6">
            <div v-for="step in event.steps" :key="step.id" class="flex gap-6 group">
              <div class="flex flex-col items-center">
                <div class="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-xs shrink-0 z-10 shadow-lg shadow-brand-blue/20 group-hover:scale-110 transition-transform">
                  {{ step.stepOrder }}
                </div>
                <div class="w-0.5 h-full bg-gray-100 group-last:bg-transparent -mt-2"></div>
              </div>
              <div class="flex-1 pb-8">
                <div class="p-6 bg-gray-50/50 border border-transparent group-hover:border-gray-100 rounded-2xl transition-all">
                  <p class="text-sm font-bold text-brand-blue">{{ step.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Amenities -->
        <section v-if="event.amenities && event.amenities.length">
          <h2 class="text-xl font-black text-brand-blue mb-6">Included Amenities</h2>
          <div class="flex flex-wrap gap-4">
            <div v-for="amenity in event.amenities" :key="amenity.amenityId" class="px-6 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <span class="text-xs font-black uppercase tracking-widest text-brand-blue">{{ amenitiesStore.getAmenityName(amenity.amenityId) }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Sidebar Stats -->
      <div class="space-y-8">
        <!-- Logistics Card -->
        <section class="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm space-y-8">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Logistics & Schedule</p>
            <div class="space-y-4">
               <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <div>
                   <p class="text-xs font-black text-brand-blue">{{ formatDate(event.beginDate) }}</p>
                   <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Start Date</p>
                 </div>
               </div>
               <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <div>
                   <p class="text-xs font-black text-brand-blue">{{ event.duration }}</p>
                   <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Duration</p>
                 </div>
               </div>
               <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-brand-blue">
                   <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 </div>
                 <div>
                   <p class="text-xs font-black text-brand-blue">{{ event.location }}</p>
                   <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Venue Location</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div class="pt-8 border-t border-gray-50">
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Investment</p>
            <div class="flex items-end gap-2">
              <span class="text-4xl font-black text-brand-blue">${{ event.price }}</span>
              <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">per person</span>
            </div>
          </div>
        </section>

        <!-- Social Proof Card -->
        <section class="p-8 bg-brand-blue rounded-[2rem] text-white shadow-xl shadow-brand-blue/20 relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          <div class="relative z-10 space-y-6">
            <p class="text-xs font-black uppercase tracking-widest opacity-60">Engagement Pulse</p>
            <div class="grid grid-cols-2 gap-6 text-center">
              <div>
                <p class="text-3xl font-black">{{ event.likesCount }}</p>
                <p class="text-[8px] font-black uppercase tracking-widest opacity-40">Total Likes</p>
              </div>
              <div>
                <p class="text-3xl font-black">{{ event.rating }}</p>
                <p class="text-[8px] font-black uppercase tracking-widest opacity-40">Avg Rating</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal 
      :show="showDeleteModal"
      title="Permanently Delete Experience?"
      :message="`You are about to remove '${event.title}' from the platform. This action is irreversible and all associated data will be lost.`"
      @confirm="onConfirmDelete"
      @cancel="showDeleteModal = false"
    />

    <!-- Edit Experience Modal -->
    <EditEventModal 
      :is-open="isEditModalOpen"
      :event="event"
      @close="isEditModalOpen = false"
      @updated="handleUpdateSuccess"
    />
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-6">
      <div class="w-16 h-16 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin mx-auto"></div>
      <p class="text-xs font-black text-brand-blue uppercase tracking-[0.3em] animate-pulse">Syncing experience data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useEventsStore } from '../../../stores/eventsStore';
import { useAmenitiesStore } from '../../../stores/amenitiesStore';
import ConfirmationModal from '../../../components/common/ConfirmationModal.vue';
import EditEventModal from '../../../components/admin/EditEventModal.vue';

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const eventsStore = useEventsStore();
const amenitiesStore = useAmenitiesStore();

const event = computed(() => eventsStore.events.find(e => e.id === route.params.id) || null);

const showDeleteModal = ref(false);
const isEditModalOpen = ref(false);

const triggerDelete = () => {
  showDeleteModal.value = true;
};

const onConfirmDelete = async () => {
  await eventsStore.deleteEvent(event.value.id);
  router.push('/admin/events');
};

const openEditModal = () => {
  isEditModalOpen.value = true;
};

const handleUpdateSuccess = () => {
  // Store update logic is handled within the modal and reflected by computed
  console.log('Event updated successfully');
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

onMounted(async () => {
  if (!eventsStore.events.length) {
    await eventsStore.fetchEvents();
  }
  amenitiesStore.fetchAmenities();
});
</script>
