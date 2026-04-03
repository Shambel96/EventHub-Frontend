export const useApi = () => {
  const config = useRuntimeConfig();

  // Static token as per the plan for testing API endpoints
  const token = 'YOUR_STATIC_TOKEN_HERE';
  const baseURL = (config.public.apiBase as string) || 'https://api.example.com/v1';

  const $authFetch = async <T>(request: string, options: any = {}) => {
    return $fetch<T>(request, {
      baseURL,
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  };

  return { $authFetch };
};
