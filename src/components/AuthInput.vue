<template>
  <div class="flex flex-col gap-1.5">
    <label :for="inputId" class="text-xs font-medium text-white/60 uppercase tracking-widest">
      {{ label }}
    </label>

    <div class="relative flex items-center">
      <!-- Icon -->
      <span
        v-if="$slots.icon"
        class="absolute left-3.5 flex items-center pointer-events-none text-white/40"
      >
        <slot name="icon" />
      </span>

      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :placeholder="placeholder"
        :class="[
          'w-full h-12 rounded-xl text-sm text-white outline-none transition-all duration-200',
          'bg-white/10 border placeholder:text-white/25',
          'focus:bg-white/15 focus:border-white/40 focus:ring-2 focus:ring-white/10',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          $slots.icon ? 'pl-10 pr-4' : 'px-4',
          type === 'password' ? '!pr-11' : '',
          error ? 'border-red-400/60 focus:border-red-400/80 focus:ring-red-400/10' : 'border-white/15',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <button
        v-if="type === 'password'"
        type="button"
        tabindex="-1"
        class="absolute right-3 text-white/40 hover:text-white/70 transition-colors"
        @click="showPassword = !showPassword"
      >
        <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/>
        </svg>
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- Error -->
    <p v-if="error" class="text-xs text-red-400 mt-0.5 pl-0.5">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  error?: string
  autocomplete?: string
  disabled?: boolean
}>(), {
  type: 'text',
  placeholder: '',
  error: '',
  autocomplete: 'off',
  disabled: false,
})

defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const showPassword = ref(false)
const inputId = computed(() => `input-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
const computedType = computed(() =>
  props.type === 'password' ? (showPassword.value ? 'text' : 'password') : props.type
)
</script>