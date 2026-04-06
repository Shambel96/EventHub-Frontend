<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-brand-blue/40 backdrop-blur-sm" @click="$emit('close')"></div>
      
      <div class="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl relative z-60 overflow-hidden flex flex-col max-h-[90vh]">
        <!-- Header -->
        <header class="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 class="text-2xl font-black text-brand-blue tracking-tight">Edit Experience Details</h2>
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Refine and update your platform content</p>
          </div>
          <button @click="$emit('close')" class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-blue transition-colors shadow-sm">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <!-- Form Body -->
        <div class="flex-1 overflow-y-auto p-8 space-y-12">
          <!-- Basic Info Section -->
          <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="md:col-span-2 space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Experience Title</label>
              <input v-model="form.title" type="text" class="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue/20 rounded-2xl outline-none font-bold text-brand-blue transition-all" />
            </div>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Category Identification</label>
              <input v-model="form.categoryId" type="text" class="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue/20 rounded-2xl outline-none font-bold text-brand-blue transition-all" />
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Venue Location</label>
              <input v-model="form.location" type="text" class="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue/20 rounded-2xl outline-none font-bold text-brand-blue transition-all" />
            </div>

            <div class="md:col-span-2 space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Deep Description</label>
              <textarea v-model="form.description" rows="4" class="w-full px-6 py-4 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-blue/20 rounded-2xl outline-none font-bold text-brand-blue transition-all resize-none"></textarea>
            </div>
          </section>

          <!-- Logistics Section -->
          <section class="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50/50 rounded-3xl border border-gray-100">
             <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Begin Date</label>
              <input v-model="form.startDate" type="datetime-local" class="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-brand-blue text-xs transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">End Date</label>
              <input v-model="form.endDate" type="datetime-local" class="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-brand-blue text-xs transition-all" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Price ($)</label>
              <input v-model.number="form.price" type="number" class="w-full px-4 py-3 bg-white border border-gray-100 rounded-xl outline-none font-bold text-brand-blue text-xs transition-all" />
            </div>
          </section>

          <!-- Amenities Section -->
          <section>
             <h3 class="text-xs font-black uppercase tracking-widest text-brand-blue mb-4 ml-2">Included Amenities</h3>
             <div class="flex flex-wrap gap-3">
                <div v-for="(amenity, idx) in form.amenities" :key="idx" class="flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-xl border border-brand-blue/10">
                   <span class="text-[10px] font-black uppercase text-brand-blue">{{ amenity }}</span>
                   <button @click="removeAmenity(idx)" class="text-red-400 hover:text-red-600 transition-colors">
                      <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                </div>
                <button @click="addAmenity" class="px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:border-brand-blue hover:text-brand-blue transition-all">+ Add New</button>
             </div>
          </section>
        </div>

        <!-- Footer -->
        <footer class="p-8 bg-white border-t border-gray-50 flex justify-end gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button @click="$emit('close')" class="px-8 py-4 bg-gray-50 hover:bg-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all">Discard Changes</button>
          <button @click="handleSubmit" :disabled="isLoading" class="px-10 py-4 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-blue/20 flex items-center gap-2">
            <template v-if="!isLoading">
               Save Experience
            </template>
            <template v-else>
               <div class="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               Saving...
            </template>
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useEventsStore } from '../../stores/eventsStore';

const props = defineProps({
  isOpen: Boolean,
  event: Object
});

const emit = defineEmits(['close', 'updated']);
const eventsStore = useEventsStore();
const isLoading = ref(false);

const form = ref({
  title: '',
  description: '',
  categoryId: '',
  location: '',
  startDate: '',
  endDate: '',
  price: 0,
  amenities: []
});

watch(() => props.event, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title,
      description: newVal.description,
      categoryId: newVal.categoryId,
      location: newVal.location,
      startDate: newVal.startDate ? newVal.startDate.substring(0, 16) : '',
      endDate: newVal.endDate ? newVal.endDate.substring(0, 16) : '',
      price: newVal.price,
      amenities: [...(newVal.amenities || [])]
    };
  }
}, { immediate: true });

const addAmenity = () => {
  const val = prompt('Enter amenity name:');
  if (val) form.value.amenities.push(val);
};

const removeAmenity = (idx) => {
  form.value.amenities.splice(idx, 1);
};

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    await eventsStore.updateEvent(props.event.id, form.value);
    emit('updated');
    emit('close');
  } catch (err) {
    console.error('Failed to update event:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

/* Custom Date Highlight */
input[type="datetime-local"]::-webkit-calendar-picker-indicator {
  filter: invert(0.4) sepia(1) saturate(5) hue-rotate(175deg);
  cursor: pointer;
}
</style>
