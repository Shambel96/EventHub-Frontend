<template>
  <div v-if="user" class="max-w-4xl mx-auto space-y-12">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
      <NuxtLink to="/admin" class="hover:text-brand-blue transition-colors">Admin</NuxtLink>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      <NuxtLink to="/admin/users" class="hover:text-brand-blue transition-colors">User Directory</NuxtLink>
      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      <span class="text-brand-blue">User Profile</span>
    </nav>

    <!-- Profile Header Card -->
    <div class="relative">
      <div class="h-48 bg-gradient-to-r from-teal-500 to-brand-blue rounded-3xl shadow-xl shadow-brand-blue/10"></div>
      
      <div class="px-6 lg:px-10 -mt-12 lg:-mt-16 flex flex-col md:flex-row items-center md:items-end gap-6 lg:gap-8 pb-10 border-b border-gray-100">
        <div class="relative group">
          <div class="w-40 h-40 rounded-3xl border-8 border-white shadow-2xl overflow-hidden group-hover:rotate-2 transition-transform duration-500">
            <img :src="user.avatar" alt="User avatar" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <div class="flex-1 mb-2 text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start gap-3">
            <h1 class="text-3xl lg:text-4xl font-black text-brand-blue">{{ user.name }}</h1>
          </div>
          <p class="text-gray-400 font-bold mt-1">{{ user.email }}</p>
        </div>

        <!-- Management Controls (Editable by Admin) -->
        <div class="flex flex-col gap-4 mb-2">
          <div class="flex items-center gap-4">
             <div class="relative group/select">
                <select 
                  :value="user.role"
                  @change="triggerUpdate('role', $event.target.value)"
                  class="appearance-none border border-transparent hover:border-brand-blue/20 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full cursor-pointer focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all shadow-sm"
                  :class="roleStyles[user.role]"
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <svg class="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>

              <div class="relative group/select text-xs">
                <select 
                  :value="user.status"
                  @change="triggerUpdate('status', $event.target.value)"
                  class="appearance-none bg-white border border-gray-200 hover:border-brand-blue/20 text-gray-500 font-bold px-6 py-2.5 pl-10 rounded-2xl cursor-pointer focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all shadow-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
                <span class="w-2.5 h-2.5 rounded-full absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none shadow-sm" :class="user.status === 'active' ? 'bg-green-500' : user.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'"></span>
                <svg class="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
      <!-- Left Column: Personal Info (Read-Only) -->
      <div class="md:col-span-2 space-y-12">
        <section>
          <h2 class="text-xl font-black text-brand-blue mb-6 flex items-center gap-3">
             <span class="w-8 h-8 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </span>
            Member Biography
          </h2>
          <div class="relative">
            <p class="text-gray-500 font-bold leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              {{ user.bio || 'This user has not provided a biography yet.' }}
            </p>
            <div class="absolute -top-2 -right-2 px-3 py-1 bg-white border border-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded-lg shadow-sm">Read Only View</div>
          </div>
        </section>

        <section class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div v-for="info in personalInfo" :key="info.label" class="space-y-1 group">
            <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ info.label }}</p>
            <p class="text-sm font-bold text-brand-blue group-hover:text-teal-600 transition-colors">{{ info.value || 'N/A' }}</p>
          </div>
        </section>

        <!-- Placeholder for Activity -->
        <section>
          <h2 class="text-xl font-black text-brand-blue mb-6 flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-brand-blue/5 flex items-center justify-center text-brand-blue">
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </span>
            Recent Platform Activity
          </h2>
          <div class="grid grid-cols-1 gap-4 opacity-40 grayscale">
            <div v-for="i in 3" :key="i" class="h-16 bg-gray-100/50 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Activity History Log Entry {{ i }}
            </div>
          </div>
          <p class="text-center mt-6 text-[10px] font-black text-gray-300 uppercase tracking-widest italic">Live activity tracking coming soon in v2.0</p>
        </section>
      </div>

      <!-- Right Column: Stats Snapshot -->
      <div class="space-y-12">
        <section class="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
          <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-50 pb-4">Activity Summary</h3>
          <div class="space-y-8">
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Total Events Attended</p>
              <p class="text-5xl font-black text-brand-blue">{{ user.totalEventsAttended }}</p>
            </div>
            <div>
              <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Member Standing</p>
              <dev class="flex items-center gap-2">
                 <span class="w-3 h-3 rounded-full bg-brand-yellow"></span>
                 <p class="text-xl font-black text-brand-blue">Active Contributor</p>
              </dev>
            </div>
          </div>
        </section>

        <section class="p-8 bg-brand-blue rounded-3xl text-white shadow-xl shadow-brand-blue/10 relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div class="relative z-10">
            <h3 class="text-xs font-black uppercase tracking-widest opacity-60 mb-6 font-sans">Quick Admin Actions</h3>
            <div class="space-y-4">
              <button class="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Reset Account Password</button>
              <button class="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Send Direct Message</button>
              <button class="w-full py-4 bg-red-500/80 hover:bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Request Deletion</button>
            </div>
          </div>
        </section>
      </div>
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
  
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center space-y-6">
      <div class="w-16 h-16 border-4 border-brand-blue/10 border-t-brand-blue rounded-full animate-spin mx-auto"></div>
      <p class="text-xs font-black text-brand-blue uppercase tracking-[0.3em] animate-pulse">Retrieving member core data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUsersStore } from '../../../stores/usersStore';
import ConfirmationModal from '../../../components/common/ConfirmationModal.vue';

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const usersStore = useUsersStore();

const user = computed(() => usersStore.users.find(u => u.id === route.params.id) || null);

const personalInfo = computed(() => [
  { label: 'Full Legal Name', value: user.value?.name },
  { label: 'Primary Email Address', value: user.value?.email },
  { label: 'Current Residency', value: user.value?.location },
  { label: 'Member Since', value: user.value?.joinedDate },
]);

const roleStyles = {
  owner: 'bg-brand-blue text-white',
  admin: 'bg-teal-600 text-white',
  user: 'bg-gray-100 text-gray-600 border border-gray-200',
};

// Update Logic
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const pendingUpdate = ref(null);

const triggerUpdate = (type, newValue) => {
  if (user.value[type] === newValue) return;

  pendingUpdate.value = { id: user.value.id, [type]: newValue };
  modalTitle.value = `Confirm Admin Modification`;
  modalMessage.value = `Are you sure you want to change ${user.value.name}'s ${type} to ${newValue.toUpperCase()}? This action is logged and affects their platform permissions.`;
  showModal.value = true;
};

const onConfirm = async () => {
  if (pendingUpdate.value) {
    const { id, ...updates } = pendingUpdate.value;
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
  if (!usersStore.users.length) {
    usersStore.fetchUsers();
  }
});
</script>
