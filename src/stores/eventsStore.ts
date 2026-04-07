// stores/eventsStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventsStore = defineStore('events', () => {
  type EventItem = Record<string, any>
  type ApiResponse<T> = T | { data?: T }

  const events = ref<EventItem[]>([])
  const currentEvent = ref<EventItem | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all events
  const fetchEvents = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse<EventItem[]>>('http://localhost:3001/events')
      events.value = Array.isArray(response) ? response : (response.data ?? [])

      console.log('✅ Events loaded:', events.value.length, 'events')
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch events'
      console.error('Fetch events error:', err)
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
      const response = await $fetch<ApiResponse<EventItem | EventItem[]>>(`http://localhost:3001/events/${id}`)
      currentEvent.value = Array.isArray(response) ? response[0] : (response.data ?? response)

      console.log('✅ Event detail loaded:', currentEvent.value?.title)
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to load event details'
      console.error(`Error fetching event ${id}:`, err)
    } finally {
      isLoading.value = false
    }
  }

  // Like / Unlike
  const toggleLike = async (eventId: string) => {
    try {
      await $fetch(`http://localhost:3001/events/${eventId}/like`, { method: 'POST' })
      // Refresh current event to get updated count
      if (currentEvent.value?.id === eventId) {
        await fetchEventById(eventId)
      }
    } catch (err) {
      console.error('Toggle like failed:', err)
    }
  }

  // Bookmark / Unbookmark
  const toggleBookmark = async (eventId: string) => {
    try {
      await $fetch(`http://localhost:3001/events/${eventId}/bookmark`, { method: 'POST' })
      if (currentEvent.value?.id === eventId) {
        await fetchEventById(eventId)
      }
    } catch (err) {
      console.error('Toggle bookmark failed:', err)
    }
  }

  // Rate event
  const rateEvent = async (eventId: string, rating: number) => {
    try {
      await $fetch(`http://localhost:3001/events/${eventId}/rate`, {
        method: 'POST',
        body: { rating }
      })
      if (currentEvent.value?.id === eventId) {
        await fetchEventById(eventId)
      }
    } catch (err) {
      console.error('Rating failed:', err)
    }
  }

  // Post comment
  const postComment = async (eventId: string, content: string) => {
    try {
      await $fetch(`http://localhost:3001/events/${eventId}/comment`, {
        method: 'POST',
        body: { content }
      })
      if (currentEvent.value?.id === eventId) {
        await fetchEventById(eventId)
      }
    } catch (err) {
      console.error('Post comment failed:', err)
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