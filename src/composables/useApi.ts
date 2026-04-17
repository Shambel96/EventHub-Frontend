import { useAuthStore } from '../stores/auth';

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBaseURL as string) || 'http://localhost:3344';

  /**
   * Resolve media URLs by prepending the base URL if needed.
   */
  const resolveMediaUrl = (path?: string | null) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
      return path;
    }
    const normalizedBase = baseURL.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  };

  const $authFetch = async <T>(request: string, options: any = {}) => {
    const authStore = useAuthStore();
    const isFormData = options.body instanceof FormData;

    return $fetch<T>(request, {
      baseURL,
      ...options,
      headers: {
        Authorization: authStore.token ? `Bearer ${authStore.token}` : '',
        ...(!isFormData ? options.headers : {}),
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

  return {
    $authFetch,
    $fetchNoAuth,
    baseURL,
    resolveMediaUrl
  };
};
