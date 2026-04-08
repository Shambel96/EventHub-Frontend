import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '../types/user';

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();

  const token = ref<string | null>(null);
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role?.toLowerCase() === 'admin');
  const isOwner = computed(() => user.value?.role?.toLowerCase() === 'owner');

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (import.meta.client && newToken) {
      localStorage.setItem('auth_token', newToken);
    } else if (import.meta.client) {
      localStorage.removeItem('auth_token');
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<any>('/auth/login', {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        body: { email, password },
      });

      const data = response?.data;
      setToken(data.token);
      user.value = data.user;
      persistUser();

    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Login failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<any>('/auth/signup', {
        baseURL: 'http://localhost:3000',
        method: 'POST',
        body: { name, email, password },
      });

      // Backend returns { success, message, data: { data: { token, user } } }
      // (double nested — backend wraps twice)
      const data = response?.data?.data ?? response?.data;
      setToken(data.token);
      user.value = data.user;
      persistUser();

    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Registration failed';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const hydrate = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        token.value = storedToken;
      } else if (config.public.testToken) {
        token.value = config.public.testToken as string;
      }

      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser);
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
    }
  };

  const persistUser = () => {
    if (import.meta.client && user.value) {
      localStorage.setItem('auth_user', JSON.stringify(user.value));
    } else if (import.meta.client) {
      localStorage.removeItem('auth_user');
    }
  };

  const fetchProfile = async () => {
    if (!token.value) return;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetch<User>('/users/me', {
        baseURL: (config.public.apiBaseURL as string) || 'http://localhost:3000',
        headers: { Authorization: `Bearer ${token.value}` },
      });
      user.value = response;
      persistUser();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch profile';
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    isOwner,
    setToken,
    hydrate,
    fetchProfile,
    login,
    register,
    logout,
  };
});