<template>
  <div class="space-y-12">
    <!-- Header -->
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black text-brand-blue mb-2 tracking-tight">Admin Overview</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Welcome back, {{ authStore.user?.name || 'Admin' }}. System is healthy and operational.</p>
      </div>
      <div class="flex items-center gap-3 px-4 py-2 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest animate-pulse border border-green-100">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
        Live Performance
      </div>
    </header>
    
    <!-- Error State -->
    <div v-if="eventsStore.error || usersStore.error" class="p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-600">
      <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <div>
        <p class="text-sm font-black uppercase tracking-widest">Platform Access Error</p>
        <p class="text-xs font-bold opacity-80">{{ eventsStore.error || usersStore.error }}</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-brand-blue/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Events</p>
          <h3 class="text-5xl font-black text-brand-blue">{{ statsStore.platformStats.totalEvents || eventsStore.totalCount }}</h3>
        </div>
      </div>

      <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Active Users</p>
          <h3 class="text-5xl font-black text-brand-blue">{{ statsStore.platformStats.totalUsers || usersStore.totalCount }}</h3>
        </div>
      </div>

      <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-brand-yellow/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-blue mb-6">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Growth Rate</p>
          <h3 class="text-5xl font-black text-brand-blue">{{ statsStore.platformStats.growthRate }}%</h3>
        </div>
      </div>
    </div>

    <!-- Content Split -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Events Snapshot -->
      <section class="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-black text-brand-blue">Recent Experiences</h2>
          <NuxtLink to="/admin/events" class="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">View All</NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-if="eventsStore.isLoading" class="animate-pulse space-y-4">
            <div v-for="i in 3" :key="i" class="h-20 bg-gray-50 rounded-2xl"></div>
          </div>
          <div v-else v-for="event in eventsStore.events.slice(0, 4)" :key="event.id" class="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-brand-blue/10 text-brand-blue overflow-hidden flex items-center justify-center">
              <img v-if="event.featuredImage" :src="event.featuredImage" class="w-full h-full object-cover" />
              <span v-else class="font-black text-xs">EV</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-brand-blue mb-0.5">{{ event.title }}</p>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ event.location }}</p>
            </div>
            <span class="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-100">Live</span>
          </div>
          <div v-if="!eventsStore.isLoading && !eventsStore.events.length" class="text-center py-10 text-gray-400 font-bold text-sm italic border-2 border-dashed border-gray-50 rounded-2xl">No events found in the database.</div>
        </div>
      </section>

      <!-- Member Directory Snapshot -->
      <section class="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-black text-brand-blue">Recent Members</h2>
          <NuxtLink to="/admin/users" class="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline">Manage Directory</NuxtLink>
        </div>
        <div class="space-y-4">
          <div v-if="usersStore.isLoading" class="animate-pulse space-y-4">
            <div v-for="i in 3" :key="i" class="h-20 bg-gray-50 rounded-2xl"></div>
          </div>
          <div v-else v-for="user in usersStore.users.slice(0, 4)" :key="user.id" class="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center overflow-hidden border border-gray-100">
               <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" alt="avatar" />
               <span v-else class="font-black text-xs text-brand-blue">{{ user.name.charAt(0) }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-brand-blue mb-0.5">{{ user.name }}</p>
              <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ user.email }}</p>
            </div>
            <span class="px-3 py-1 bg-brand-blue/5 text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-lg border border-brand-blue/10">{{ user.role }}</span>
          </div>
          <div v-if="!usersStore.isLoading && !usersStore.users.length" class="text-center py-10 text-gray-400 font-bold text-sm italic border-2 border-dashed border-gray-50 rounded-2xl">The member directory is currently empty.</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useEventsStore } from '../../stores/eventsStore';
import { useUsersStore } from '../../stores/usersStore';
import { useStatsStore } from '../../stores/statsStore';
import { useAuthStore } from '../../stores/auth';

definePageMeta({
  layout: 'admin'
});

const eventsStore = useEventsStore();
const usersStore = useUsersStore();
const statsStore = useStatsStore();
const authStore = useAuthStore();

const refreshDashboard = async () => {
  await Promise.all([
    statsStore.fetchPlatformStats(),
    eventsStore.fetchEvents(),
    eventsStore.fetchTotalCount(),
    usersStore.fetchUsers()
  ]);
};

onMounted(() => {
  console.log('Admin Dashboard Mounted');
  authStore.fetchProfile();
  refreshDashboard();
});
</script>
