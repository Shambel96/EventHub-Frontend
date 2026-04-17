import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Event as AppEvent } from '../types/event';
import { useApi } from '../composables/useApi';
import { formatDuration, parseDuration } from '../utils/durationFormatter';
import { extractList } from '../utils/apiHelpers';


const normalizeEvent = (event: any, resolveMediaUrl: (path?: string | null) => string): AppEvent => ({
  ...event,
  images: (event.images || []).map((image: any) => ({
    ...image,
    url: resolveMediaUrl(image.url || image.path || image.imageUrl),
  })),
  featuredImage: resolveMediaUrl(
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
  const { $authFetch, $fetchNoAuth, resolveMediaUrl, baseURL } = useApi();
  const events = ref<AppEvent[]>([]);
  const isLoading = ref<boolean>(false);
  const creationStatus = ref<'idle' | 'resolving_category' | 'creating_event' | 'linking_amenities' | 'adding_itinerary' | 'uploading_images' | 'complete'>('idle');
  const error = ref<string | null>(null);
  const totalCount = ref<number>(0);

  const fetchEvents = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $fetchNoAuth<any>('/events');
      console.log('Events API Response:', response);

      const eventsList = extractList(response);
      events.value = eventsList.map((e: any) => normalizeEvent(e, resolveMediaUrl));
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch events';
      console.error('Fetch Events Error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchTotalCount = async () => {
    try {
      const data = await $fetchNoAuth<any>('/events/count');
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
      const categoriesResponse = await $fetchNoAuth<any>('/categories');
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

  /**
   * Resolve multiple amenity names to IDs, creating new ones if they don't exist.
   */
  const resolveAmenityIds = async (amenityNames: string[]) => {
    if (!amenityNames || amenityNames.length === 0) return [];
    
    // 1. Fetch existing amenities
    let existingAmenities: any[] = [];
    try {
      const response = await $fetchNoAuth<any>('/amenities');
      existingAmenities = Array.isArray(response) ? response : (response.data || []);
    } catch (err) {
      console.warn('Failed to fetch existing amenities', err);
    }

    // 2. Map names to IDs, creating new ones as we go
    const resolveResults = await Promise.all(
      amenityNames.map(async (name) => {
        const normalized = name.trim();
        if (!normalized) return null;

        const found = existingAmenities.find(
          (a) => a.name.toLowerCase() === normalized.toLowerCase()
        );
        if (found) return found.id;

        // Create new amenity if not found
        try {
          const created = await $authFetch<any>('/amenities', {
            method: 'POST',
            body: { name: normalized },
          });
          return created?.id || created?.data?.id;
        } catch (err) {
          console.error(`Failed to create amenity "${normalized}"`, err);
          return null;
        }
      })
    );

    return resolveResults.filter(Boolean) as string[];
  };

  const addEvent = async (payload: Partial<AppEvent>) => {
    isLoading.value = true;
    error.value = null;
    creationStatus.value = 'resolving_category';
    try {
      // 1. Resolve Category ID (Already handles creation of new category if needed)
      const categoryId =
        typeof payload.categoryId === 'string' && payload.categoryId.trim()
          ? await resolveCategoryId(payload.categoryId)
          : payload.categoryId;

      // 2. Resolve Amenity IDs
      creationStatus.value = 'linking_amenities';
      const rawAmenities = (payload as any).amenities || [];
      const amenityIds = Array.isArray(rawAmenities) 
        ? await resolveAmenityIds(rawAmenities)
        : [];

      // 3. Create Core Event
      creationStatus.value = 'creating_event';
      const corePayload = {
        title: payload.title,
        description: payload.description,
        location: payload.location,
        isPaid: payload.isPaid || false,
        price: payload.price,
        startDate: payload.startDate,
        endDate: payload.endDate,
        categoryId,
        duration: payload.duration ? parseDuration(payload.duration as string) : 0,
      };
      
      const newEvent = await $authFetch<any>('/events', {
        method: 'POST',
        body: corePayload
      });

      const eventId = newEvent?.id || newEvent?.data?.id;
      if (!eventId) throw new Error('Failed to retrieve ID for new event.');

      // 4. Link Amenities (POST /amenities/events/{eventId})
      if (amenityIds.length > 0) {
        try {
          await $authFetch(`/amenities/events/${eventId}`, {
            method: 'POST',
            body: { amenityIds } // Assuming AddAmenitiesDto takes an array of IDs
          });
        } catch (amenityErr) {
          console.error('Failed to link amenities to event', amenityErr);
          // We continue because the event itself is created
        }
      }

      // 5. Create Steps
      if (payload.steps && payload.steps.length > 0) {
        creationStatus.value = 'adding_itinerary';
        for (const step of payload.steps) {
          try {
            await $authFetch(`/events/${eventId}/steps`, {
              method: 'POST',
              body: {
                title: step.title,
                content: step.content || step.description,
                stepOrder: step.stepOrder || 1
              }
            });
          } catch (stepErr) {
            console.error('Failed to create an itinerary step', stepErr);
          }
        }
      }
      
      creationStatus.value = 'complete';
      const normalizedEvent = normalizeEvent(newEvent, resolveMediaUrl);
      events.value.unshift(normalizedEvent);
      return newEvent;
    } catch (err: any) {
      creationStatus.value = 'idle';
      error.value = err.data?.message || err.message || 'Failed to add event';
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
        events.value[index] = normalizeEvent(updated, resolveMediaUrl);
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

  const uploadEventImages = async (eventId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await $authFetch<any>(`/events/${eventId}/images/upload`, {
      method: 'POST',
      body: formData,
    });

    return response;
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
    creationStatus,
    fetchEvents,
    fetchTotalCount,
    resolveCategoryId,
    addEvent,
    updateEvent,
    deleteEvent,
    setFeaturedImage,
    uploadEventImages,
    toggleLike,
    toggleBookmark,
    rateEvent
  };
});
