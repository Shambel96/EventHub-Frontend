<template>
  <AuthCard medium>
    <div class="mb-7">
      <h1 class="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
      <p class="text-sm text-white/50 mt-1">Sign in to your account to continue</p>
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
        autocomplete="current-password"
        :error="errors.password"
      >
        <template #icon>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.6"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </template>
      </AuthInput>

      <div class="flex justify-end -mt-1">
        <NuxtLink to="/forgot-password" class="text-xs text-white/40 hover:text-white/70 transition-colors">
          Forgot password?
        </NuxtLink>
      </div>

      <AuthButton type="submit" :loading="isLoading" class="mt-1">
        Sign in
      </AuthButton>
    </form>

    <div class="flex items-center gap-3 my-6">
      <div class="flex-1 h-px bg-white/10" />
      <span class="text-xs text-white/30">or</span>
      <div class="flex-1 h-px bg-white/10" />
    </div>

    <p class="text-center text-sm text-white/40">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-white font-semibold hover:text-white/80 transition-colors ml-1">
        Create one
      </NuxtLink>
    </p>
  </AuthCard>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: 'guest' })
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

declare const definePageMeta: (meta: { layout?: boolean; middleware?: string }) => void

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const form   = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const isLoading = ref(false)
const authError = ref('')

function validate(): boolean {
  errors.email    = ''
  errors.password = ''
  let valid = true

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
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
    valid = false
  }
  return valid
}

async function handleSubmit() {
  authError.value = ''
  if (!validate()) return

  isLoading.value = true
  try {
    await authStore.login(form.email, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null

    if (redirect) {
      router.push(redirect)
      return
    }

    if (authStore.user?.role === 'ADMIN') {
      router.push('/admin')
      return
    }

    if (authStore.user?.role === 'OWNER') {
      router.push('/owner')
      return
    }

    router.push('/')
  } catch (err: any) {
    authError.value = err?.message ?? 'Something went wrong. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
