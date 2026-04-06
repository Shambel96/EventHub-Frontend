import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useApi } from '../composables/useApi';
import type { User } from '../types/user';

export const useUsersStore = defineStore('users', () => {
  const { $authFetch } = useApi();
  const users = ref<User[]>([]);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const totalCount = ref<number>(0);

  const fetchUsers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await $authFetch<any>('/users');
      console.log('Users API Response:', response);
      
      const usersList = Array.isArray(response) ? response : (response.data || response.users || []);
      users.value = usersList.map((u: any) => ({
        ...u,
        role: (u.role || 'user').toLowerCase(),
        status: (u.status || 'active').toLowerCase()
      }));
      totalCount.value = usersList.length;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to fetch users';
      console.error('Fetch Users Error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const getPaginatedUsers = (page: number, limit: number) => {
    const start = (page - 1) * limit;
    return users.value.slice(start, start + limit);
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    isLoading.value = true;
    try {
      // If updating role, use the specific /role endpoint
      if (updates.role) {
        await $authFetch(`/users/${id}/role`, {
          method: 'PATCH',
          body: { role: updates.role.toUpperCase() }
        });
      }
      
      // Update local state
      const userIndex = users.value.findIndex(u => u.id === id);
      const user = users.value[userIndex];
      if (user) {
        Object.assign(user, updates);
      }
      return true;
    } catch (err: any) {
      error.value = err.message || 'Failed to update user';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    users,
    isLoading,
    error,
    totalCount,
    fetchUsers,
    getPaginatedUsers,
    updateUser
  };
});

export const getUserById = (id: string) => {
  const store = useUsersStore();
  return computed(() => store.users.find(u => u.id === id) || null);
};
