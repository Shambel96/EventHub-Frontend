// middleware/guest.ts
// Redirects already-authenticated users away from login/register pages.
// Add `definePageMeta({ middleware: 'guest' })` to login & register pages.

import { useAuthStore } from '../stores/auth'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (authStore.isAuthenticated && authStore.user) {
    return navigateTo('/')
  }
})
