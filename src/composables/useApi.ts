import { useAuthStore } from '../stores/authStore'

export const useApi = () => {
  const baseURL = 'http://localhost:3000'
  const $authFetch = async <T>(request: string, options: any = {}) => {
    // Read token fresh on every call — not at composable creation time
    const authStore = useAuthStore()
    const token = authStore.token

    console.log('Token:', token) // remove this after confirming it works

    const headers: Record<string, string> = {
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return $fetch<T>(request, {
      baseURL,
      ...options,
      headers,
      onResponseError({ response }) {
        if (response.status === 401) {
          console.error('Unauthorized access - potential token expiration')
        }
      },
    })
  }

  const $fetchNoAuth = async <T>(request: string, options: any = {}) => {
    return $fetch<T>(request, {
      baseURL,
      ...options,
    })
  }

  return { $authFetch, $fetchNoAuth }
}