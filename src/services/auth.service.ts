// services/auth.service.ts

async function post<T>(url: string, body: Record<string, unknown>): Promise<T> {
  // Use runtime config for API base URL
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBaseURL as string) || 'http://localhost:3344';

  const res = await fetch(`${baseURL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Request failed')
  }

  return json.data as T
}

export const authService = {
  async login(email: string, password: string) {
    return post<{ token: string; user: any }>('/auth/login', { email, password })
  },

  async register(name: string, email: string, password: string) {
    return post<{ token: string; user: any }>('/auth/signup', { name, email, password })
  },
}