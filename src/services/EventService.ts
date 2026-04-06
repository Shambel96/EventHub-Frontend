import type { Event } from '../types/event';
import { useApi } from '../composables/useApi';

export const EventService = {
  async getAllEvents(): Promise<Event[]> {
    const { $authFetch } = useApi();
    return $authFetch<Event[]>('/events');
  },

  async getEventById(id: string): Promise<Event> {
    const { $authFetch } = useApi();
    return $authFetch<Event>(`/events/${id}`);
  },

  async createEvent(payload: Partial<Event>): Promise<Event> {
    const { $authFetch } = useApi();
    return $authFetch<Event>('/events', {
      method: 'POST',
      body: payload
    });
  },

  async uploadEventImage(eventId: string, formData: FormData): Promise<any> {
    const { $authFetch } = useApi();
    return $authFetch(`/events/${eventId}/images`, {
      method: 'POST',
      body: formData
    });
  },

  async toggleLike(id: string): Promise<any> {
    const { $authFetch } = useApi();
    return $authFetch(`/events/${id}/like`, { method: 'POST' });
  },

  async toggleBookmark(id: string): Promise<any> {
    const { $authFetch } = useApi();
    return $authFetch(`/events/${id}/bookmark`, { method: 'POST' });
  },

  async addComment(id: string, comment: string): Promise<any> {
    const { $authFetch } = useApi();
    return $authFetch(`/events/${id}/comments`, { method: 'POST', body: { comment } });
  },

  async rateEvent(id: string, rating: number): Promise<any> {
    const { $authFetch } = useApi();
    return $authFetch(`/events/${id}/rating`, { method: 'POST', body: { rating } });
  }
};
