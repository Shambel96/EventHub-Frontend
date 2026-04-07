<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
    <div class="bg-blue-600 text-white p-8 rounded-xl shadow-2xl text-center max-w-lg w-full">
      <h1 class="text-3xl font-extrabold mb-4 tracking-tight">EventHub is Live! 🎉</h1>
      <p class="text-lg mb-6 opacity-90 overflow-hidden">Your professional Nuxt project with Tailwind v4 routing and layout is fully set up and ready for development.</p>
      <button class="bg-white text-blue-600 px-6 py-2.5 rounded-lg shadow hover:bg-blue-50 transition-colors font-semibold text-[15px]">
        Get Started
      </button>
    </div>
    <button @click="handleLogout" class="text-red-400 hover:text-red-300">
  Logout
</button>
  </div>
</template>

<script setup lang="ts">
// Professional practice: always add basic SEO/head setup on pages
useHead({
  title: 'EventHub | Welcome',
  meta: [
    { name: 'description', content: 'EventHub is a modern platform to manage your events seamlessly.' }
  ]
})

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    await $fetch('http://localhost:3000/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    });
  } catch (err) {
    console.log('Backend logout failed, but we will clear token anyway');
  }

  authStore.logout();        
  // OR manually:
  // localStorage.removeItem('token');
  // authStore.user = null;
  // authStore.token = null;

  router.push('/auth/login');
};

</script>
