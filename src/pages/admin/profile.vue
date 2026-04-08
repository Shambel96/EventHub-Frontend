<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
      <NuxtLink to="/admin" class="hover:text-brand-blue">Admin</NuxtLink>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      <span class="text-brand-blue">Profile Settings</span>
    </nav>

    <!-- Profile Header Card -->
    <div class="relative">
      <!-- Cover/Background -->
      <div class="h-48 bg-gradient-to-r from-brand-blue to-teal-600 rounded-3xl shadow-xl shadow-brand-blue/10"></div>
      
      <!-- Profile Info -->
      <div class="px-6 lg:px-10 -mt-12 lg:-mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 lg:gap-8 pb-10 border-b border-gray-100">
        <div class="relative group">
          <div class="w-40 h-40 rounded-3xl border-8 border-white shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
            <img :src="authStore.user?.avatar || 'https://i.pravatar.cc/300?u=admin'" alt="Admin avatar" class="w-full h-full object-cover" />
          </div>
          <button class="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all ring-4 ring-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        
        <div class="flex-1 mb-2 text-center md:text-left">
          <div class="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3">
            <h1 class="text-3xl lg:text-4xl font-black text-brand-blue">{{ authStore.user?.name || 'Loading...' }}</h1>
            <span class="px-3 py-1 bg-brand-yellow text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-full">{{ authStore.user?.role }}</span>
          </div>
          <p class="text-gray-400 font-bold mt-1">{{ authStore.user?.email }}</p>
        </div>

        <div class="flex gap-3 mb-2 w-full md:w-auto justify-center">
          <button class="px-6 py-3 bg-brand-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform">Edit Profile</button>
          <button class="px-3 py-3 border border-gray-200 text-gray-400 rounded-xl hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <!-- Left Column: Personal Info -->
      <div class="md:col-span-2 space-y-12">
        <section>
          <h2 class="text-xl font-black text-brand-blue mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </span>
            Personal Biography
          </h2>
          <p class="text-gray-500 font-bold leading-relaxed">
            Passionate event organizer with over 8 years of experience in managing high-scale tech conferences and music festivals. Dedicated to building the most vibrant community on EventHub by curating premium experiences and empowering local creators.
          </p>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
            <p class="text-sm font-bold text-brand-blue">{{ authStore.user?.email }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
            <p class="text-sm font-bold text-brand-blue">+1 (555) 000-1234</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
            <p class="text-sm font-bold text-brand-blue">{{ authStore.user?.location || 'Not Specified' }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</p>
            <p class="text-sm font-bold text-brand-blue">{{ authStore.user?.joinedDate }}</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-black text-brand-blue mb-6">Profile Settings</h2>
          <div class="space-y-4">
            <div v-for="setting in settings" :key="setting.name" class="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-brand-blue/20 transition-all group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-blue/5 transition-colors">
                  <component :is="setting.icon" class="w-5 h-5 text-gray-400 group-hover:text-brand-blue" />
                </div>
                <div>
                  <p class="text-sm font-bold text-brand-blue">{{ setting.name }}</p>
                  <p class="text-xs text-gray-400 font-bold">{{ setting.desc }}</p>
                </div>
              </div>
              <div class="w-12 h-6 bg-gray-100 rounded-full relative p-1 cursor-pointer">
                <div class="w-4 h-4 bg-white shadow-sm rounded-full" :class="setting.active ? 'ml-6 bg-brand-blue' : ''"></div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Stats & Meta -->
      <div class="space-y-12">
        <section class="bg-brand-blue text-white p-8 rounded-3xl shadow-xl shadow-brand-blue/20">
          <h3 class="text-xs font-black uppercase tracking-widest mb-6 opacity-60">Owner Stats</h3>
          <div class="space-y-8">
            <div v-for="stat in stats" :key="stat.label">
              <p class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">{{ stat.label }}</p>
              <p class="text-4xl font-black flex items-center gap-2">
                {{ stat.value }}
                <span class="text-[10px] opacity-60">items</span>
              </p>
            </div>
          </div>
        </section>

        <div class="p-8 border border-gray-100 rounded-3xl">
           <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Security Level</h3>
           <div class="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-100">
             <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21a11.955 11.955 0 01-8.618-3.04m17.236 0a11.955 11.955 0 01-8.618 3.04" /></svg>
             </div>
             <div>
               <p class="text-xs font-black text-green-700 uppercase tracking-widest">Vault Secure</p>
               <p class="text-[10px] text-green-600 font-bold uppercase tracking-widest">2FA Enabled</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchProfile();
});

definePageMeta({
  layout: 'admin'
});

const MailIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]);
const BellIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })]);
const MonitorIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' })]);

const settings = [
  { name: 'Email Notifications', desc: 'Receive updates about new users', icon: MailIcon, active: true },
  { name: 'System Alerts', desc: 'Get notified for critical bugs', icon: BellIcon, active: true },
  { name: 'Dashboard Tracking', desc: 'Auto-refresh charts and data', icon: MonitorIcon, active: false },
];

const stats = [
  { label: 'Events Published', value: '1,240' },
  { label: 'Users Managed', value: '85,420' },
  { label: 'Comments Moderated', value: '12,050' },
];
</script>
