export interface EventImage {
  id: string;
  eventId?: string;
  url: string;
  isFeatured?: boolean;
}

export interface EventCreator {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
}

export interface EventCategory {
  id: string;
  name: string;
}

export interface EventAmenity {
  eventId: string;
  amenityId: string;
  amenity?: {
    id: string;
    name: string;
  };
}

export interface EventStep {
  id: string;
  stepOrder?: number;
  content?: string;
  title?: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;   // API field
  endDate: string;
  duration: string | number; // raw mins from API, formatted string in UI
  price: number | null;
  isPaid: boolean;
  images: EventImage[];
  categoryId: string;
  category?: EventCategory;
  location: string;
  amenities: EventAmenity[];
  steps?: EventStep[];     // Optional — returned by older API shape / used in create form
  creatorId?: string;
  creator?: EventCreator;
  createdAt: string;
  updatedAt?: string;

  // Rating
  avgRating: number;
  totalRatings: number;

  // UI interaction state (not from API, defaulted in store)
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  isBookmarked: boolean;
}
