import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '../composables/useApi';

export interface PlatformStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  activeUsers: number;
  growthRate: number;
  lastUpdated: string;
}

export const useStatsStore = defineStore('stats', () => {
  const { $authFetch } = useApi();
  
  const platformStats = ref<PlatformStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalRevenue: 0,
    activeUsers: 0,
    growthRate: 0,
    lastUpdated: new Date().toISOString()
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchPlatformStats = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await $authFetch<any>('/stats/platform');
      
      // Map API response to our local state
      // Handles different possible shapes from NestJS/Vanta API
      platformStats.value = {
        totalUsers: data.totalUsers ?? data.usersCount ?? 0,
        totalEvents: data.totalEvents ?? data.eventsCount ?? 0,
        totalRevenue: parseFloat(data.totalRevenue ?? data.revenue ?? 0),
        activeUsers: data.activeUsers ?? data.activeSessionCount ?? 0,
        growthRate: data.growthRate ?? data.dailyGrowth ?? 0,
        lastUpdated: new Date().toISOString()
      };
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch platform stats';
      console.error('Stats Fetch Error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAdminDashboard = async () => {
    // Similar to platform stats but might have more business-level data
    isLoading.value = true;
    try {
      const data = await $authFetch<any>('/admin/dashboard');
      // Update stats based on dashboard response if different
      if (data) {
        platformStats.value.totalUsers = data.totalUsers ?? platformStats.value.totalUsers;
        platformStats.value.totalEvents = data.totalEvents ?? platformStats.value.totalEvents;
      }
    } catch (err) {
      console.error('Admin Dashboard Fetch Error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    platformStats,
    isLoading,
    error,
    fetchPlatformStats,
    fetchAdminDashboard
  };
});
