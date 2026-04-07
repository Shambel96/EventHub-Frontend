<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main class="flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '../components/common/Navbar.vue';
import Footer from '../components/common/Footer.vue';
</script>

<style scoped>
/* Any layout specific styles can go here */
</style>
