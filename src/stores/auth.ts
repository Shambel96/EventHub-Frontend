import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'

interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN' | 'OWNER'
  avatar?: string
  avatarUrl?: string
  profileImage?: string
  bio?: string
  location?: string
  joinedDate?: string
  createdAt?: string
  phone?: string
}

interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
}

interface ProfileUpdatePayload extends Partial<User> {
  currentPassword?: string
  newPassword?: string
  password?: string
}

function resolveMediaUrl(baseURL: string, value?: string) {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value

  const normalizedBase = baseURL.replace(/\/$/, '')
  const normalizedPath = value.startsWith('/') ? value : `/${value}`
  return `${normalizedBase}${normalizedPath}`
}

function normalizeUser(rawUser: User, baseURL: string) {
  const avatarValue = rawUser.avatar || rawUser.avatarUrl || rawUser.profileImage
  return {
    ...rawUser,
    avatar: resolveMediaUrl(baseURL, avatarValue),
  }
}

const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user  = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.role === 'ADMIN')
  const isOwner         = computed(() => user.value?.role === 'OWNER')

  function getBaseURL() {
    const config = useRuntimeConfig()
    return (config.public.apiBaseURL as string) || 'http://localhost:3344'
  }

  function hydrate() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser  = localStorage.getItem(USER_KEY)
      if (storedToken) token.value = storedToken
      if (storedUser)  {
        try { user.value = normalizeUser(JSON.parse(storedUser), getBaseURL()) } catch {}
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
    user.value  = normalizeUser(data.user, getBaseURL())
    persist()
  }

  async function register(name: string, email: string, password: string) {
    const data = await authService.register(name, email, password)
    token.value = data.token
    user.value  = normalizeUser(data.user, getBaseURL())
    persist()
  }

  function logout() {
    token.value = null
    user.value  = null
    persist()
  }

  function setToken(newToken: string | null) {
    token.value = newToken
    persist()
  }

  async function fetchProfile() {
    if (!token.value) return

    try {
      const baseURL = getBaseURL()
      const response = await $fetch<User | ApiResponse<User>>('/users/me', {
        baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })

      const profile = (response as ApiResponse<User>)?.data ?? response
      user.value = normalizeUser(profile as User, baseURL)
      persist()
      return user.value
    } catch (err: any) {
      console.error('Profile fetch error:', err)

      if (err?.statusCode === 401 || err?.response?.status === 401) {
        logout()
        return null
      }

      throw err
    }
  }

  async function updateProfile(updates: ProfileUpdatePayload) {
    if (!token.value || !user.value?.id) return null

    try {
      const baseURL = getBaseURL()
      const response = await $fetch<User | ApiResponse<User>>(`/users/${user.value.id}`, {
        method: 'PATCH',
        baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: updates,
      })

      const updatedProfile = normalizeUser(((response as ApiResponse<User>)?.data ?? response) as User, baseURL)
      user.value = { ...user.value, ...updatedProfile }
      persist()
      return user.value
    } catch (err: any) {
      console.error('Profile update error:', err)
      throw err
    }
  }

  hydrate()

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isOwner,
    login,
    register,
    logout,
    setToken,
    fetchProfile,
    updateProfile,
    hydrate,
  }
})
