<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="max-w-4xl mx-auto space-y-12 pb-20">
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              <NuxtLink to="/" class="hover:text-brand-blue transition-colors">Home</NuxtLink>
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              <span class="text-brand-blue">My Profile</span>
            </nav>
            <h1 class="text-3xl lg:text-4xl font-black text-brand-blue tracking-tight">Profile Settings</h1>
            <p class="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Customize how you're seen across EventHub</p>
          </div>

          <button
            @click="saveProfile"
            class="w-full md:w-auto px-8 py-3 bg-brand-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-blue/20 hover:scale-105 transition-transform"
          >
            Save Changes
          </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div class="space-y-8">
            <div class="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm text-center">
              <div class="relative inline-block group">
                <div class="w-32 h-32 rounded-3xl overflow-hidden mb-6 ring-8 ring-gray-50 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                  <img :src="profileData.avatar" alt="User avatar" class="w-full h-full object-cover" />
                </div>
                <button class="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-yellow text-brand-blue rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </div>
              <h3 class="text-xl font-black text-brand-blue mb-1">{{ profileData.name }}</h3>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ profileData.role }} ACCESS</p>
            </div>

            <div class="p-8 bg-brand-blue text-white rounded-3xl shadow-xl shadow-brand-blue/10 overflow-hidden relative group">
              <div class="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div class="relative z-10 space-y-6">
                <h4 class="text-[10px] font-black uppercase tracking-widest opacity-60">Account Vitality</h4>
                <div v-for="stat in stats" :key="stat.label">
                  <p class="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">{{ stat.label }}</p>
                  <p class="text-2xl font-black">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-8">
            <section class="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Display Name</label>
                  <input v-model="profileData.name" type="text" class="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/10 transition-all outline-none" />
                </div>
                <div class="space-y-3">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Identity</label>
                  <input v-model="profileData.email" type="email" class="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-blue opacity-50 cursor-not-allowed" disabled />
                </div>
              </div>

              <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal Residency (Location)</label>
                <input v-model="profileData.location" type="text" class="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/10 transition-all outline-none" />
              </div>

              <div class="space-y-3">
                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Professional Biography (Bio)</label>
                <textarea v-model="profileData.bio" rows="6" class="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/10 transition-all outline-none resize-none"></textarea>
              </div>
            </section>

            <section class="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm">
              <h4 class="text-xs font-black text-brand-blue uppercase tracking-widest mb-8">Communications Center</h4>
              <div class="space-y-6">
                <div v-for="i in 2" :key="i" class="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all">
                  <div>
                    <p class="text-sm font-extrabold text-brand-blue mb-0.5">Automated Notification Log {{ i }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Receive email updates for saved and upcoming events</p>
                  </div>
                  <div class="w-12 h-6 bg-brand-blue/20 rounded-full cursor-not-allowed relative">
                    <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <Transition name="slide-up">
          <div v-if="showSuccessToast" class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-4 border border-white/10 backdrop-blur-xl">
            <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p class="text-[10px] font-black uppercase tracking-widest">Personal profile updated effectively</p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()

const profileData = ref({
  name: authStore.user?.name || 'EventHub User',
  email: authStore.user?.email || 'user@eventhub.com',
  location: 'City Center',
  bio: 'I use EventHub to discover exciting events, save favorites, and keep track of what is happening around me.',
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(authStore.user?.name || 'EventHub User')}&background=113672&color=ffffff`,
  role: authStore.user?.role || 'USER',
})

const stats = computed(() => [
  { label: 'Account Role', value: profileData.value.role },
  { label: 'Saved Experiences', value: '12 Active' },
  { label: 'Profile Status', value: 'Ready' },
])

const showSuccessToast = ref(false)

const saveProfile = () => {
  showSuccessToast.value = true
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.5s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
