<template>
  <div class="min-h-screen bg-gray-50 flex overflow-hidden">
    <main class="flex-1 mr-80 transition-all duration-300 overflow-y-auto">
      <div class="p-8 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <AdminSidebar />
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminSidebar.vue';

useHead({
  title: 'Admin Dashboard | EventHub',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
@media (max-width: 1024px) {
  .mr-80 {
    margin-right: 0;
  }
}
</style>
