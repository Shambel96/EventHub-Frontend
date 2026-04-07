<template>
  <div class="space-y-10">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <div>
        <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          <NuxtLink to="/owner" class="hover:text-brand-blue">Dashboard</NuxtLink>
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-brand-blue">My Events</span>
        </nav>
        <h1 class="text-4xl font-black text-brand-blue tracking-tight">Active Events</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Full oversight and performance tracking of your hosted experiences</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search my events..."
            class="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-brand-blue focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all shadow-sm w-64"
          />
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
    </header>

    <!-- Events List -->
    <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-10">
      <!-- Tabs -->
      <div class="flex p-1 bg-gray-50 rounded-xl border border-gray-100 w-max mb-10">
        <button
          v-for="tab in eventTabs"
          :key="tab.id"
          @click="activeEventTab = tab.id"
          class="px-8 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300"
          :class="[activeEventTab === tab.id ? 'bg-white text-brand-blue shadow-sm ring-1 ring-gray-100' : 'text-gray-400 hover:text-brand-blue']"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Events Table -->
      <div class="overflow-x-auto -mx-10 px-10">
        <table class="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              <th class="pb-4 px-4">Event Identity</th>
              <th class="pb-4 px-4">Category</th>
              <th class="pb-4 px-4">Schedule</th>
              <th class="pb-4 px-4">Revenue</th>
              <th class="pb-4 px-4">Status</th>
              <th class="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody v-if="filteredEvents.length">
            <tr v-for="event in filteredEvents" :key="event.id" class="group bg-gray-50/30 hover:bg-white border border-transparent hover:border-gray-100 rounded-3xl transition-all duration-500 hover:shadow-xl shadow-brand-blue/5">
              <td class="py-6 px-4 first:rounded-l-3xl">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 bg-brand-blue/5 rounded-2xl flex items-center justify-center text-brand-blue font-black shadow-inner">
                    {{ event.title.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-black text-brand-blue leading-tight mb-1">{{ event.title }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ event.location }}</p>
                  </div>
                </div>
              </td>
              <td class="py-6 px-4">
                <span class="px-3 py-1 rounded-lg bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:bg-brand-blue/5 transition-colors">
                  {{ event.category?.name || 'Uncategorized' }}
                </span>
              </td>
              <td class="py-6 px-4">
                <p class="text-sm font-bold text-gray-600">{{ formatDate(event.startDate) }}</p>
                <p class="text-[10px] text-gray-400 font-black tracking-widest uppercase mt-1">{{ event.duration }}</p>
              </td>
              <td class="py-6 px-4">
                <p class="text-sm font-black text-brand-blue">{{ event.isPaid && event.price ? `$${event.price}` : 'Free' }}</p>
                <p class="text-[10px] text-gray-400 font-bold mt-1">Ticket Price</p>
              </td>
              <td class="py-6 px-4">
                <span
                  class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm"
                  :class="statusStyles[activeEventTab]"
                >
                  {{ activeEventTab }}
                </span>
              </td>
              <td class="py-6 px-4 text-right last:rounded-r-3xl">
                <div class="flex items-center justify-end gap-3 px-4">
                  <NuxtLink :to="`/events/${event.id}`" class="px-5 py-2.5 bg-white border border-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-blue hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm">View Event</NuxtLink>
                  <NuxtLink :to="`/events/create`" class="px-5 py-2.5 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all">Modify Event</NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="6" class="text-center py-40 opacity-30 italic font-black text-brand-blue uppercase tracking-widest select-none">
                No events found in this category
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useEventsStore } from '../../../stores/eventsStore';

definePageMeta({
  layout: 'owner'
});

const eventsStore = useEventsStore();
const activeEventTab = ref('ongoing');
const searchQuery = ref('');

const eventTabs = [
  { id: 'ongoing', name: 'Ongoing' },
  { id: 'planned', name: 'Planned' },
  { id: 'passed', name: 'Passed' },
];

const currentEvents = computed(() => {
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
    e.location.toLowerCase().includes(q)
  );
});

const statusStyles = {
  ongoing: 'bg-green-50 text-green-600 border-green-100',
  planned: 'bg-brand-blue/5 text-brand-blue border-brand-blue/10',
  passed: 'bg-gray-50 text-gray-400 border-gray-100',
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
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
