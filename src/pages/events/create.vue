<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-brand-blue">Create Event</h1>
      <NuxtLink to="/events" class="text-gray-500 hover:text-brand-blue font-medium transition">
        &larr; Back to Events
      </NuxtLink>
    </div>

    <form @submit.prevent="submitEvent" class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8">
      
      <!-- Basic Info -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Basic Info</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Title <span class="text-red-500">*</span></label>
            <input v-model="form.title" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" placeholder="E.g., Tech Innovators 2026" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description <span class="text-red-500">*</span></label>
            <textarea v-model="form.description" required rows="4" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" placeholder="Detailed event description..."></textarea>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Price (USD) <span class="text-red-500">*</span></label>
            <input v-model.number="form.price" required type="number" min="0" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" />
          </div>
        </div>
      </section>

      <!-- Date & Time -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Date & Time</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Begin Date & Time <span class="text-red-500">*</span></label>
            <input v-model="form.startDate" required type="datetime-local" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">End Date & Time <span class="text-red-500">*</span></label>
            <input v-model="form.endDate" required type="datetime-local" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" />
          </div>
          <div v-if="calculatedDuration" class="md:col-span-2 bg-blue-50/50 border border-blue-100 text-brand-blue p-3 rounded-lg text-sm font-semibold flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Calculated Duration: {{ calculatedDuration }}
          </div>
        </div>
      </section>

      <!-- Category & Amenities -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Category & Amenities</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Category -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Category <span class="text-red-500">*</span></label>
            <select v-model="selectedCategory" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none">
              <option disabled value="">Select a category</option>
              <option v-for="cat in presetCategories" :key="cat" :value="cat">{{ cat }}</option>
              <option value="Other">Other (Specify)</option>
            </select>
            <transition name="fade">
              <input v-if="selectedCategory === 'Other'" v-model="customCategory" type="text" placeholder="Type custom category..." class="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" />
            </transition>
          </div>

          <!-- Location -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Location <span class="text-red-500">*</span></label>
            <input v-model="form.location" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" placeholder="E.g., San Francisco, CA or Virtual" />
          </div>

          <!-- Amenities -->
          <div class="md:col-span-2">
            <label class="block text-sm font-semibold text-gray-700 mb-3">Amenities Provide check for all that apply</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label v-for="amenity in presetAmenities" :key="amenity" class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition">
                <input type="checkbox" :value="amenity" v-model="selectedAmenities" class="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4" />
                <span>{{ amenity }}</span>
              </label>
              <label class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-4">
                <input type="checkbox" v-model="isOtherAmenitySelected" class="rounded border-gray-300 text-brand-blue focus:ring-brand-blue h-4 w-4" />
                <span class="font-semibold">Other (Specify)</span>
              </label>
            </div>
            <transition name="fade">
              <input v-if="isOtherAmenitySelected" v-model="customAmenity" type="text" placeholder="Separate other amenities using commas..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm" />
            </transition>
          </div>
        </div>
      </section>

      <!-- Images -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Event Marketing Images</h2>
        <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-blue-50/50 hover:border-brand-blue transition cursor-pointer relative group">
          <input type="file" multiple accept="image/*" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div class="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <svg class="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p class="text-sm text-gray-700 font-semibold mb-1">Click or drag images to upload to cloud</p>
          <p class="text-xs text-gray-500">A simulated upload instantly generates cloud URLs.</p>
        </div>
        
        <div v-if="form.images.length > 0" class="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="(img, idx) in form.images" :key="img.id" class="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition">
            <img :src="img.url" class="w-full h-full object-cover" />
            <button type="button" @click="form.images.splice(idx, 1)" class="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-md transform hover:scale-110">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Dynamic Steps -->
      <section>
        <div class="flex items-center justify-between mb-4 border-b pb-2">
          <h2 class="text-xl font-bold text-gray-800">Event Steps & Itinerary</h2>
          <button type="button" @click="addStep" class="text-sm font-bold text-brand-blue bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition flex items-center shadow-sm">
            <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Add Step
          </button>
        </div>
        
        <div v-if="form.steps.length === 0" class="text-center py-8 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 text-sm italic">
          No steps added yet. Add an itinerary for conferences, multi-day festivals, or workshops.
        </div>
        
        <transition-group name="list" tag="div" class="space-y-4">
          <div v-for="(step, index) in form.steps" :key="step.id" class="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group">
            <div class="absolute -left-3 -top-3 bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow">
              {{ index + 1 }}
            </div>
            <button type="button" @click="form.steps.splice(index, 1)" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition p-1 bg-white rounded-md border shadow-sm opacity-0 group-hover:opacity-100">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
            <div class="grid gap-4 md:pr-10 ml-2">
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Step Title</label>
                <input v-model="step.title" type="text" required class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="E.g., Day 1: Registration & Keynote" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Step Description</label>
                <textarea v-model="step.description" required rows="2" class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Detail what happens during this step..."></textarea>
              </div>
            </div>
          </div>
        </transition-group>
      </section>

      <!-- Submit -->
      <div class="pt-8 flex justify-end">
        <button type="submit" :disabled="isSubmitting" class="bg-gradient-to-r from-brand-blue to-blue-900 text-white font-bold text-lg px-10 py-4 rounded-xl hover:shadow-xl transition-all flex items-center shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Publishing Event...' : 'Launch Event' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useEventsStore } from '../../stores/eventsStore';

const router = useRouter();
const eventsStore = useEventsStore();
const isSubmitting = ref(false);

const presetCategories = ['Conference', 'Music Festival', 'Tech Workshop', 'Business Networking', 'Live Concert', 'Art Exhibition', 'Local Meetup', 'Online Webinar'];
const presetAmenities = ['High-Speed WiFi', 'Valet Parking', 'Catered Food & Drinks', 'Wheelchair Accessible', 'VIP Lounge', 'Air Conditioning', 'Coat Check', 'On-site Security', 'ATM Machines', 'First Aid Station'];

const selectedCategory = ref('');
const customCategory = ref('');

const selectedAmenities = ref<string[]>([]);
const isOtherAmenitySelected = ref(false);
const customAmenity = ref('');

const form = ref({
  title: '',
  description: '',
  price: 0,
  location: '',
  startDate: '',
  endDate: '',
  images: [] as { id: string, url: string }[],
  steps: [] as { id: string, title: string, description: string }[]
});

const calculateDuration = (begin: string, end: string) => {
  if (!begin || !end) return '';
  const d1 = new Date(begin);
  const d2 = new Date(end);
  if (d2 <= d1) return 'Invalid dates (End must be after Begin)';
  
  const diffHours = Math.abs(d2.getTime() - d1.getTime()) / 36e5;
  if (diffHours < 24) return `${diffHours.toFixed(1)} hours`;
  return `${(diffHours / 24).toFixed(1)} days`;
};

const calculatedDuration = computed(() => calculateDuration(form.value.startDate, form.value.endDate));

const handleFileUpload = async (event: any) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  
  // Simulate cloud upload returning URLs
  for (let i = 0; i < files.length; i++) {
    const fakeId = Math.random().toString(36).substring(7);
    const fakeCloudUrl = URL.createObjectURL(files[i]); 
    form.value.images.push({ id: fakeId, url: fakeCloudUrl });
  }
};

const addStep = () => {
  form.value.steps.push({
    id: Math.random().toString(36).substring(7),
    title: '',
    description: ''
  });
};

const submitEvent = async () => {
  isSubmitting.value = true;
  
  const finalCategory = selectedCategory.value === 'Other' ? customCategory.value : selectedCategory.value;
  
  const finalAmenities = [...selectedAmenities.value];
  if (isOtherAmenitySelected.value && customAmenity.value) {
    const customs = customAmenity.value.split(',').map(s => s.trim()).filter(Boolean);
    finalAmenities.push(...customs);
  }

  const payload = {
    title: form.value.title,
    description: form.value.description,
    price: form.value.price,
    startDate: new Date(form.value.startDate).toISOString(),
    endDate: new Date(form.value.endDate).toISOString(),
    duration: calculatedDuration.value,
    location: form.value.location,
    categoryId: finalCategory || 'unspecified',
    amenities: finalAmenities,
    images: form.value.images,
    steps: form.value.steps
  };

  try {
    await eventsStore.addEvent(payload as any);
    router.push('/events');
  } catch (e) {
    console.error('Failed to create event', e);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
