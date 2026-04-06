<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'relative w-full h-12 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center overflow-hidden',
      variant === 'primary'
        ? 'bg-white text-gray-900 hover:bg-white/90 active:scale-[0.98] shadow-lg shadow-black/20 disabled:opacity-40'
        : 'bg-white/10 text-white border border-white/20 hover:bg-white/15 active:scale-[0.98] disabled:opacity-40',
      (disabled || loading) ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
  >
    <svg
      v-if="loading"
      class="absolute animate-spin"
      width="18" height="18" viewBox="0 0 24 24" fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-dasharray="31.4 31.4" />
    </svg>
    <span :class="loading ? 'opacity-0' : 'opacity-100'">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  loading?:  boolean
  disabled?: boolean
  type?:     'button' | 'submit' | 'reset'
  variant?:  'primary' | 'secondary'
}>(), {
  loading:  false,
  disabled: false,
  type:     'button',
  variant:  'primary',
})
</script>