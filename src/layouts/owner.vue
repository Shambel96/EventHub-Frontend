<template>
  <div class="min-h-screen bg-[#f8fafc] font-sans text-brand-blue selection:bg-brand-yellow/30 relative">
    <!-- Main Content Area -->
    <main class="flex-1 lg:mr-80 min-h-screen p-6 lg:p-12 overflow-y-auto transition-all duration-300">
      <div class="max-w-6xl mx-auto pb-20">
        <slot />
      </div>
    </main>

    <!-- Right Sidebar (Owner Navigation) -->
    <aside class="hidden lg:flex w-80 h-screen bg-white border-l border-gray-100 flex-col fixed right-0 top-0 z-50 shadow-2xl shadow-brand-blue/5">
      <!-- Profile Header -->
      <div class="p-10 border-b border-gray-50 flex flex-col items-center text-center group">
        <NuxtLink to="/owner/profile" class="relative">
          <div class="w-24 h-24 rounded-3xl overflow-hidden mb-4 ring-4 ring-brand-yellow/10 group-hover:ring-brand-yellow/30 transition-all duration-500 shadow-xl">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Owen" alt="Owner" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-yellow border-4 border-white rounded-full flex items-center justify-center">
             <div class="w-1.5 h-1.5 bg-brand-blue rounded-full"></div>
          </div>
        </NuxtLink>
        <h3 class="text-xl font-black text-brand-blue leading-tight mb-1">Owen Owner</h3>
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">Event Professional</p>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-8 space-y-2">
        <p class="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Management Dashboard</p>
        
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          class="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300 group"
          :class="[$route.path === item.path ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-gray-400 hover:bg-gray-50 hover:text-brand-blue']"
        >
          <component :is="item.icon" class="w-5 h-5 transition-transform group-hover:scale-110" />
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Bottom Actions -->
      <div class="p-8 space-y-4">
        <NuxtLink to="/events/create" class="flex items-center justify-center gap-2 w-full py-4 bg-brand-yellow text-brand-blue rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-brand-yellow/10 hover:-translate-y-1 active:translate-y-0 transition-all">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          Host New Event
        </NuxtLink>
        <button class="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">Sign Out</button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const navItems = [
  { 
    name: 'Overview', 
    path: '/owner', 
    icon: {
      template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>'
    }
  },
  { 
    name: 'My Events', 
    path: '/owner/events', 
    icon: {
      template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
    }
  },
  { 
    name: 'My Profile', 
    path: '/owner/profile', 
    icon: {
      template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>'
    }
  }
];
</script>
