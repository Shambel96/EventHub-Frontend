
import { useAuthStore } from '../stores/auth'

export default defineNuxtPlugin(() => {
  const config  = useRuntimeConfig()
  const baseURL = config.public.apiBase as string || 'http://localhost:3000'

  async function $api<T = unknown>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const authStore = useAuthStore()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> ?? {}),
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    const res = await fetch(`${baseURL}${path}`, {
      ...options,
      headers,
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
      throw new Error(json.message ?? 'Request failed')
    }

    return json.data as T
  }

  return {
    provide: { api: $api },
  }
})