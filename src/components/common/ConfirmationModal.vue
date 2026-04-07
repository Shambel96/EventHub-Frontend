<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-blue/40 backdrop-blur-sm">
      <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100 border border-brand-blue/5">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-brand-yellow/20 flex items-center justify-center text-brand-blue">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 class="text-2xl font-black text-brand-blue">{{ title }}</h2>
        </div>
        
        <p class="text-gray-500 font-bold mb-8 leading-relaxed">{{ message }}</p>
        
        <div class="flex gap-4">
          <button 
            @click="$emit('cancel')" 
            class="flex-1 px-6 py-3 rounded-xl border border-gray-100 text-gray-400 font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="$emit('confirm')" 
            class="flex-1 px-6 py-3 rounded-xl bg-brand-blue text-white font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-brand-blue/20 transition-all active:scale-95"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String
});

defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
