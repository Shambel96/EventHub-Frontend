import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '../composables/useApi';

export interface Amenity {
  id: string;
  name: string;
}

export const useAmenitiesStore = defineStore('amenities', () => {
  const { $fetchNoAuth } = useApi();
  const amenities = ref<Amenity[]>([]);
  const isLoaded = ref(false);

  const fetchAmenities = async () => {
    if (isLoaded.value) return; // Only fetch once
    try {
      const response = await $fetchNoAuth<any>('/amenities');
      const list = Array.isArray(response) ? response : (response.data || response.amenities || []);
      amenities.value = list;
      isLoaded.value = true;
    } catch (err) {
      console.error('Failed to fetch amenities:', err);
    }
  };

  // Lookup map: amenityId → name
  const amenityMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const a of amenities.value) {
      map[a.id] = a.name;
    }
    return map;
  });

  // Given an amenityId, return its human-readable name
  const getAmenityName = computed(() => {
    return (amenityId: string): string => amenityMap.value[amenityId] || amenityId;
  });

  return { amenities, isLoaded, amenityMap, getAmenityName, fetchAmenities };
});
