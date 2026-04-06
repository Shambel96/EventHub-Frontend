<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-4xl font-extrabold text-brand-blue mb-2">Explore Events</h1>
        <p class="text-gray-600 text-lg">Discover the latest events powered by Vanta Events API.</p>
      </div>
      <div>
        <NuxtLink to="/events/create" class="inline-block bg-brand-yellow text-brand-blue px-6 py-2.5 rounded-lg font-bold shadow hover:-translate-y-0.5 hover:shadow-lg transition">
          Create Event
        </NuxtLink>
      </div>
    </div>

    <!-- Discover Section -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search events by title or description..." 
            class="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition font-medium"
          />
        </div>
      </div>
      
      <!-- Category Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          @click="activeCategoryFilter = 'All'"
          class="px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition shadow-sm"
          :class="activeCategoryFilter === 'All' ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#083765] hover:text-white'"
        >
          All Categories
        </button>
        <button 
          v-for="cat in categoryOptions" 
          :key="cat.id"
          @click="activeCategoryFilter = cat.id"
          class="px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition shadow-sm"
          :class="activeCategoryFilter === cat.id ? 'bg-brand-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#083765] hover:text-white'"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="eventsStore.isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="eventsStore.error" class="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      {{ eventsStore.error }}
    </div>
    
    <!-- Empty State -->
    <div v-else-if="eventsStore.events.length === 0" class="text-center py-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
      <h3 class="text-xl font-semibold text-gray-700 mb-2">No events found</h3>
      <p class="text-gray-500">Be the first to create an exciting event!</p>
    </div>

    <!-- Events Grid -->
    <div v-else class="space-y-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <EventCard 
          v-for="event in paginatedEvents" 
          :key="event.id" 
          :event="event" 
        />
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-gray-200">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm"
          :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-brand-blue border border-gray-200 hover:bg-blue-50 hover:border-blue-200'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          Previous
        </button>
        
        <div class="flex space-x-2 overflow-x-auto py-1">
           <button 
             v-for="page in totalPages" 
             :key="page"
             @click="goToPage(page)"
             class="min-w-[40px] h-10 px-2 rounded-lg font-bold transition flex items-center justify-center shadow-sm"
             :class="currentPage === page ? 'bg-brand-blue text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'"
           >
             {{ page }}
           </button>
        </div>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm"
          :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-brand-blue border border-gray-200 hover:bg-blue-50 hover:border-blue-200'"
        >
          Next
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useEventsStore } from '../../stores/eventsStore';
import EventCard from '../../components/EventCard.vue';
import { formatCategoryName, getEventCategoryLabel } from '../../utils/categoryFormatter';

const route = useRoute();
const eventsStore = useEventsStore();

const currentPage = ref(1);
const itemsPerPage = 9;

const searchQuery = ref('');
const activeCategoryFilter = ref('All');

// Initialize filter from query if user clicked 'Discover' in navbar
onMounted(() => {
  eventsStore.fetchEvents();
  if (route.query.focusSearch) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

const presetCategories = [
  'Conference',
  'Music Festival',
  'Tech Workshop',
  'Business Networking',
  'Live Concert',
  'Art Exhibition',
  'Local Meetup',
  'Online Webinar',
  'tech',
  'music',
  'education'
];

const categoryOptions = computed(() => {
  const categoryMap = new Map<string, string>();

  presetCategories.forEach((category) => {
    categoryMap.set(category, formatCategoryName(category));
  });

  eventsStore.events.forEach((event) => {
    if (!event.categoryId || event.categoryId === 'unspecified') return;
    categoryMap.set(event.categoryId, getEventCategoryLabel(event));
  });

  return Array.from(categoryMap.entries())
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
});

const filteredEvents = computed(() => {
  let list = eventsStore.events;
  if (activeCategoryFilter.value !== 'All') {
    list = list.filter(e => e.categoryId === activeCategoryFilter.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q)
    );
  }
  return list;
});

// Watch for filter changes and reset pagination
watch([searchQuery, activeCategoryFilter], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage);
});

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredEvents.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  eventsStore.fetchEvents();
});
</script>
