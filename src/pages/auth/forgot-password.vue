<template>
  <AuthCard>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Forgot Password</h1>
      <p class="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
    </div>

    <div v-if="successMessage" class="p-4 mb-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit" v-if="!successMessage" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
        <input 
          v-model="email" 
          type="email" 
          required 
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="event@example.com"
          :disabled="loading"
        />
      </div>

      <div class="pt-2">
        <AuthButton 
          type="submit" 
          variant="primary" 
          :loading="loading"
        >
          Send Reset Link
        </AuthButton>
      </div>
    </form>
    
    <div class="mt-8 text-center">
      <NuxtLink to="/login" class="text-sm text-gray-400 hover:text-white transition-colors">
        Back to Login
      </NuxtLink>
    </div>
  </AuthCard>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const email = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await $fetch(`${config.public.apiBase}/auth/forgot-password`, {
      method: 'POST',
      body: { email: email.value }
    });

    successMessage.value = response.message;
    email.value = ''; 

  } catch (error) {
    errorMessage.value = error.data?.message || 'An unexpected error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>