<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-brand-blue/40 backdrop-blur-sm p-4">
    <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100">
      <!-- Header -->
      <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 class="text-xl font-black text-brand-blue tracking-tight">Event Images</h3>
          <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Manage gallery and featured visual</p>
        </div>
        <button @click="$emit('close')" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-8">
        <div v-if="!event?.images?.length" class="text-center py-20 opacity-30 italic font-black text-brand-blue uppercase tracking-widest">
          No images uploaded yet
        </div>
        
        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div 
            v-for="(img, index) in event.images" 
            :key="img.id"
            class="relative aspect-square group rounded-2xl overflow-hidden border-2 transition-all cursor-pointer"
            :class="[index === 0 ? 'border-brand-yellow ring-4 ring-brand-yellow/10' : 'border-transparent hover:border-brand-blue/20']"
          >
            <img :src="img.url" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
            
            <!-- Featured Badge -->
            <div v-if="index === 0" class="absolute top-3 left-3 bg-brand-yellow text-brand-blue text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
              <svg class="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
              Featured
            </div>

            <!-- Overlay Actions -->
            <div class="absolute inset-0 bg-brand-blue/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                v-if="index !== 0"
                @click="setFeatured(img.id)"
                class="px-4 py-2 bg-white text-brand-blue text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
              >
                Set Featured
              </button>
              <button 
                class="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Delete image"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Upload Toggle -->
      <div class="p-6 bg-gray-50/50 border-t border-gray-100">
        <label class="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-brand-blue/40 hover:bg-white transition-all group">
          <input type="file" multiple class="hidden" accept="image/*" />
          <svg class="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          <span class="text-xs font-black text-gray-400 group-hover:text-brand-blue uppercase tracking-widest">Upload New Experience Visuals</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '../../stores/eventsStore';

const props = defineProps({
  isOpen: Boolean,
  event: Object
});

const emit = defineEmits(['close']);

const eventsStore = useEventsStore();

const setFeatured = async (imageId) => {
  if (!props.event?.id) return;
  await eventsStore.setFeaturedImage(props.event.id, imageId);
};
</script>
