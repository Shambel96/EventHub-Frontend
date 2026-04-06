<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm mt-6">
    <div class="flex-1 flex justify-between sm:hidden">
      <button 
        @click="$emit('update:page', page - 1)" 
        :disabled="page === 1"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <button 
        @click="$emit('update:page', page + 1)" 
        :disabled="page === totalPages"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Showing <span class="text-brand-blue">{{ from }}</span> to <span class="text-brand-blue">{{ to }}</span> of <span class="text-brand-blue">{{ total }}</span> results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
          <button 
            @click="$emit('update:page', page - 1)" 
            :disabled="page === 1"
            class="relative inline-flex items-center px-3 py-2 rounded-l-lg border border-gray-200 bg-white text-sm font-bold text-gray-400 hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          <button 
            v-for="p in totalPages" 
            :key="p"
            @click="$emit('update:page', p)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-200 bg-white text-sm font-bold"
            :class="[p === page ? 'bg-brand-blue border-brand-blue text-white z-10' : 'text-gray-500 hover:bg-gray-50']"
          >
            {{ p }}
          </button>

          <button 
            @click="$emit('update:page', page + 1)" 
            :disabled="page === totalPages"
            class="relative inline-flex items-center px-3 py-2 rounded-r-lg border border-gray-200 bg-white text-sm font-bold text-gray-400 hover:bg-gray-50 disabled:opacity-50"
          >
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  page: Number,
  totalPages: Number,
  total: Number,
  from: Number,
  to: Number
});

defineEmits(['update:page']);
</script>
