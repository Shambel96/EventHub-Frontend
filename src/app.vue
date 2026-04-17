<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import Toast from './components/common/Toast.vue'

const router = useRouter()

onMounted(async () => {
  // Safe hydration after Pinia and App are fully mounted in the browser
  const authStore = useAuthStore()
  
  authStore.hydrate()
  
  if (authStore.isAuthenticated) {
    const profile = await authStore.fetchProfile()

    if (!profile) {
      await router.replace('/auth/login')
    }
  }
})
</script>
