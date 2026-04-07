import type { Event } from '../types/event';

export const formatCategoryName = (value?: string | null) => {
  if (!value) return 'Uncategorized';

  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getEventCategoryLabel = (event?: Pick<Event, 'category' | 'categoryId'> | null) => {
  return event?.category?.name || formatCategoryName(event?.categoryId);
};
