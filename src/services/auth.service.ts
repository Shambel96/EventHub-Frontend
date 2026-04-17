// services/auth.service.ts

export const authService = {
  async login(email: string, password: string) {
    const config = useRuntimeConfig();
    const baseURL = (config.public.apiBaseURL as string);

    return $fetch<{ data: { token: string; user: any }, success: boolean }>('/auth/login', {
      method: 'POST',
      baseURL,
      body: { email, password }
    }).then(res => res.data);
  },

  async register(name: string, email: string, password: string) {
    const config = useRuntimeConfig();
    const baseURL = (config.public.apiBaseURL as string);

    return $fetch<{ data: { token: string; user: any }, success: boolean }>('/auth/signup', {
      method: 'POST',
      baseURL,
      body: { name, email, password }
    }).then(res => res.data);
  },
}