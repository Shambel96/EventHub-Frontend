<template>
  <aside class="w-80 h-screen bg-white border-l border-gray-100 fixed right-0 top-0 z-50 flex flex-col shadow-2xl">
    <!-- Admin Profile Section -->
    <div class="p-8 border-b border-gray-50 bg-gradient-to-br from-brand-blue/5 to-transparent">
      <NuxtLink to="/admin/profile" class="flex flex-col items-center text-center group">
        <div class="relative mb-4">
          <div class="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin Avatar" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
        </div>
        <h3 class="text-xl font-extrabold text-brand-blue group-hover:text-teal-600 transition-colors">Alex Admin</h3>
        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Platform Owner</p>
      </NuxtLink>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto p-6 space-y-2">
      <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-4">Management</p>
      
      <NuxtLink 
        v-for="item in menuItems" 
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 group"
        :class="[
          $route.path === item.path 
            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-brand-blue'
        ]"
      >
        <span class="w-8 h-8 flex items-center justify-center rounded-lg bg-current/10 bg-opacity-20 transition-colors"
          :class="[$route.path === item.path ? 'text-brand-yellow' : 'text-brand-blue/60 group-hover:text-brand-blue']">
          <component :is="item.icon" class="w-5 h-5" />
        </span>
        {{ item.name }}
      </NuxtLink>

      <div class="pt-8 px-4">
        <div class="p-4 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20">
          <p class="text-xs font-bold text-brand-blue leading-relaxed">System status is operational. All services are currently running smoothly.</p>
        </div>
      </div>
    </nav>

    <!-- Logout / Footer -->
    <div class="p-6 border-t border-gray-50 mt-auto">
      <button class="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-50 text-gray-500 font-bold hover:bg-red-50 hover:text-red-500 transition-colors group">
        <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        Sign Out
      </button>
    </div>
  </aside>
</template>

<script setup>
import { h } from 'vue';

const DashboardIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' })]);

const UsersIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' })]);

const EventsIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })]);

const ProfileIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })]);

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: DashboardIcon },
  { name: 'User Directory', path: '/admin/users', icon: UsersIcon },
  { name: 'Events Manager', path: '/admin/events', icon: EventsIcon },
  { name: 'My Profile', path: '/admin/profile', icon: ProfileIcon },
];
</script>
