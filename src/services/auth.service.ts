// services/auth.service.ts

const BASE_URL = 'http://localhost:3000'

async function post<T>(url: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
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