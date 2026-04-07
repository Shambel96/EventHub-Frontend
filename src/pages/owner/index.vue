<template>
  <div class="space-y-12">
    <!-- Header -->
    <header class="flex justify-between items-end">
      <div>
        <h1 class="text-4xl font-black text-brand-blue mb-2 tracking-tight">Owner Dashboard</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Welcome back, Owen. Here's a summary of your performance.</p>
      </div>
      <div class="flex items-center gap-3 px-4 py-2 bg-brand-yellow/10 text-brand-blue rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-yellow/20">
        <span class="w-1.5 h-1.5 bg-brand-yellow rounded-full"></span>
        Personal Oversight
      </div>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-brand-blue/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">My Events</p>
          <h3 class="text-5xl font-black text-brand-blue">12</h3>
        </div>
      </div>

      <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Engaged Attendees</p>
          <h3 class="text-5xl font-black text-brand-blue">854</h3>
        </div>
      </div>

      <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-brand-yellow/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
        <div class="relative z-10">
          <div class="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-blue mb-6">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <p class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Est. Revenue</p>
          <h3 class="text-5xl font-black text-brand-blue">$4.2k</h3>
        </div>
      </div>
    </div>

    <!-- Recent Activity Snapshot -->
    <div class="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
      <div class="flex justify-between items-center mb-10 border-b border-gray-50 pb-6">
        <div>
          <h2 class="text-2xl font-black text-brand-blue tracking-tight">Active Registrations</h2>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time engagement across your events</p>
        </div>
        <NuxtLink to="/owner/events" class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-blue border border-brand-blue/10 rounded-xl hover:bg-brand-blue hover:text-white transition-all">Manage All Events</NuxtLink>
      </div>

      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="flex items-center gap-6 p-5 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 hover:shadow-lg hover:shadow-brand-blue/5 transition-all group">
          <div class="w-14 h-14 bg-brand-blue text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl shadow-brand-blue/10">EV</div>
          <div class="flex-1">
             <div class="flex items-center gap-2 mb-1">
               <p class="text-sm font-extrabold text-brand-blue">Summer Tech Workshop {{ i }}</p>
               <span class="px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-md border border-green-100">Ongoing</span>
             </div>
             <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Main Hall, Convention Center</p>
          </div>
          <div class="text-right">
             <p class="text-xs font-black text-brand-blue uppercase tracking-widest">42 / 100</p>
             <div class="w-24 h-1 bg-gray-100 rounded-full mt-2 overflow-hidden shadow-inner">
               <div class="h-full bg-brand-blue transition-all duration-1000" :style="{ width: '42%' }"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'owner'
});
</script>
