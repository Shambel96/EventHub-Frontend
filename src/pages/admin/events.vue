<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <div>
        <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          <NuxtLink to="/admin" class="hover:text-brand-blue">Admin</NuxtLink>
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-brand-blue">Events Manager</span>
        </nav>
        <h1 class="text-4xl font-black text-brand-blue tracking-tight">Events Management</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Track, monitor, and oversee all platform experiences</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative group">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search events..." 
            class="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-brand-blue focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all shadow-sm w-64"
          />
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <NuxtLink to="/events/create" class="px-6 py-3 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Create New
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content Card -->
    <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
      <!-- Controls -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <!-- Tabs -->
        <div class="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
          <button 
            v-for="tab in eventTabs" 
            :key="tab.id"
            @click="activeEventTab = tab.id; eventPage = 1"
            class="px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300"
            :class="[activeEventTab === tab.id ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-brand-blue']"
          >
            {{ tab.name }}
            <span class="ml-2 opacity-50">{{ tabCounts[tab.id] }}</span>
          </button>
        </div>

        <div class="flex items-center gap-4">
          <select 
            v-model="limit" 
            class="bg-gray-50 border border-gray-100 text-gray-500 font-bold text-xs rounded-xl px-4 py-2 outline-none"
          >
            <option :value="5">5 per page</option>
            <option :value="10">10 per page</option>
            <option :value="20">20 per page</option>
          </select>
        </div>
      </div>

      <!-- Events Table -->
      <div class="overflow-x-auto -mx-8 px-8 min-h-[400px]">
        <table class="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              <th class="pb-4 px-4">Event Identity</th>
              <th class="pb-4 px-4">Category</th>
              <th class="pb-4 px-4">Schedule</th>
              <th class="pb-4 px-4">Price / Revenue</th>
              <th class="pb-4 px-4">Status</th>
              <th class="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <TransitionGroup 
            tag="tbody" 
            name="list" 
            v-if="paginatedEvents.length"
          >
            <tr v-for="event in paginatedEvents" :key="event.id" class="group bg-gray-50/30 hover:bg-white border border-transparent hover:border-gray-100 rounded-3xl transition-all duration-500 hover:shadow-xl shadow-brand-blue/5">
              <td class="py-5 px-4 first:rounded-l-3xl">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl overflow-hidden bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black shadow-inner">
                    <img v-if="event.images && event.images[0]" :src="event.images[0].url" class="w-full h-full object-cover" alt="event" />
                    <span v-else>E</span>
                  </div>
                  <div>
                    <p class="text-sm font-black text-brand-blue leading-tight mb-1">{{ event.title }}</p>
                    <div class="flex items-center gap-2 grayscale group-hover:grayscale-0 transition-all">
                      <svg class="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <p class="text-[10px] text-gray-400 uppercase font-black tracking-widest">{{ event.location }}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td class="py-5 px-4">
                <span class="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:bg-brand-blue/5 transition-colors">
                  {{ event.category?.name || 'Uncategorized' }}
                </span>
              </td>
              <td class="py-5 px-4">
                <p class="text-sm font-bold text-gray-600">{{ formatDate(event.startDate) }}</p>
                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{{ event.duration }}</p>
              </td>
              <td class="py-5 px-4">
                <p class="text-sm font-black text-brand-blue">${{ event.price }}</p>
                <div class="mt-1 h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-brand-blue/20" :style="{ width: Math.random() * 100 + '%' }"></div>
                </div>
              </td>
              <td class="py-5 px-4">
                <span 
                  class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm"
                  :class="statusStyles[activeEventTab]"
                >
                  {{ activeEventTab }}
                </span>
              </td>
              <td class="py-5 px-4 text-right last:rounded-r-3xl">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEventDetails(event.id)"
                    class="w-10 h-10 flex items-center justify-center text-brand-blue bg-brand-blue/5 hover:bg-brand-blue hover:text-white rounded-xl transition-all shadow-sm"
                    title="View Full Details"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button 
                    @click="openImageModal(event)"
                    class="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-brand-blue/5 hover:text-brand-blue rounded-xl transition-all"
                    title="Manage Photos"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </button>
                  <button 
                    @click="triggerDelete(event)"
                    class="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                    title="Delete Experience"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </TransitionGroup>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center py-32 opacity-30 italic font-black text-brand-blue uppercase tracking-widest select-none underline-offset-8 decoration-wavy decoration-brand-yellow">
                No matching experiences found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination 
        v-model:page="eventPage" 
        :total-pages="Math.ceil(filteredEvents.length / limit)" 
        :total="filteredEvents.length"
        :from="(eventPage - 1) * limit + 1"
        :to="Math.min(eventPage * limit, filteredEvents.length)"
      />
    </div>

    <!-- Image Management Modal -->
    <ImageManagerModal 
      :is-open="isImageModalOpen"
      :event="selectedEvent"
      @close="closeImageModal"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal 
      :show="showDeleteModal"
      title="Delete Experience?"
      :message="`Are you sure you want to delete '${selectedEvent?.title}'? This action cannot be undone.`"
      @confirm="onConfirmDelete"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEventsStore } from '../../stores/eventsStore';
import Pagination from '../../components/common/Pagination.vue';
import ImageManagerModal from '../../components/admin/ImageManagerModal.vue';
import ConfirmationModal from '../../components/common/ConfirmationModal.vue';

definePageMeta({
  layout: 'admin'
});

const eventsStore = useEventsStore();
const router = useRouter();

const limit = ref(5);
const eventPage = ref(1);
const activeEventTab = ref('ongoing');
const searchQuery = ref('');

// Image & Delete States
const isImageModalOpen = ref(false);
const showDeleteModal = ref(false);
const selectedEvent = ref(null);

const openImageModal = (event) => {
  selectedEvent.value = event;
  isImageModalOpen.value = true;
};

const closeImageModal = () => {
  isImageModalOpen.value = false;
  selectedEvent.value = null;
};

const openEventDetails = (eventId) => {
  router.push(`/admin/events/${eventId}`);
};

const triggerDelete = (event) => {
  selectedEvent.value = event;
  showDeleteModal.value = true;
};

const onConfirmDelete = async () => {
  if (selectedEvent.value) {
    await eventsStore.deleteEvent(selectedEvent.value.id);
    showDeleteModal.value = false;
    selectedEvent.value = null;
  }
};

const eventTabs = [
  { id: 'all', name: 'All' },
  { id: 'ongoing', name: 'Ongoing' },
  { id: 'planned', name: 'Planned' },
  { id: 'passed', name: 'Passed' },
];

const tabCounts = computed(() => ({
  all: eventsStore.events.length,
  ongoing: eventsStore.ongoingEvents.length,
  planned: eventsStore.plannedEvents.length,
  passed: eventsStore.passedEvents.length,
}));

const currentEvents = computed(() => {
  if (activeEventTab.value === 'all') return eventsStore.events;
  if (activeEventTab.value === 'ongoing') return eventsStore.ongoingEvents;
  if (activeEventTab.value === 'planned') return eventsStore.plannedEvents;
  if (activeEventTab.value === 'passed') return eventsStore.passedEvents;
  return [];
});

const filteredEvents = computed(() => {
  if (!searchQuery.value) return currentEvents.value;
  const q = searchQuery.value.toLowerCase();
  return currentEvents.value.filter(e => 
    e.title.toLowerCase().includes(q) || 
    e.location.toLowerCase().includes(q) ||
    e.categoryId.toLowerCase().includes(q)
  );
});

const paginatedEvents = computed(() => {
  const start = (eventPage.value - 1) * limit.value;
  return filteredEvents.value.slice(start, start + limit.value);
});

const statusStyles = {
  ongoing: 'bg-green-50 text-green-600 border-green-100',
  planned: 'bg-brand-blue/5 text-brand-blue border-brand-blue/10',
  passed: 'bg-gray-50 text-gray-400 border-gray-100',
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

onMounted(() => {
  eventsStore.fetchEvents();
});
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
