import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user  = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.role === 'ADMIN')

  function hydrate() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser  = localStorage.getItem(USER_KEY)
      if (storedToken) token.value = storedToken
      if (storedUser)  {
        try { user.value = JSON.parse(storedUser) } catch {}
      }
    }
  }

  function persist() {
    if (import.meta.client) {
      if (token.value) localStorage.setItem(TOKEN_KEY, token.value)
      else             localStorage.removeItem(TOKEN_KEY)

      if (user.value) localStorage.setItem(USER_KEY, JSON.stringify(user.value))
      else            localStorage.removeItem(USER_KEY)
    }
  }

  async function login(email: string, password: string) {
    const data = await authService.login(email, password)
    token.value = data.token
    user.value  = data.user
    persist()
  }

  async function register(name: string, email: string, password: string) {
    const data = await authService.register(name, email, password)
    token.value = data.token
    user.value  = data.user
    persist()
  }

  function logout() {
    token.value = null
    user.value  = null
    persist()
  }

  hydrate()

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    hydrate,
  }
})