import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Event as AppEvent } from '../types/event';
import { useApi } from '../composables/useApi';
import { formatDuration, parseDuration } from '../utils/durationFormatter';

export const useEventsStore = defineStore('events', () => {
  const { $authFetch, $fetchNoAuth } = useApi();
  const events = ref<AppEvent[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const totalCount = ref<number>(0);

  const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;
    try {
            const response = await $fetchNoAuth<any>('/events');

      console.log('Events API Response:', response);
      
      const eventsList = Array.isArray(response) ? response : (response.data || response.events || []);
      events.value = eventsList.map((e: any) => ({
        ...e,
        categoryId: e.category?.id || e.categoryId || '',
        category: e.category
          ? {
              id: e.category.id,
              name: e.category.name,
            }
          : undefined,
        duration: formatDuration(e.duration),
        price: e.price !== null && e.price !== undefined ? parseFloat(e.price) : null,
        // Normalize UI-only fields with safe defaults
        avgRating: e.avgRating ?? e.rating ?? 0,
        totalRatings: e.totalRatings ?? 0,
        likesCount: e.likesCount ?? 0,
        isLiked: e.isLiked ?? false,
        commentsCount: e.commentsCount ?? 0,
        isBookmarked: e.isBookmarked ?? false,
      }));
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
      totalCount.value = typeof data === 'number' ? data : (data.count || data.total || 0);
    } catch (err) {
      console.error('Failed to fetch count:', err);
    }
  };

  const addEvent = async (payload: Partial<AppEvent>) => {
    isLoading.value = true;
    try {
      const apiPayload = {
        ...payload,
        duration: payload.duration ? parseDuration(payload.duration as string) : 0,
      };
      
      const newEvent = await $authFetch<AppEvent>('/events', {
        method: 'POST',
        body: apiPayload
      });
      
      events.value.unshift({
        ...newEvent,
        duration: formatDuration(newEvent.duration)
      });
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
        events.value[index] = {
          ...updated,
          duration: formatDuration(updated.duration)
        };
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
    addEvent,
    updateEvent,
    deleteEvent,
    setFeaturedImage,
    toggleLike,
    toggleBookmark,
    rateEvent
  };
});
