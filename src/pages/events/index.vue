<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 tracking-tight">Discover Events</h1>
        <p class="text-gray-600 mt-2 text-lg">Find and join amazing experiences</p>
      </div>
      <NuxtLink 
        to="/events/create"
        class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all active:scale-95"
      >
        <span class="text-xl">+</span> Create Event
      </NuxtLink>
    </div>

    <!-- Search & Filter Bar -->
    <div class="bg-white rounded-3xl shadow border border-gray-100 p-6 mb-12">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search events by title, location or description..."
          class="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-base placeholder:text-gray-400"
        />
        <div class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      <!-- Category Filters -->
      <div class="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="cat in categoryOptions"
          :key="cat.id"
          @click="activeCategoryFilter = cat.id"
          class="px-6 py-2.5 rounded-2xl font-medium text-sm whitespace-nowrap transition-all"
          :class="activeCategoryFilter === cat.id 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="eventsStore.isLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-14 w-14 border-b-2 border-indigo-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="eventsStore.error" class="bg-red-50 border border-red-200 text-red-700 p-8 rounded-3xl text-center">
      {{ eventsStore.error }}
    </div>

    <!-- Empty -->
    <div v-else-if="filteredEvents.length === 0" class="text-center py-20">
      <p class="text-2xl text-gray-400">No events found</p>
      <p class="text-gray-500 mt-3">Try adjusting your search or category filter</p>
    </div>

    <!-- Events Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <EventCard 
        v-for="event in paginatedEvents" 
        :key="event.id" 
        :event="event" 
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-16">
      <button 
        @click="prevPage" 
        :disabled="currentPage === 1"
        class="px-6 py-3 rounded-2xl border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
      >
        ← Previous
      </button>

      <div class="flex gap-2">
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="goToPage(page)"
          class="w-10 h-10 rounded-2xl font-medium transition"
          :class="currentPage === page 
            ? 'bg-indigo-600 text-white' 
            : 'border border-gray-200 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
      </div>

      <button 
        @click="nextPage" 
        :disabled="currentPage === totalPages"
        class="px-6 py-3 rounded-2xl border border-gray-200 disabled:opacity-50 hover:bg-gray-50 transition"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useEventsStore } from '../../stores/eventsStore'
import EventCard from '../../components/EventCard.vue'

const eventsStore = useEventsStore()

const searchQuery = ref('')
const activeCategoryFilter = ref('All')
const currentPage = ref(1)
const itemsPerPage = 9

// Fetch events on mount
onMounted(() => {
  eventsStore.fetchEvents()
})

// Filtered & Paginated Events
const filteredEvents = computed(() => {
  let list = eventsStore.events

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(event => 
      event.title?.toLowerCase().includes(q) || 
      event.description?.toLowerCase().includes(q)
    )
  }

  // Category filter
  if (activeCategoryFilter.value !== 'All') {
    list = list.filter(event => 
      event.categoryId === activeCategoryFilter.value || 
      event.category?.id === activeCategoryFilter.value ||
      event.category?.name === activeCategoryFilter.value
    )
  }

  return list
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage))

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEvents.value.slice(start, start + itemsPerPage)
})

// Category Options (dynamic + preset)
const categoryOptions = computed(() => {
  const categories = new Map()
  categories.set('All', { id: 'All', name: 'All Events' })

  eventsStore.events.forEach(event => {
    const catId = event.categoryId || event.category?.id
    const catName = event.category?.name || 'Other'
    if (catId) categories.set(catId, { id: catId, name: catName })
  })

  return Array.from(categories.values())
})

// Pagination handlers
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page: number) => { currentPage.value = page }

// Reset page when filters change
watch([searchQuery, activeCategoryFilter], () => {
  currentPage.value = 1
})
</script>