import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Event as AppEvent } from '../types/event';
import { useApi } from '../composables/useApi';
import { formatDuration, parseDuration } from '../utils/durationFormatter';

const resolveMediaUrl = (baseURL: string, value?: string | null) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;

  const normalizedBase = baseURL.replace(/\/$/, '');
  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${normalizedBase}${normalizedPath}`;
};

const extractList = (response: any) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.events)) return response.data.events;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.categories)) return response.data.categories;
  if (Array.isArray(response?.categories)) return response.categories;
  if (Array.isArray(response?.events)) return response.events;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const normalizeEvent = (event: any, baseURL: string): AppEvent => ({
  ...event,
  images: (event.images || []).map((image: any) => ({
    ...image,
    url: resolveMediaUrl(baseURL, image.url || image.path || image.imageUrl),
  })),
  featuredImage: resolveMediaUrl(
    baseURL,
    event.featuredImage || event.featured_image || event.images?.find((img: any) => img.isFeatured)?.url || event.images?.[0]?.url
  ),
  categoryId: event.category?.id || event.categoryId || '',
  category: event.category
    ? {
        id: event.category.id,
        name: event.category.name,
      }
    : undefined,
  duration: formatDuration(event.duration),
  price: event.price !== null && event.price !== undefined ? parseFloat(event.price) : null,
  avgRating: event.avgRating ?? event.rating ?? 0,
  totalRatings: event.totalRatings ?? 0,
  likesCount: event.likesCount ?? 0,
  isLiked: event.isLiked ?? false,
  commentsCount: event.commentsCount ?? 0,
  isBookmarked: event.isBookmarked ?? false,
});

export const useEventsStore = defineStore('events', () => {
  const { $authFetch, $fetchNoAuth } = useApi();
  const events = ref<AppEvent[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const totalCount = ref<number>(0);
  const config = useRuntimeConfig();
  const baseURL = (config.public.apiBaseURL as string) || 'http://localhost:3344';

  const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $authFetch<any>('/events');
      console.log('Events API Response:', response);

      const eventsList = extractList(response);
      events.value = eventsList.map((e: any) => normalizeEvent(e, baseURL));
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch events';
      console.error('Fetch Events Error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTotalCount = async () => {
    try {
      const data = await $authFetch<any>('/events/count');
      totalCount.value =
        typeof data === 'number'
          ? data
          : (data?.data?.count || data?.data?.total || data?.count || data?.total || 0);
    } catch (err) {
      console.error('Failed to fetch count:', err);
    }
  };

  const resolveCategoryId = async (categoryName: string) => {
    const normalizedName = categoryName.trim();
    if (!normalizedName) {
      throw new Error('Category name is required before creating an event.');
    }

    try {
      const categoriesResponse = await $authFetch<any>('/categories');
      const categories = extractList(categoriesResponse);
      const existingCategory = categories.find((category: any) =>
        String(category?.name || '').trim().toLowerCase() === normalizedName.toLowerCase()
      );

      if (existingCategory?.id) {
        return existingCategory.id as string;
      }
    } catch (err) {
      console.warn('Failed to fetch categories before creating event. Falling back to category creation.', err);
    }

    const createdCategory = await $authFetch<any>('/categories', {
      method: 'POST',
      body: { name: normalizedName },
    });

    const categoryId =
      createdCategory?.id ||
      createdCategory?.data?.id ||
      createdCategory?.category?.id ||
      createdCategory?.data?.category?.id;

    if (!categoryId) {
      throw new Error('Category was created, but no category ID was returned by the API.');
    }

    return categoryId as string;
  };

  const addEvent = async (payload: Partial<AppEvent>) => {
    isLoading.value = true;
    try {
      const categoryId =
        typeof payload.categoryId === 'string' && payload.categoryId.trim()
          ? await resolveCategoryId(payload.categoryId)
          : payload.categoryId;

      const apiPayload = {
        ...payload,
        categoryId,
        duration: payload.duration ? parseDuration(payload.duration as string) : 0,
      };
      
      const newEvent = await $authFetch<AppEvent>('/events', {
        method: 'POST',
        body: apiPayload
      });
      
      const normalizedEvent = normalizeEvent(newEvent, baseURL);
      events.value.unshift(normalizedEvent);
      return newEvent;
    } catch (err: any) {
      error.value = err.message || 'Failed to add event';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateEvent = async (id: string, payload: Partial<AppEvent>) => {
    isLoading.value = true;
    try {
      const apiPayload = {
        ...payload,
        duration: payload.duration ? parseDuration(payload.duration as string) : undefined,
      };
      
      const updated = await $authFetch<AppEvent>(`/events/${id}`, {
        method: 'PATCH',
        body: apiPayload
      });
      
      const index = events.value.findIndex(e => e.id === id);
      if (index !== -1) {
        events.value[index] = normalizeEvent(updated, baseURL);
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update event';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteEvent = async (id: string) => {
    isLoading.value = true;
    try {
      await $authFetch(`/events/${id}`, { method: 'DELETE' });
      events.value = events.value.filter(e => e.id !== id);
    } catch (err: any) {
      error.value = err.message || 'Failed to delete event';
    } finally {
      isLoading.value = false;
    }
  };

  const setFeaturedImage = async (eventId: string, imageId: string) => {
    try {
      await $authFetch(`/events/${eventId}/images/${imageId}/featured`, { method: 'PATCH' });
      // Refresh local data to show new featured image
      await fetchEvents();
    } catch (err) {
      console.error('Failed to set featured image:', err);
    }
  };

  const uploadEventImage = async (eventId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadedImage = await $authFetch<any>(`/events/${eventId}/images`, {
      method: 'POST',
      body: formData,
    });

    return uploadedImage;
  };

  const toggleLike = async (id: string) => {
    const event = events.value.find(e => e.id === id);
    if (event) {
      event.isLiked = !event.isLiked;
      event.likesCount += event.isLiked ? 1 : -1;
      // try { await EventService.toggleLike(id); } catch(e) { /* revert */ }
    }
  };

  const toggleBookmark = async (id: string) => {
    const event = events.value.find(e => e.id === id);
    if (event) {
      event.isBookmarked = !event.isBookmarked;
      // try { await EventService.toggleBookmark(id); } catch(e) { /* revert */ }
    }
  };

  const rateEvent = async (id: string, newRating: number) => {
    const event = events.value.find(e => e.id === id);
    if (event) {
      // Optimistic rating update
      event.avgRating = parseFloat(((event.avgRating + newRating) / 2).toFixed(1));
    }
  };

  const getEventById = computed(() => {
    return (id: string) => events.value.find(e => e.id === id) || null;
  });

  const featuredEvents = computed(() => events.value.slice(0, 3));
  const totalEvents = computed(() => events.value.length);
  const totalCategories = computed(() => new Set(events.value.map(e => e.categoryId)).size);
  const bookmarkedEvents = computed(() => events.value.filter(e => e.isBookmarked));

  const ongoingEvents = computed(() => {
    const now = new Date();
    return events.value.filter(e => new Date(e.startDate) <= now && new Date(e.endDate) >= now);
  });

  const plannedEvents = computed(() => {
    const now = new Date();
    return events.value.filter(e => new Date(e.startDate) > now);
  });

  const passedEvents = computed(() => {
    const now = new Date();
    return events.value.filter(e => new Date(e.endDate) < now);
  });

  return {
    events,
    isLoading,
    error,
    featuredEvents,
    bookmarkedEvents,
    getEventById,
    totalEvents,
    totalCount,
    totalCategories,
    ongoingEvents,
    plannedEvents,
    passedEvents,
    fetchEvents,
    fetchTotalCount,
    resolveCategoryId,
    addEvent,
    updateEvent,
    deleteEvent,
    setFeaturedImage,
    uploadEventImage,
    toggleLike,
    toggleBookmark,
    rateEvent
  };
});
