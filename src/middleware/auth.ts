// middleware/auth.ts
// Protects routes that require authentication.
// Add `definePageMeta({ middleware: 'auth' })` to any protected page.

import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath },   
    })
  }
})