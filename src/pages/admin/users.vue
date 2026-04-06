<template>
  <div class="space-y-8">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
      <div>
        <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
          <NuxtLink to="/admin" class="hover:text-brand-blue">Admin</NuxtLink>
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-brand-blue">User Directory</span>
        </nav>
        <h1 class="text-4xl font-black text-brand-blue tracking-tight">Active User Directory</h1>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Manage platform members, permissions, and status</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative group">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search users..." 
            class="pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-brand-blue focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue outline-none transition-all shadow-sm w-64"
          />
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
    </header>

    <!-- Main Content Card -->
    <div class="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
      <!-- Users Table -->
      <div class="overflow-x-auto -mx-8 px-8 min-h-[400px]">
        <table class="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
              <th class="pb-4 px-4">Member Identity</th>
              <th class="pb-4 px-4">Access Level</th>
              <th class="pb-4 px-4">Joined Date</th>
              <th class="pb-4 px-4">Status Indicator</th>
              <th class="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <TransitionGroup 
            tag="tbody" 
            name="list" 
            v-if="paginatedUsers.length"
          >
            <tr v-for="user in paginatedUsers" :key="user.id" class="group bg-gray-50/30 hover:bg-white border border-transparent hover:border-gray-100 rounded-3xl transition-all duration-500 hover:shadow-xl shadow-brand-blue/5">
              <td class="py-5 px-4 first:rounded-l-3xl">
                <div class="flex items-center gap-4">
                  <div class="relative group/avatar">
                    <img :src="user.avatar" class="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-sm group-hover/avatar:scale-110 transition-transform" alt="avatar" />
                    <div class="absolute inset-0 bg-brand-blue/10 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-black text-brand-blue leading-tight mb-1">{{ user.name }}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-5 px-4">
                <div class="relative group/select">
                  <select 
                    :value="user.role"
                    @change="triggerUpdate(user, 'role', $event.target.value)"
                    class="appearance-none border border-transparent hover:border-brand-blue/20 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full cursor-pointer focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all shadow-sm"
                    :class="roleStyles[user.role]"
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <svg class="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </td>
              <td class="py-5 px-4">
                <p class="text-sm font-bold text-gray-600">{{ user.joinedDate }}</p>
                <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Confirmed User</p>
              </td>
              <td class="py-5 px-4">
                <div class="relative group/select text-xs">
                  <select 
                    :value="user.status"
                    @change="triggerUpdate(user, 'status', $event.target.value)"
                    class="appearance-none bg-white border border-gray-100 hover:border-brand-blue/20 text-brand-blue font-black uppercase tracking-widest px-4 py-2.5 pl-8 rounded-2xl cursor-pointer focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all shadow-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <span class="w-2.5 h-2.5 rounded-full absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none shadow-sm" :class="user.status === 'active' ? 'bg-green-500' : user.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'"></span>
                  <svg class="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </td>
              <td class="py-5 px-4 text-right last:rounded-r-3xl">
                <NuxtLink :to="`/admin/users/${user.id}`" class="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-blue bg-white hover:bg-brand-blue hover:text-white rounded-xl transition-all border border-brand-blue/10 shadow-sm hover:shadow-xl hover:-translate-y-1 active:translate-y-0 text-center inline-block">
                  Profile Details
                </NuxtLink>
              </td>
            </tr>
          </TransitionGroup>
          <tbody v-else>
            <tr>
              <td colspan="5" class="text-center py-32 opacity-30 italic font-black text-brand-blue uppercase tracking-[0.3em] select-none">
                Zero users match your search
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination 
        v-model:page="userPage" 
        :total-pages="Math.ceil(filteredUsers.length / limit)" 
        :total="filteredUsers.length"
        :from="(userPage - 1) * limit + 1"
        :to="Math.min(userPage * limit, filteredUsers.length)"
      />
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal 
      :show="showModal"
      :title="modalTitle"
      :message="modalMessage"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUsersStore } from '../../stores/usersStore';
import Pagination from '../../components/common/Pagination.vue';
import ConfirmationModal from '../../components/common/ConfirmationModal.vue';

definePageMeta({
  layout: 'admin'
});

const usersStore = useUsersStore();

const limit = 5;
const userPage = ref(1);
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersStore.users;
  const q = searchQuery.value.toLowerCase();
  return usersStore.users.filter(u => 
    u.name.toLowerCase().includes(q) || 
    u.email.toLowerCase().includes(q)
  );
});

const paginatedUsers = computed(() => {
  const start = (userPage.value - 1) * limit;
  return filteredUsers.value.slice(start, start + limit);
});

const roleStyles = {
  owner: 'bg-brand-blue text-white shadow-sm',
  admin: 'bg-teal-600 text-white shadow-sm',
  user: 'bg-gray-100 text-gray-600 border border-gray-200',
};

// Update Logic
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const pendingUpdate = ref(null);

const triggerUpdate = (user, type, newValue) => {
  if (user[type] === newValue) return;

  pendingUpdate.value = { id: user.id, [type]: newValue, name: user.name };
  modalTitle.value = `Confirm Access Change`;
  modalMessage.value = `You are about to change ${user.name}'s ${type} to ${newValue.toUpperCase()}. This directly affects platform permissions.`;
  showModal.value = true;
};

const onConfirm = async () => {
  if (pendingUpdate.value) {
    const { id, name, ...updates } = pendingUpdate.value;
    await usersStore.updateUser(id, updates);
    showModal.value = false;
    pendingUpdate.value = null;
  }
};

const onCancel = () => {
  showModal.value = false;
  pendingUpdate.value = null;
};

onMounted(() => {
  usersStore.fetchUsers();
});
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-leave-active {
  position: absolute;
}
</style>
