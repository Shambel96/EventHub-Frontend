<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'

onMounted(async () => {
  // Safe hydration after Pinia and App are fully mounted in the browser
  const authStore = useAuthStore()
  
  authStore.hydrate()
  
  if (authStore.isAuthenticated) {
    await authStore.fetchProfile()
  }
})
</script>