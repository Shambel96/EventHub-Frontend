import { useAuthStore } from '../stores/auth';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const baseURL = (config.public.apiBaseURL as string) || 'http://localhost:3344';

  const $authFetch = async <T>(request: string, options: any = {}) => {
    return $fetch<T>(request, {
      baseURL,
      ...options,
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
        ...options.headers,
      },
      onResponseError({ response }) {
        if (response.status === 401) {
          console.error('Unauthorized access - potential token expiration');
          authStore.logout();
        }
      }
    });
  };

  const $fetchNoAuth = async <T>(request: string, options: any = {}) => {
    return $fetch<T>(request, {
      baseURL,
      ...options,
    });
  };

  return { $authFetch, $fetchNoAuth };
};
