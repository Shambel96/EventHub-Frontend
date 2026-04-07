<template>
  <nav 
    class="sticky top-0 z-50 w-full transition-all duration-300 border-b"
    :class="[
      isScrolled 
        ? 'bg-white/80 backdrop-blur-md border-gray-200 py-3 shadow-sm' 
        : 'bg-transparent border-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 bg-brand-blue rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
            <span class="text-brand-yellow font-black text-xl">E</span>
          </div>
          <span class="text-2xl font-black tracking-tight text-brand-blue">Event<span class="text-brand-yellow">Hub</span></span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path"
            class="text-sm font-bold transition-colors hover:text-brand-blue"
            :class="[
              isActive(link.path) ? 'text-brand-blue' : 'text-gray-500'
            ]"
          >
            {{ link.name }}
          </NuxtLink>
        </div>

        <!-- Auth Section -->
        <div class="hidden md:flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <div class="relative group">
              <button class="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-gray-100 transition-colors">
                <img 
                  :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=' + authStore.user?.name" 
                  class="w-8 h-8 rounded-full border-2 border-brand-blue shadow-sm"
                  alt="User avatar"
                />
                <span class="text-sm font-bold text-gray-700">{{ authStore.user?.name }}</span>
                <svg class="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <!-- Dropdown -->
              <div class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform scale-95 group-hover:scale-100 origin-top-right">
                <NuxtLink
                  v-if="dashboardLink"
                  :to="dashboardLink.path"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue font-medium"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {{ dashboardLink?.label }}
                </NuxtLink>
                <NuxtLink :to="profileLink" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-blue font-medium">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  My Profile
                </NuxtLink>
                <button 
                  @click="handleLogout" 
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4-4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="text-sm font-bold text-gray-600 hover:text-brand-blue px-4 py-2 transition-colors">
              Login
            </NuxtLink>
            <NuxtLink to="/auth/register" class="bg-brand-blue text-white hover:bg-white hover:text-brand-blue border border-brand-blue px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">
              Sign Up
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 text-brand-blue hover:bg-gray-100 rounded-xl transition-colors"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden">
        <div class="px-4 py-6 space-y-4">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path"
            @click="isMobileMenuOpen = false"
            class="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50 hover:text-brand-blue transition-all"
          >
            {{ link.name }}
          </NuxtLink>
          <hr class="border-gray-100 mx-4" />
          <div v-if="authStore.isAuthenticated" class="space-y-2">
            <div class="px-4 py-3 flex items-center gap-3">
              <img :src="authStore.user?.avatar || 'https://ui-avatars.com/api/?name=' + authStore.user?.name" class="w-10 h-10 rounded-full border-2 border-brand-blue" />
              <div>
                <p class="font-bold text-gray-800">{{ authStore.user?.name }}</p>
                <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
              </div>
            </div>
            <NuxtLink
               v-if="dashboardLink"
               :to="dashboardLink.path"
               @click="isMobileMenuOpen = false"
               class="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50"
            >
              {{ dashboardLink?.label }}
            </NuxtLink>
            <NuxtLink :to="profileLink" @click="isMobileMenuOpen = false" class="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50">
              My Profile
            </NuxtLink>
            <button @click="handleLogout" class="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-red-600 hover:bg-red-50">
              Logout
            </button>
          </div>
          <div v-else class="flex flex-col gap-3 p-4">
            <NuxtLink to="/auth/login" @click="isMobileMenuOpen = false" class="text-center py-3 font-bold text-gray-600 border border-gray-200 rounded-xl">
              Login
            </NuxtLink>
            <NuxtLink to="/auth/register" @click="isMobileMenuOpen = false" class="text-center py-3 font-bold text-white bg-brand-blue rounded-xl shadow-lg">
              Sign Up
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const dashboardLink = computed(() => {
  if (authStore.isAdmin) {
    return { path: '/admin', label: 'Admin Dashboard' };
  }

  if (authStore.isOwner) {
    return { path: '/owner', label: 'Owner Dashboard' };
  }

  return null;
});

const profileLink = computed(() => {
  if (authStore.isAdmin) return '/admin/profile';
  if (authStore.isOwner) return '/owner/profile';
  return '/profile';
});

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Discover', path: '/events' },
  { name: 'Bookmarks', path: '/bookmarks' }
];

const isActive = (path: string) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const handleLogout = async () => {
  isMobileMenuOpen.value = false;
  authStore.logout();
  await router.push('/');
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Optional: Soft page transition */
.router-link-active {
  position: relative;
}
.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--color-brand-blue);
  border-radius: 2px;
}
</style>
