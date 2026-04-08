<template>
  <div class="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-zinc-900 border border-white/10 rounded-3xl p-10 text-center">
        
        <div v-if="loading" class="py-8">
          <div class="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6"></div>
          <h2 class="text-2xl font-semibold text-white">Verifying your email...</h2>
        </div>

        <div v-else-if="success" class="py-8">
          <div class="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            ✓
          </div>
          <h2 class="text-3xl font-bold text-white mb-3">Email Verified!</h2>
          <p class="text-white/70 mb-8">{{ message }}</p>
          
          <NuxtLink 
            to="/auth/login"
            class="block w-full bg-white text-zinc-950 font-semibold py-4 rounded-2xl hover:bg-white/90 transition"
          >
            Go to Login
          </NuxtLink>
        </div>

        <div v-else-if="error" class="py-8">
          <div class="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
            ✕
          </div>
          <h2 class="text-2xl font-semibold text-red-400 mb-3">Verification Failed</h2>
          <p class="text-white/70 mb-8">{{ error }}</p>
          
          <div class="flex gap-4">
            <NuxtLink 
              to="/"
              class="flex-1 bg-zinc-800 text-white font-medium py-4 rounded-2xl hover:bg-zinc-700"
            >
              Go Home
            </NuxtLink>
            <NuxtLink 
              to="/auth/login"
              class="flex-1 bg-white text-zinc-950 font-medium py-4 rounded-2xl"
            >
              Go to Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const token = route.query.token as string
const email = route.query.email as string

const loading = ref(true)
const success = ref(false)
const error = ref('')
const message = ref('')

type VerifyEmailResponse = {
  message?: string
}

onMounted(async () => {
  if (!token || !email) {
    error.value = "Invalid verification link. Please try again."
    loading.value = false
    return
  }
const API_BASE_URL_HERE = import.meta.env.API_BASE_URL || 'http://localhost:3000'
  try {
    const res = await $fetch<VerifyEmailResponse>(`${API_BASE_URL_HERE}/auth/verify-email?token=${token}&email=${email}`, {
      method: 'GET'
    })

    success.value = true
    message.value = res.message || 'Your email has been verified successfully!'
    
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to verify email. The link may have expired.'
  } finally {
    loading.value = false
  }
})
</script>
