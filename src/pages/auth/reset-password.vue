<template>
  <AuthCard>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white mb-2">Set New Password</h1>
      <p class="text-gray-400 text-sm">Please enter your new password below.</p>
    </div>
    
    <div v-if="successMessage" class="p-4 mb-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
      <p class="mb-4">{{ successMessage }}</p>
      <NuxtLink to="/auth/login">
        <AuthButton variant="primary">Go to Login</AuthButton>
      </NuxtLink>
    </div>

    <div v-if="errorMessage" class="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit" v-if="!successMessage" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">New Password</label>
        <input 
          v-model="newPassword" 
          type="password" 
          required 
          minlength="8"
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="At least 8 characters"
          :disabled="loading"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1.5">Confirm New Password</label>
        <input 
          v-model="confirmPassword" 
          type="password" 
          required 
          class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
          placeholder="Type password again"
          :disabled="loading"
        />
      </div>

      <div class="pt-2">
        <AuthButton 
          type="submit" 
          variant="primary" 
          :loading="loading"
          :disabled="!tokenExists"
        >
          Reset Password
        </AuthButton>
      </div>
      
      <p v-if="!tokenExists" class="mt-3 text-sm text-red-400 text-center">
        Missing reset token. Please use the link from your email.
      </p>
    </form>
  </AuthCard>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const config = useRuntimeConfig();
const route = useRoute();

const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const token = computed(() => route.query.token);
const tokenExists = computed(() => !!token.value);

onMounted(() => {
  if (!tokenExists.value) {
    errorMessage.value = 'Invalid password reset link. No token found in the URL.';
  }
});

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const response = await $fetch(`${config.public.apiBase}/auth/reset-password`, {
      method: 'POST',
      body: { 
        token: token.value,
        newPassword: newPassword.value 
      }
    });

    successMessage.value = response.message;

  } catch (error) {
    const msg = error.data?.message;
    errorMessage.value = Array.isArray(msg) ? msg[0] : (msg || 'Failed to reset password. The link might be expired.');
  } finally {
    loading.value = false;
  }
};
</script>
