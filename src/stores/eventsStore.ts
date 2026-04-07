// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'

// export const useEventsStore = defineStore('events', () => {
//   type EventItem = Record<string, any>
//   type ApiResponse<T> = T | { data?: T }

//   const events = ref<EventItem[]>([])
//   const currentEvent = ref<EventItem | null>(null)
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)

//   // Fetch all events
//   const fetchEvents = async () => {
//     isLoading.value = true
//     error.value = null

//     try {
//       const response = await $fetch<ApiResponse<EventItem[]>>('http://localhost:3000/events')
//       events.value = Array.isArray(response) ? response : (response.data ?? [])

//       console.log('✅ Events loaded:', events.value.length, 'events')
//     } catch (err: any) {
//       error.value = err.data?.message || 'Failed to fetch events'
//       console.error('Fetch events error:', err)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Fetch single event detail
//   const fetchEventById = async (id: string) => {
//     isLoading.value = true
//     error.value = null
//     currentEvent.value = null

//     try {
//       const response = await $fetch<ApiResponse<EventItem | EventItem[]>>(`http://localhost:3000/events/${id}`)
//       currentEvent.value = Array.isArray(response) ? response[0] : (response.data ?? response)

//       console.log('✅ Event detail loaded:', currentEvent.value?.title)
//     } catch (err: any) {
//       error.value = err.data?.message || 'Failed to load event details'
//       console.error(`Error fetching event ${id}:`, err)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   // Like / Unlike
//   const toggleLike = async (eventId: string) => {
//     try {
//       await $fetch(`http://localhost:3000/events/${eventId}/like`, { method: 'POST' })
//       // Refresh current event to get updated count
//       if (currentEvent.value?.id === eventId) {
//         await fetchEventById(eventId)
//       }
//     } catch (err) {
//       console.error('Toggle like failed:', err)
//     }
//   }

//   // Bookmark / Unbookmark
//   const toggleBookmark = async (eventId: string) => {
//     try {
//       await $fetch(`http://localhost:3000/events/${eventId}/bookmark`, { method: 'POST' })
//       if (currentEvent.value?.id === eventId) {
//         await fetchEventById(eventId)
//       }
//     } catch (err) {
//       console.error('Toggle bookmark failed:', err)
//     }
//   }

//   // Rate event
//   const rateEvent = async (eventId: string, rating: number) => {
//     try {
//       await $fetch(`http://localhost:3000/events/${eventId}/rate`, {
//         method: 'POST',
//         body: { rating }
//       })
//       if (currentEvent.value?.id === eventId) {
//         await fetchEventById(eventId)
//       }
//     } catch (err) {
//       console.error('Rating failed:', err)
//     }
//   }

//   // Post comment
//   const postComment = async (eventId: string, content: string) => {
//     try {
//       await $fetch(`http://localhost:3000/events/${eventId}/comment`, {
//         method: 'POST',
//         body: { content }
//       })
//       if (currentEvent.value?.id === eventId) {
//         await fetchEventById(eventId)
//       }
//     } catch (err) {
//       console.error('Post comment failed:', err)
//     }
//   }

//   return {
//     events,
//     currentEvent,
//     isLoading,
//     error,
//     fetchEvents,
//     fetchEventById,
//     toggleLike,
//     toggleBookmark,
//     rateEvent,
//     postComment
//   }
// })

// import { defineStore } from 'pinia';
// import { ref } from 'vue';
// import type { EventDetail, Comment } from '~/types/event';
// export interface EventCategory {
//   id: string;
//   name: string;
// }

// export interface EventItem {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl?: string;
//   date: string;
//   categoryId?: string;
//   category?: EventCategory;
  
//   // Social Stats
//   likesCount: number;
//   averageRating: number;
//   totalRatings: number;
//   comments: any[];
  
//   // Current User's State
//   hasLiked: boolean;
//   hasBookmarked: boolean;
//   userRating: number | null;
// }
// export const useEventsStore = defineStore('events', () => {
//   const events = ref<EventItem[]>([]);
//   const currentEvent = ref<EventDetail | null>(null);
//   const isLoading = ref(false);
//   const error = ref<string | null>(null);
//   const config = useRuntimeConfig();

//   // Helper for auth headers (assuming you store token in a cookie or local storage)
//   const getHeaders = (): Record<string, string> => {
//     const token = useCookie('auth_token').value;
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const fetchEventById = async (id: string) => {
//     isLoading.value = true;
//     error.value = null;
//     try {
//       const response = await $fetch<{ data: EventDetail }>(`${config.public.apiBase}/events/${id}`, {
//         headers: getHeaders(),
//       });
//       currentEvent.value = response.data;
//     } catch (err: any) {
//       error.value = err.message || 'Failed to load event';
//     } finally {
//       isLoading.value = false;
//     }
//   };
//  const fetchEvents = async () => {
//     isLoading.value = true;
//     error.value = null;
//     try {
//       const response = await $fetch<{ data: EventItem[] }>(`https://localhost:3000/events`, {
//         headers: getHeaders(),
//       });
//       events.value = response.data;
//     } catch (err: any) {
//       error.value = err.data?.message || 'Failed to load events';
//     } finally {
//       isLoading.value = false;
//     }
//   };


//   // Social Actions (Optimistic)
//   const toggleLike = async (eventId: string) => {
//     if (!currentEvent.value) return;
//     const previousState = currentEvent.value.hasLiked;
//     currentEvent.value.hasLiked = !previousState;
//     currentEvent.value.likesCount += currentEvent.value.hasLiked ? 1 : -1;

//     try {
//       await $fetch(`https://localhost:3000/events/${eventId}/like`, { method: 'POST', headers: getHeaders() });
//     } catch (err) {
//       currentEvent.value.hasLiked = previousState;
//       currentEvent.value.likesCount += previousState ? 1 : -1;
//     }
//   };

 
 

//   const toggleBookmark = async (eventId: string) => {
//     if (!currentEvent.value) return;

//     const previousState = currentEvent.value.hasBookmarked;
//     currentEvent.value.hasBookmarked = !previousState;

//     try {
//       await $fetch(`https://localhost:3000/events/${eventId}/bookmark`, {
//         method: 'POST',
//         headers: getHeaders(),
//       });
//     } catch (err) {
//       currentEvent.value.hasBookmarked = previousState;
//       console.error('Failed to toggle bookmark', err);
//     }
//   };

//   const rateEvent = async (eventId: string, rating: number) => {
//     if (!currentEvent.value) return;

//     const previousRating = currentEvent.value.userRating;
//     // Basic optimistic update for the user's personal rating UI
//     currentEvent.value.userRating = rating;

//     try {
//       const res = await $fetch<{ data: { averageRating: number, totalRatings: number } }>(
//         `https://localhost:3000/events/${eventId}/rate`, 
//         {
//           method: 'POST',
//           body: { rating },
//           headers: getHeaders(),
//         }
//       );
//       // Sync the true new average from the backend
//       currentEvent.value.averageRating = res.data.averageRating;
//       currentEvent.value.totalRatings = res.data.totalRatings;
//     } catch (err) {
//       currentEvent.value.userRating = previousRating;
//       console.error('Failed to rate event', err);
//     }
//   };

//   const postComment = async (eventId: string, content: string) => {
//     try {
//       const res = await $fetch<{ data: Comment }>(`https://localhost:3000/events/${eventId}/comment`, {
//         method: 'POST',
//         body: { content },
//         headers: getHeaders(),
//       });
      
//       // Push the new comment directly into the state so we don't have to refetch everything
//       if (currentEvent.value) {
//         currentEvent.value.comments.unshift(res.data);
//       }
//       return true;
//     } catch (err) {
//       console.error('Failed to post comment', err);
//       return false;
//     }
//   };

//   return {
//     events,
//     currentEvent,
//     isLoading,
//     error,
//     fetchEvents,
//     fetchEventById,
//     toggleLike,
//     toggleBookmark,
//     rateEvent,
//     postComment,
//   };
// });


// stores/eventsStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

type ApiListResponse<T> = T | { data?: T; events?: T }
type ApiItemResponse<T> = T | { data?: T }

const unwrapApiItemResponse = <T>(response: ApiItemResponse<T>): T | undefined => {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return response.data
  }
  return response as T
}

export const useEventsStore = defineStore('events', () => {
  const events = ref<any[]>([])
  const currentEvent = ref<any>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const config = useRuntimeConfig()

  // Use runtime config for API base (recommended)
  const apiBase = config.public.apiBase || 'http://localhost:3001'

  // Get auth token (adjust based on how you store it)
  const getAuthHeader = (): Record<string, string> => {
    const token = useCookie('auth_token').value || (import.meta.client ? localStorage.getItem('token') : null)
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  }

  // Fetch all events
  const fetchEvents = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiListResponse<any[]>>(`${apiBase}/events`, {
        headers: getAuthHeader()
      })

      // Handle different possible response shapes
      events.value = Array.isArray(response)
        ? response
        : (response.data || response.events || [])

      console.log(`✅ Fetched ${events.value.length} events`)
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch events'
      console.error('Fetch events failed:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch single event detail
  const fetchEventById = async (id: string) => {
    isLoading.value = true
    error.value = null
    currentEvent.value = null

    try {
      const response = await $fetch<ApiItemResponse<any>>(`${apiBase}/events/${id}`, {
        headers: getAuthHeader()
      })

      currentEvent.value = typeof response === 'object' && response !== null && 'data' in response
        ? response.data
        : response
      console.log('✅ Event detail loaded:', currentEvent.value?.title)
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to load event details'
      console.error(`Failed to fetch event ${id}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  // Toggle Like
  const toggleLike = async (eventId: string) => {
    if (!currentEvent.value) return

    const wasLiked = currentEvent.value.hasLiked || false
    currentEvent.value.hasLiked = !wasLiked
    currentEvent.value.likesCount = (currentEvent.value.likesCount || 0) + (wasLiked ? -1 : 1)

    try {
      await $fetch(`${apiBase}/events/${eventId}/like`, {
        method: 'POST',
        headers: getAuthHeader()
      })
    } catch (err) {
      // Revert on error
      currentEvent.value.hasLiked = wasLiked
      currentEvent.value.likesCount = (currentEvent.value.likesCount || 0) + (wasLiked ? 1 : -1)
      console.error('Like toggle failed', err)
    }
  }

  // Toggle Bookmark
  const toggleBookmark = async (eventId: string) => {
    if (!currentEvent.value) return

    const wasBookmarked = currentEvent.value.hasBookmarked || false
    currentEvent.value.hasBookmarked = !wasBookmarked

    try {
      await $fetch(`${apiBase}/events/${eventId}/bookmark`, {
        method: 'POST',
        headers: getAuthHeader()
      })
    } catch (err) {
      currentEvent.value.hasBookmarked = wasBookmarked
      console.error('Bookmark toggle failed', err)
    }
  }

  // Rate Event
  const rateEvent = async (eventId: string, rating: number) => {
    if (!currentEvent.value) return

    const previousRating = currentEvent.value.userRating
    currentEvent.value.userRating = rating

    try {
      const res = await $fetch<ApiItemResponse<{ averageRating: number; totalRatings: number }>>(`${apiBase}/events/${eventId}/rate`, {
        method: 'POST',
        body: { rating },
        headers: getAuthHeader()
      })

      // Update average rating from backend
      const ratingData = unwrapApiItemResponse(res)
      if (ratingData) {
        currentEvent.value.averageRating = ratingData.averageRating
        currentEvent.value.totalRatings = ratingData.totalRatings
      }
      currentEvent.value.userRating = previousRating
          // console.error('Rating failed', err)
    } catch (err) {
      currentEvent.value.userRating = previousRating
      console.error('Rating failed', err)
    }
  }

  // Post Comment
  const postComment = async (eventId: string, content: string) => {
    if (!content.trim() || !currentEvent.value) return false

    try {
      const res = await $fetch<ApiItemResponse<any>>(`${apiBase}/events/${eventId}/comment`, {
        method: 'POST',
        body: { content },
        headers: getAuthHeader()
      })

      // Add comment locally
      const commentData = typeof res === 'object' && res !== null && 'data' in res ? res.data : res
      if (currentEvent.value.comments && commentData) {
        currentEvent.value.comments.unshift(commentData)
      }
      return true
    } catch (err) {
      console.error('Post comment failed', err)
      return false
    }
  }

  return {
    events,
    currentEvent,
    isLoading,
    error,
    fetchEvents,
    fetchEventById,
    toggleLike,
    toggleBookmark,
    rateEvent,
    postComment
  }
})