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

const TOKEN_KEY = 'auth_token'
const USER_KEY  = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const { $authFetch, $fetchNoAuth, resolveMediaUrl, baseURL } = useApi();
  
  const token = ref<string | null>(null)
  const user  = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin         = computed(() => user.value?.role === 'ADMIN')
  const isOwner         = computed(() => user.value?.role === 'OWNER')

  function normalizeUser(rawUser: User) {
    const avatarValue = rawUser.avatar || rawUser.avatarUrl || rawUser.profileImage
    return {
      ...rawUser,
      avatar: resolveMediaUrl(avatarValue),
    }
  }

  function hydrate() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      const storedUser  = localStorage.getItem(USER_KEY)
      if (storedToken) token.value = storedToken
      if (storedUser)  {
        try { user.value = normalizeUser(JSON.parse(storedUser)) } catch {}
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
    user.value  = normalizeUser(data.user)
    persist()
  }

  async function register(name: string, email: string, password: string) {
    const data = await authService.register(name, email, password)
    token.value = data.token
    user.value  = normalizeUser(data.user)
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
      const response = await $authFetch<User | ApiResponse<User>>('/users/me')
      const profile = (response as ApiResponse<User>)?.data ?? response
      user.value = normalizeUser(profile as User)
      persist()
      return user.value
    } catch (err: any) {
      console.error('Profile fetch error:', err)
      // Note: 401 is handled by $authFetch automatically
      throw err
    }
  }

  async function updateProfile(updates: ProfileUpdatePayload) {
    if (!token.value || !user.value?.id) return null

    try {
      const response = await $authFetch<User | ApiResponse<User>>(`/users/${user.value.id}`, {
        method: 'PATCH',
        body: updates,
      })

      const updatedProfile = normalizeUser(((response as ApiResponse<User>)?.data ?? response) as User)
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
