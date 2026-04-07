<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
      <div>
        <h1 class="text-4xl font-extrabold text-brand-blue mb-2">Explore Events</h1>
        <p class="text-gray-600 text-lg">Discover amazing events happening near you</p>
      </div>
      <NuxtLink 
        to="/events/create" 
        class="inline-block bg-brand-yellow text-brand-blue px-8 py-3 rounded-xl font-bold shadow hover:shadow-xl transition"
      >
        + Create New Event
      </NuxtLink>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
      <div class="relative mb-6">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search events..." 
          class="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-blue text-lg"
        />
        <div class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      <!-- Category Filters -->
      <div class="flex gap-2 overflow-x-auto pb-3">
        <button 
          v-for="cat in categoryOptions" 
          :key="cat.id"
          @click="activeCategoryFilter = cat.id"
          class="px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition text-sm"
          :class="activeCategoryFilter === cat.id 
            ? 'bg-brand-blue text-white shadow' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-14 w-14 border-b-2 border-brand-blue"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
      {{ error }}
    </div>

    <div v-else-if="filteredEvents.length === 0" class="text-center py-20">
      <p class="text-2xl text-gray-400">No events found</p>
      <p class="text-gray-500 mt-2">Try changing your search or filter</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <EventCard 
        v-for="eventItem in paginatedEvents" 
        :key="eventItem.id" 
        :event="eventItem" 
      />
    </div>

    <div v-if="totalPages > 1" class="flex justify-center gap-3 mt-16">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-6 py-3 rounded-xl border disabled:opacity-50"
      >
        Previous
      </button>
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="goToPage(page)"
        class="px-5 py-3 rounded-xl font-medium"
        :class="currentPage === page ? 'bg-brand-blue text-white' : 'border hover:bg-gray-50'"
      >
        {{ page }}
      </button>
      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-6 py-3 rounded-xl border disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useEventsStore } from '../../stores/eventsStore'
import EventCard from '../../components/EventCard.vue'

const eventsStore = useEventsStore()

type EventCardEvent = NonNullable<InstanceType<typeof EventCard>['$props']['event']>

const searchQuery = ref('')
const activeCategoryFilter = ref('All')
const currentPage = ref(1)
const itemsPerPage = 9

const categoryOptions = [
  { id: 'All', name: 'All' },
  { id: 'Conference', name: 'Conference' },
  { id: 'Workshop', name: 'Workshop' },
  { id: 'Meetup', name: 'Meetup' },
  { id: 'Webinar', name: 'Webinar' },
  { id: 'Social', name: 'Social' }
]

// Fetch events when page loads
onMounted(() => {
  eventsStore.fetchEvents()
})

// Computed values
const events = computed<EventCardEvent[]>(() => eventsStore.events as EventCardEvent[])

const uniqueCategories = computed(() => {
  const map = new Map();
  events.value.forEach(event => {
    const catId = event.categoryId || event.category?.id;
    const catName = event.category?.name || 'Uncategorized';
    if (catId) {
      map.set(catId, { id: catId, name: catName });
    }
  });
  return Array.from(map.values());
});

const filteredEvents = computed<EventCardEvent[]>(() => {
  return events.value.filter(event => {
    const matchesSearch =
      !searchQuery.value ||
      event.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const categoryId = event.categoryId || event.category?.id || 'Uncategorized'
    const matchesCategory =
      activeCategoryFilter.value === 'All' ||
      categoryId === activeCategoryFilter.value ||
      event.category?.name === activeCategoryFilter.value

    return matchesSearch && matchesCategory
  })
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage))

const paginatedEvents = computed<EventCardEvent[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEvents.value.slice(start, start + itemsPerPage)
})

const isLoading = computed(() => eventsStore.isLoading)
const error = computed(() => eventsStore.error)

// Pagination handlers
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page: number) => { currentPage.value = page }

// Reset page when filters change
watch([searchQuery, activeCategoryFilter], () => {
  currentPage.value = 1
})
</script>