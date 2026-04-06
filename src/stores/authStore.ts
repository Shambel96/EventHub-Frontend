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

  const hydrate = () => {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        token.value = storedToken;
      } else if (config.public.testToken) {
        // Fallback to test token if no local storage token exists
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
        baseURL: (config.public.apiBaseURL as string) || 'http://localhost:3344',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      user.value = response;
      persistUser();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch profile';
      console.error('Profile fetch error:', err);
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
    logout
  };
});
