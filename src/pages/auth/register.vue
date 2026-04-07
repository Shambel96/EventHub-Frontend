<template>
  <AuthCard>
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-white tracking-tight">Create account</h1>
      <p class="text-sm text-white/50 mt-1">Join EventHub and start discovering</p>
    </div>

    <div
      v-if="authError"
      class="flex items-center gap-2 bg-red-500/15 border border-red-400/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-5"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="0.8" fill="currentColor"/>
      </svg>
      {{ authError }}
    </div>

    <form class="flex flex-col gap-4" novalidate @submit.prevent="handleSubmit">
      <AuthInput
        v-model="form.name"
        label="Full name"
        type="text"
        placeholder="John Doe"
        autocomplete="name"
        :error="errors.name"
      >
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.6"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </template>
      </AuthInput>

      <AuthInput
        v-model="form.email"
        label="Email address"
        type="email"
        placeholder="event@example.com"
        autocomplete="email"
        :error="errors.email"
      >
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/>
            <path d="M2 8l10 6 10-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          </svg>
        </template>
      </AuthInput>

      <AuthInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.password"
      >
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </template>
      </AuthInput>

      <div v-if="form.password" class="flex items-center gap-2 -mt-1">
        <div class="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{ width: `${strengthPercent}%` }"
            :class="{
              'bg-red-400':    strengthLevel === 'weak',
              'bg-yellow-400': strengthLevel === 'medium',
              'bg-green-400':  strengthLevel === 'strong',
            }"
          />
        </div>
        <span
          class="text-xs whitespace-nowrap"
          :class="{
            'text-red-400':    strengthLevel === 'weak',
            'text-yellow-400': strengthLevel === 'medium',
            'text-green-400':  strengthLevel === 'strong',
          }"
        >
          {{ strengthLabel }}
        </span>
      </div>

      <AuthInput
        v-model="form.confirmPassword"
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        autocomplete="new-password"
        :error="errors.confirmPassword"
      >
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </template>
      </AuthInput>

      <p class="text-xs text-white/30 -mt-1">
        By creating an account you agree to our
        <a href="#" class="text-white/60 hover:text-white transition-colors">Terms</a> and
        <a href="#" class="text-white/60 hover:text-white transition-colors">Privacy Policy</a>.
      </p>

      <AuthButton type="submit" :loading="isLoading" class="mt-1">
        Create account
      </AuthButton>
    </form>

    <div class="flex items-center gap-3 my-6">
      <div class="flex-1 h-px bg-white/10" />
      <span class="text-xs text-white/30">or</span>
      <div class="flex-1 h-px bg-white/10" />
    </div>

    <p class="text-center text-sm text-white/40">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-white font-semibold hover:text-white/80 transition-colors ml-1">
        Sign in
      </NuxtLink>
    </p>
  </AuthCard>
</template>

<script setup lang="ts">
import {  reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

onBeforeMount(() => {
  if (authStore.user && authStore.user) {
    router.replace('/')
  }
})

const form = reactive<{
  name: string
  email: string
  password: string
  confirmPassword: string
}>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const errors = reactive({ name: '', email: '', password: '', confirmPassword: '' })
const isLoading = ref(false)
const authError = ref('')

const strengthPercent = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8)            score += 25
  if (p.length >= 12)           score += 15
  if (/[A-Z]/.test(p))         score += 20
  if (/[0-9]/.test(p))         score += 20
  if (/[^A-Za-z0-9]/.test(p))  score += 20
  return Math.min(score, 100)
})

const strengthLevel = computed(() => {
  const s = strengthPercent.value
  if (s < 40) return 'weak'
  if (s < 70) return 'medium'
  return 'strong'
})

const strengthLabel = computed(() => ({
  weak:   'Weak',
  medium: 'Moderate',
  strong: 'Strong',
}[strengthLevel.value]))

function validate(): boolean {
  Object.assign(errors, { name: '', email: '', password: '', confirmPassword: '' })
  let valid = true

  if (!form.name.trim()) {
    errors.name = 'Full name is required.'
    valid = false
  }
  if (!form.email) {
    errors.email = 'Email is required.'
    valid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.'
    valid = false
  }
  if (!form.password) {
    errors.password = 'Password is required.'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
    valid = false
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.'
    valid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  authError.value = ''
  if (!validate()) return

  isLoading.value = true
  try {
    await authStore.register(form.name, form.email, form.password)
    router.replace('/')
  } catch (err: any) {
authError.value =
  err?.data?.message ||
  err?.message ||
  'Something went wrong. Please try again.'  } finally {
    isLoading.value = false
  }
}
</script>