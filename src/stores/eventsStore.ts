
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Event as AppEvent } from '../types/event'
import { useApi } from '../composables/useApi'
import { formatDuration, parseDuration } from '../utils/durationFormatter'
import { useAuthStore } from './authStore'
export const useEventsStore = defineStore('events', () => {
  const { $authFetch, $fetchNoAuth } = useApi()
  
  const events       = ref<AppEvent[]>([])
  const currentEvent = ref<any>(null)
  const isLoading    = ref(false)
  const error        = ref<string | null>(null)
  const totalCount   = ref(0)

  // ── Helpers ───────────────────────────────────────────
  function unwrap(response: any) {
    return response?.data ?? response
  }

  function normalizeEvent(e: any): any {
    return {
      ...e,
      categoryId:    e.category?.id || e.categoryId || '',
      category:      e.category ? { id: e.category.id, name: e.category.name } : undefined,
      duration:      formatDuration(e.duration),
      price:         e.price != null ? parseFloat(e.price) : null,
      avgRating:     e.averageRating ?? e.avgRating ?? 0,
      totalRatings:  e.totalRatings ?? 0,
      likesCount:    e.likesCount ?? 0,
      isLiked:       e.hasLiked ?? e.isLiked ?? false,
      isBookmarked:  e.hasBookmarked ?? e.isBookmarked ?? false,
      commentsCount: e.commentsCount ?? e.comments?.length ?? 0,
      comments:      e.comments ?? [],
      userRating:    e.userRating ?? null,
    }
  }

  // ── Fetch all events ──────────────────────────────────
  async function fetchEvents() {
    isLoading.value = true
    error.value = null
    try {
      const response = await $fetchNoAuth<any>('/events')
      const list = Array.isArray(response) ? response : unwrap(response)
      events.value = (Array.isArray(list) ? list : []).map(normalizeEvent)
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'Failed to fetch events'
    } finally {
      isLoading.value = false
    }
  }

  // ── Fetch single event ────────────────────────────────
async function fetchEventById(id: string) {
  isLoading.value = true
  error.value = null
  try {
    const authStore = useAuthStore()
    const fetch = authStore.token ? $authFetch : $fetchNoAuth
    const response = await fetch<any>(`/events/${id}`)
    currentEvent.value = normalizeEvent(unwrap(response))
  } catch (err: any) {
    error.value = err?.data?.message || err?.message || 'Failed to fetch event'
  } finally {
    isLoading.value = false
  }
}
  // ── Fetch total count ─────────────────────────────────
  async function fetchTotalCount() {
    try {
      const data = await $fetchNoAuth<any>('/events/count')
      totalCount.value = typeof data === 'number' ? data : (data.count || data.total || 0)
    } catch {}
  }

  // ── Add event ─────────────────────────────────────────
  async function addEvent(payload: Partial<AppEvent>) {
    isLoading.value = true
    try {
      const apiPayload = {
        ...payload,
        duration: payload.duration ? parseDuration(payload.duration as string) : 0,
      }
      const newEvent = await $authFetch<any>('/events', { method: 'POST', body: apiPayload })
      const normalized = normalizeEvent(unwrap(newEvent))
      events.value.unshift(normalized)
      return unwrap(newEvent)
    } catch (err: any) {
      error.value = err.message || 'Failed to add event'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── Update event ──────────────────────────────────────
  async function updateEvent(id: string, payload: Partial<AppEvent>) {
    isLoading.value = true
    try {
      const apiPayload = {
        ...payload,
        duration: payload.duration ? parseDuration(payload.duration as string) : undefined,
      }
      const updated = await $authFetch<any>(`/events/${id}`, { method: 'PATCH', body: apiPayload })
      const index = events.value.findIndex(e => e.id === id)
      if (index !== -1) events.value[index] = normalizeEvent(unwrap(updated))
    } catch (err: any) {
      error.value = err.message || 'Failed to update event'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // ── Delete event ──────────────────────────────────────
  async function deleteEvent(id: string) {
    isLoading.value = true
    try {
      await $authFetch(`/events/${id}`, { method: 'DELETE' })
      events.value = events.value.filter(e => e.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete event'
    } finally {
      isLoading.value = false
    }
  }

  // ── LIKE (optimistic + rollback) ──────────────────────
  async function toggleLike(eventId: string) {
    const target = currentEvent.value?.id === eventId
      ? currentEvent.value
      : events.value.find(e => e.id === eventId)
    if (!target) return

    const prevLiked = target.isLiked
    const prevCount = target.likesCount

    target.isLiked    = !prevLiked
    target.likesCount = prevLiked ? prevCount - 1 : prevCount + 1

    try {
      await $authFetch(`/likes/${eventId}`, { method: 'POST' })
    } catch (err: any) {
      target.isLiked    = prevLiked
      target.likesCount = prevCount
      throw new Error(err?.data?.message || 'Failed to toggle like')
    }
  }

  // ── BOOKMARK (optimistic + rollback) ──────────────────
  async function toggleBookmark(eventId: string) {
    const target = currentEvent.value?.id === eventId
      ? currentEvent.value
      : events.value.find(e => e.id === eventId)
    if (!target) return

    const prevBookmarked = target.isBookmarked

    target.isBookmarked = !prevBookmarked

    try {
      await $authFetch(`/bookmarks/${eventId}`, { method: 'POST' })
    } catch (err: any) {
      target.isBookmarked = prevBookmarked
      throw new Error(err?.data?.message || 'Failed to toggle bookmark')
    }
  }

  // ── RATE (optimistic + rollback) ──────────────────────
  async function rateEvent(eventId: string, score: number) {
    const target = currentEvent.value?.id === eventId
      ? currentEvent.value
      : events.value.find(e => e.id === eventId)

    const prevAvg   = target?.avgRating
    const prevTotal = target?.totalRatings

    if (target) {
      const newTotal      = (target.totalRatings || 0) + 1
      target.avgRating    = parseFloat(
        (((target.avgRating || 0) * (target.totalRatings || 0) + score) / newTotal).toFixed(1)
      )
      target.totalRatings = newTotal
      target.userRating   = score
    }

    try {
      const res  = await $authFetch(`/ratings/${eventId}`, { method: 'POST', body: { rating: Math.round(score) } })
      const data = unwrap(res)
      if (target && data?.averageRating != null) {
        target.avgRating    = data.averageRating
        target.totalRatings = data.totalRatings ?? target.totalRatings
      }
    } catch (err: any) {
      if (target) {
        target.avgRating    = prevAvg
        target.totalRatings = prevTotal
        target.userRating   = null
      }
      throw new Error(err?.data?.message || 'Failed to submit rating')
    }
  }

  // ── COMMENT ───────────────────────────────────────────
  async function postComment(eventId: string, content: string) {
    const res        = await $authFetch<any>(`/comments/${eventId}`, { method: 'POST', body: { content } })
    const newComment = unwrap(res)

    if (currentEvent.value?.id === eventId) {
      currentEvent.value.comments      = [...(currentEvent.value.comments || []), newComment]
      currentEvent.value.commentsCount = (currentEvent.value.commentsCount || 0) + 1
    }

    return newComment
  }

  // ── Computed ──────────────────────────────────────────
  const getEventById     = computed(() => (id: string) => events.value.find(e => e.id === id) || null)
  const featuredEvents   = computed(() => events.value.slice(0, 3))
  const totalEvents      = computed(() => events.value.length)
  const totalCategories  = computed(() => new Set(events.value.map(e => e.categoryId)).size)
  const bookmarkedEvents = computed(() => events.value.filter(e => e.isBookmarked))

  const ongoingEvents = computed(() => {
    const now = new Date()
    return events.value.filter(e => new Date(e.startDate) <= now && new Date(e.endDate) >= now)
  })
  const plannedEvents = computed(() => {
    const now = new Date()
    return events.value.filter(e => new Date(e.startDate) > now)
  })
  const passedEvents = computed(() => {
    const now = new Date()
    return events.value.filter(e => new Date(e.endDate) < now)
  })

  return {
    events,
    currentEvent,
    isLoading,
    error,
    totalCount,
    featuredEvents,
    bookmarkedEvents,
    getEventById,
    totalEvents,
    totalCategories,
    ongoingEvents,
    plannedEvents,
    passedEvents,
    fetchEvents,
    fetchEventById,
    fetchTotalCount,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleLike,
    toggleBookmark,
    rateEvent,
    postComment,
  }
})