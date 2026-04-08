<template>
  <div class="max-w-4xl mx-auto space-y-12">
    <!-- Breadcrumbs -->
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
            <img :src="avatarUrl" alt="Admin avatar" class="w-full h-full object-cover" @error="handleAvatarError" />
          </div>
          <button @click="openAvatarManager" class="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all ring-4 ring-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </div>
        
        <div class="flex-1 mb-2 text-center md:text-left">
          <div class="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3">
            <h1 class="text-3xl lg:text-4xl font-black text-brand-blue">{{ displayName }}</h1>
            <span class="px-3 py-1 bg-brand-yellow text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-full">{{ displayRole }}</span>
          </div>
          <p class="text-gray-400 font-bold mt-1">{{ displayEmail }}</p>
        </div>

        <div class="flex gap-3 mb-2 w-full md:w-auto justify-center">
          <button
            @click="toggleEditMode"
            class="px-6 py-3 bg-brand-blue text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform"
          >
            {{ isEditing ? 'Cancel Edit' : 'Edit Profile' }}
          </button>
          <button
            v-if="isEditing"
            @click="saveProfile"
            :disabled="isSaving"
            class="px-6 py-3 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-600/20 hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {{ isSaving ? 'Saving...' : 'Save Profile' }}
          </button>
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
          <p v-if="!isEditing" class="text-gray-500 font-bold leading-relaxed">
            {{ displayBio }}
          </p>
          <textarea
            v-else
            v-model="form.bio"
            rows="6"
            class="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/10 transition-all outline-none resize-none"
          />
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
            <p class="text-sm font-bold text-brand-blue">{{ displayEmail }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
            <p v-if="!isEditing" class="text-sm font-bold text-brand-blue">{{ displayPhone }}</p>
            <input
              v-else
              v-model="form.phone"
              type="text"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
            />
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
            <p v-if="!isEditing" class="text-sm font-bold text-brand-blue">{{ displayLocation }}</p>
            <input
              v-else
              v-model="form.location"
              type="text"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
            />
          </div>
          <div class="space-y-1">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Date</p>
            <p class="text-sm font-bold text-brand-blue">{{ displayJoinedDate }}</p>
          </div>
          <div class="space-y-1 sm:col-span-2">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Display Name</p>
            <p v-if="!isEditing" class="text-sm font-bold text-brand-blue">{{ displayName }}</p>
            <input
              v-else
              v-model="form.name"
              type="text"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
            />
          </div>
          <template v-if="isEditing">
            <div class="space-y-1 sm:col-span-2 pt-2">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Password</p>
              <p class="text-xs font-bold text-gray-400">Leave these blank if you do not want to change your password.</p>
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Password</p>
              <input
                v-model="form.currentPassword"
                type="password"
                autocomplete="current-password"
                class="w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white transition-all outline-none"
                :class="passwordError ? 'border-red-200 focus:border-red-200' : 'border-gray-200 focus:border-brand-blue/20'"
              />
            </div>
            <div class="space-y-1">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">New Password</p>
              <input
                v-model="form.newPassword"
                type="password"
                autocomplete="new-password"
                class="w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white transition-all outline-none"
                :class="passwordError ? 'border-red-200 focus:border-red-200' : 'border-gray-200 focus:border-brand-blue/20'"
              />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Confirm New Password</p>
              <input
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                class="w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white transition-all outline-none"
                :class="passwordError ? 'border-red-200 focus:border-red-200' : 'border-gray-200 focus:border-brand-blue/20'"
              />
              <p v-if="passwordError" class="text-xs font-bold text-red-500 mt-2">{{ passwordError }}</p>
            </div>
          </template>
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
          <h3 class="text-xs font-black uppercase tracking-widest mb-6 opacity-60">Admin Stats</h3>
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

    <div v-if="isLoading" class="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-40">
      <div class="px-6 py-4 rounded-2xl bg-white shadow-xl border border-gray-100 text-sm font-bold text-brand-blue">
        Loading profile...
      </div>
    </div>

    <div v-if="isAvatarManagerOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue/40 backdrop-blur-sm p-4">
      <div class="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100">
        <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 class="text-xl font-black text-brand-blue tracking-tight">Avatar Manager</h3>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Choose, filter, or paste a new profile image</p>
          </div>
          <button @click="closeAvatarManager" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="p-8 space-y-6 overflow-y-auto">
          <div class="grid gap-4 md:grid-cols-[160px_1fr] items-start">
            <div class="w-32 h-32 rounded-3xl overflow-hidden ring-8 ring-gray-50 shadow-inner bg-gray-100">
              <img :src="avatarPreviewUrl" class="w-full h-full object-cover" @error="handlePreviewAvatarError" />
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Avatar Image URL</label>
                <input
                  v-model="avatarDraft"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
                />
              </div>
              <div>
                <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Filter Presets</label>
                <input
                  v-model="avatarFilter"
                  type="text"
                  placeholder="Search avatar style or source"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-brand-blue focus:ring-4 focus:ring-brand-blue/5 focus:bg-white focus:border-brand-blue/20 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              v-for="preset in filteredAvatarPresets"
              :key="preset.url"
              @click="selectAvatarPreset(preset.url)"
              class="group rounded-2xl border p-3 transition-all text-left"
              :class="avatarDraft === preset.url ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-100 hover:border-brand-blue/20 hover:bg-gray-50'"
            >
              <div class="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-3">
                <img :src="preset.url" class="w-full h-full object-cover" />
              </div>
              <p class="text-[10px] font-black uppercase tracking-widest text-brand-blue">{{ preset.label }}</p>
              <p class="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">{{ preset.group }}</p>
            </button>
          </div>
        </div>

        <div class="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row gap-3 justify-end">
          <button @click="closeAvatarManager" class="px-6 py-3 rounded-2xl border border-gray-200 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
            Cancel
          </button>
          <button @click="applyAvatarSelection" class="px-6 py-3 rounded-2xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform">
            Use This Avatar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, reactive, ref, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const isLoading = ref(false)
const isSaving = ref(false)
const isEditing = ref(false)
const isAvatarManagerOpen = ref(false)
const avatarFilter = ref('')
const avatarDraft = ref('')
const isAvatarBroken = ref(false)
const isPreviewAvatarBroken = ref(false)
const passwordError = ref('')
const form = reactive({
  name: '',
  bio: '',
  location: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  isLoading.value = true
  authStore.fetchProfile().finally(() => {
    isLoading.value = false
  })
})

definePageMeta({
  layout: 'admin'
})

watch(
  () => authStore.user,
  (user) => {
    form.name = user?.name || ''
    form.bio = user?.bio || ''
    form.location = user?.location || ''
    form.phone = user?.phone || ''
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    avatarDraft.value = user?.avatar || user?.avatarUrl || user?.profileImage || ''
    isAvatarBroken.value = false
    isPreviewAvatarBroken.value = false
    passwordError.value = ''
  },
  { immediate: true }
)

const displayName = computed(() => authStore.user?.name || 'Admin User')
const displayRole = computed(() => authStore.user?.role || 'ADMIN')
const displayEmail = computed(() => authStore.user?.email || 'No email available')
const displayBio = computed(() => authStore.user?.bio || 'Administrator profile information will appear here once it is available from the backend.')
const displayPhone = computed(() => authStore.user?.phone || 'Not specified')
const displayLocation = computed(() => authStore.user?.location || 'Not specified')
const displayJoinedDate = computed(() => {
  const joinedValue = authStore.user?.joinedDate || authStore.user?.createdAt
  if (!joinedValue) return 'Not available'

  const parsed = new Date(joinedValue)
  if (Number.isNaN(parsed.getTime())) return joinedValue

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
const fallbackAvatarUrl = computed(() => `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=113672&color=ffffff`)
const avatarUrl = computed(() => {
  const value = authStore.user?.avatar || authStore.user?.avatarUrl || authStore.user?.profileImage
  return !isAvatarBroken.value && value ? value : fallbackAvatarUrl.value
})
const avatarPreviewUrl = computed(() => !isPreviewAvatarBroken.value && avatarDraft.value ? avatarDraft.value : fallbackAvatarUrl.value)

const avatarPresets = computed(() => {
  const seed = encodeURIComponent(displayName.value || 'Admin User')
  return [
    { label: 'Initials Blue', group: 'UI Avatars', url: `https://ui-avatars.com/api/?name=${seed}&background=113672&color=ffffff&size=256` },
    { label: 'Initials Gold', group: 'UI Avatars', url: `https://ui-avatars.com/api/?name=${seed}&background=caa55b&color=113672&size=256` },
    { label: 'Avataaars', group: 'DiceBear', url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` },
    { label: 'Bottts', group: 'DiceBear', url: `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}` },
    { label: 'Lorelei', group: 'DiceBear', url: `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}` },
    { label: 'Thumbs', group: 'DiceBear', url: `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}` },
    { label: 'Shapes', group: 'DiceBear', url: `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}` },
    { label: 'Glass', group: 'Gradient', url: `https://ui-avatars.com/api/?name=${seed}&background=0f766e&color=ffffff&rounded=true&bold=true&size=256` },
  ]
})
const filteredAvatarPresets = computed(() => {
  const query = avatarFilter.value.trim().toLowerCase()
  if (!query) return avatarPresets.value
  return avatarPresets.value.filter((preset) =>
    preset.label.toLowerCase().includes(query) || preset.group.toLowerCase().includes(query)
  )
})

function toggleEditMode() {
  if (isEditing.value) {
    form.name = authStore.user?.name || ''
    form.bio = authStore.user?.bio || ''
    form.location = authStore.user?.location || ''
    form.phone = authStore.user?.phone || ''
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    passwordError.value = ''
  }

  isEditing.value = !isEditing.value
}

async function saveProfile() {
  passwordError.value = ''

  const wantsPasswordChange = !!(form.currentPassword || form.newPassword || form.confirmPassword)

  if (wantsPasswordChange) {
    if (!form.currentPassword) {
      passwordError.value = 'Current password is required to change your password.'
      return
    }

    if (!form.newPassword) {
      passwordError.value = 'New password is required.'
      return
    }

    if (form.newPassword.length < 6) {
      passwordError.value = 'New password must be at least 6 characters.'
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      passwordError.value = 'New password and confirmation do not match.'
      return
    }
  }

  isSaving.value = true
  try {
    await authStore.updateProfile({
      name: form.name,
      bio: form.bio,
      location: form.location,
      phone: form.phone,
      avatar: avatarDraft.value || undefined,
      currentPassword: wantsPasswordChange ? form.currentPassword : undefined,
      newPassword: wantsPasswordChange ? form.newPassword : undefined,
      password: wantsPasswordChange ? form.newPassword : undefined,
    })
    form.currentPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    isEditing.value = false
  } finally {
    isSaving.value = false
  }
}

function openAvatarManager() {
  avatarDraft.value = authStore.user?.avatar || authStore.user?.avatarUrl || authStore.user?.profileImage || ''
  avatarFilter.value = ''
  isPreviewAvatarBroken.value = false
  isAvatarManagerOpen.value = true
}

function closeAvatarManager() {
  isAvatarManagerOpen.value = false
}

function selectAvatarPreset(url: string) {
  avatarDraft.value = url
  isPreviewAvatarBroken.value = false
}

function applyAvatarSelection() {
  isAvatarBroken.value = false
  isPreviewAvatarBroken.value = false
  isEditing.value = true
  isAvatarManagerOpen.value = false
}

function handleAvatarError() {
  isAvatarBroken.value = true
}

function handlePreviewAvatarError() {
  isPreviewAvatarBroken.value = true
}

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
]
</script>
