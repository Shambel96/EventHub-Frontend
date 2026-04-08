import { useAuthStore } from '../stores/authStore';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const baseURL = 'http://localhost:3000';

  const $authFetch = async <T>(request: string, options: any = {}) => {
      console.log('Token:', authStore.token) 
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
