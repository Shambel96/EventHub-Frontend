/**
 * Extracts a list of items from various common API response shapes.
 */
export const extractList = (response: any): any[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.items)) return response.items;
  
  // Specific entity keys
  if (Array.isArray(response?.data?.users)) return response.data.users;
  if (Array.isArray(response?.data?.events)) return response.data.events;
  if (Array.isArray(response?.data?.categories)) return response.data.categories;
  if (Array.isArray(response?.users)) return response.users;
  if (Array.isArray(response?.events)) return response.events;
  if (Array.isArray(response?.categories)) return response.categories;
  
  return [];
};
