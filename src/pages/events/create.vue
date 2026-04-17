<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-brand-blue">Create Event</h1>
      <NuxtLink to="/events" class="text-gray-500 hover:text-brand-blue font-medium transition">
        &larr; Back to Events
      </NuxtLink>
    </div>

    <form @submit.prevent="submitEvent" class="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-8 relative overflow-hidden">
      <!-- Submission Overlay / Progress Tracker -->
      <transition name="fade">
        <div v-if="isSubmitting" class="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
          <div class="mb-8 relative">
            <div class="w-24 h-24 border-8 border-gray-100 border-t-brand-blue rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-brand-blue font-black text-xl">{{ progressPercentage }}%</span>
            </div>
          </div>
          <h3 class="text-2xl font-black text-brand-blue mb-2 tracking-tight">{{ progressTitle }}</h3>
          <p class="text-gray-500 font-bold uppercase tracking-widest text-xs">{{ progressSubtitle }}</p>
          
          <!-- Detailed Steps -->
          <div class="mt-10 w-full max-w-xs space-y-3">
             <div v-for="step in progressSteps" :key="step.key" class="flex items-center gap-3 transition-opacity duration-500" :class="[isStepComplete(step.key) ? 'opacity-100' : 'opacity-30']">
                <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px]" :class="[isStepComplete(step.key) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400']">
                  <svg v-if="isStepComplete(step.key)" class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  <span v-else>{{ step.index }}</span>
                </div>
                <span class="text-xs font-black uppercase tracking-widest" :class="[isStepComplete(step.key) ? 'text-green-600' : 'text-gray-400']">{{ step.label }}</span>
             </div>
          </div>
        </div>
      </transition>
      
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
              <label v-for="amenity in displayedAmenities" :key="amenity" class="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-1 rounded transition">
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
          <p class="text-xs text-gray-500">Images are uploaded after the category and event record are created.</p>
        </div>
        
        <div v-if="form.images.length > 0" class="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="(img, idx) in form.images" :key="img.id" class="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition">
            <img :src="img.previewUrl" class="w-full h-full object-cover" />
            <button type="button" @click="removeImage(idx)" class="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-md transform hover:scale-110">
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
      <div v-if="submitError" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
        {{ submitError }}
      </div>

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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useEventsStore } from '../../stores/eventsStore';
import { useAuthStore } from '../../stores/auth';
import { useAmenitiesStore } from '../../stores/amenitiesStore';
import { useToast } from '../../composables/useToast';

definePageMeta({
  middleware: 'auth',
});

interface LocalImageUpload {
  id: string;
  file: File;
  previewUrl: string;
}

interface EventStepForm {
  id: string;
  title: string;
  description: string;
}

const router = useRouter();
const eventsStore = useEventsStore();
const authStore = useAuthStore();
const amenitiesStore = useAmenitiesStore();
const toast = useToast();

const { isAuthenticated } = storeToRefs(authStore);
const isSubmitting = ref(false);
const submitError = ref('');
const canCreateEvents = computed(() => ['OWNER', 'ADMIN'].includes(authStore.user?.role || ''));

const presetCategories = ['Conference', 'Music Festival', 'Tech Workshop', 'Business Networking', 'Live Concert', 'Art Exhibition', 'Local Meetup', 'Online Webinar'];

const displayedAmenities = computed(() => {
  const defaultList = [
    'High-Speed WiFi', 'Valet Parking', 'Catered Food & Drinks', 
    'Wheelchair Accessible', 'VIP Lounge', 'Air Conditioning'
  ];
  
  // Combine defaults with real amenities from store
  const fromStore = amenitiesStore.amenities.map(a => a.name);
  return [...new Set([...defaultList, ...fromStore])];
});

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
  images: [] as LocalImageUpload[],
  steps: [] as EventStepForm[]
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

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0) return;
  
  for (let i = 0; i < files.length; i++) {
    const fakeId = Math.random().toString(36).substring(7);
    const previewUrl = URL.createObjectURL(files[i]);
    form.value.images.push({ id: fakeId, file: files[i], previewUrl });
  }

  input.value = '';
};

const addStep = () => {
  form.value.steps.push({
    id: Math.random().toString(36).substring(7),
    title: '',
    description: ''
  });
};

const removeImage = (index: number) => {
  const [removed] = form.value.images.splice(index, 1);
  if (removed) {
    URL.revokeObjectURL(removed.previewUrl);
  }
};

const resetForm = () => {
  form.value.images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  form.value = {
    title: '',
    description: '',
    price: 0,
    location: '',
    startDate: '',
    endDate: '',
    images: [],
    steps: []
  };
  selectedCategory.value = '';
  customCategory.value = '';
  selectedAmenities.value = [];
  isOtherAmenitySelected.value = false;
  customAmenity.value = '';
};

onMounted(() => {
  amenitiesStore.fetchAmenities();
});

onBeforeUnmount(() => {
  form.value.images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
});

// Progress Tracking Logic
const progressSteps = [
  { key: 'resolving_category', label: 'Category Sync', index: 1 },
  { key: 'creating_event', label: 'Event Creation', index: 2 },
  { key: 'linking_amenities', label: 'Amenities Link', index: 3 },
  { key: 'adding_itinerary', label: 'Itinerary Build', index: 4 },
  { key: 'uploading_images', label: 'Gallery Upload', index: 5 }
];

const progressTitle = computed(() => {
  switch (eventsStore.creationStatus) {
    case 'resolving_category': return 'Syncing Categories';
    case 'creating_event': return 'Creating Your Event';
    case 'linking_amenities': return 'Configuring Amenities';
    case 'adding_itinerary': return 'Building Itinerary';
    case 'uploading_images': return 'Uploading Gallery';
    case 'complete': return 'Success!';
    default: return 'Starting...';
  }
});

const progressSubtitle = computed(() => {
  if (eventsStore.creationStatus === 'complete') return 'Redirecting you now...';
  return 'Please do not close this window';
});

const progressPercentage = computed(() => {
  const keys = ['resolving_category', 'creating_event', 'linking_amenities', 'adding_itinerary', 'uploading_images', 'complete'];
  const index = keys.indexOf(eventsStore.creationStatus);
  return Math.round(((index + 1) / keys.length) * 100);
});

const isStepComplete = (key: string) => {
  const keys = ['resolving_category', 'creating_event', 'linking_amenities', 'adding_itinerary', 'uploading_images', 'complete'];
  const currentIndex = keys.indexOf(eventsStore.creationStatus);
  const stepIndex = keys.indexOf(key);
  return currentIndex > stepIndex || eventsStore.creationStatus === 'complete';
};

const submitEvent = async () => {
  submitError.value = '';
  
  // Validation
  if (form.value.price < 0) {
    toast.error('Price cannot be negative');
    return;
  }
  
  if (!form.value.startDate || !form.value.endDate || new Date(form.value.endDate) <= new Date(form.value.startDate)) {
    toast.error('Please choose an end date that comes after the start date.');
    return;
  }

  const finalCategory = selectedCategory.value === 'Other' ? customCategory.value.trim() : selectedCategory.value;
  if (!finalCategory) {
    toast.error('Please choose or enter a category for the event.');
    return;
  }

  if (!isAuthenticated.value) {
    toast.info('Session expired. Redirecting to login...');
    router.push({ path: '/auth/login', query: { redirect: '/events/create' } });
    return;
  }

  if (!canCreateEvents.value) {
    toast.error('Permission denied: Account must be an Owner or Admin.');
    return;
  }

  isSubmitting.value = true;

  const finalAmenities = [...selectedAmenities.value];
  if (isOtherAmenitySelected.value && customAmenity.value) {
    const customs = customAmenity.value.split(',').map(s => s.trim()).filter(Boolean);
    finalAmenities.push(...customs);
  }

  const payload = {
    title: form.value.title,
    description: form.value.description,
    price: form.value.price,
    isPaid: form.value.price > 0,
    startDate: new Date(form.value.startDate).toISOString(),
    endDate: new Date(form.value.endDate).toISOString(),
    duration: calculatedDuration.value,
    location: form.value.location,
    categoryId: finalCategory,
    amenities: finalAmenities,
    steps: form.value.steps.map((step, index) => ({
      title: step.title,
      description: step.description,
      content: step.description,
      stepOrder: index + 1
    }))
  };

  try {
    const createdEvent = await eventsStore.addEvent(payload as any);

    if (createdEvent?.id && form.value.images.length > 0) {
      eventsStore.creationStatus = 'uploading_images';
      try {
        const imageFiles = form.value.images.map(img => img.file);
        await eventsStore.uploadEventImages(createdEvent.id, imageFiles);
      } catch (uploadError) {
        console.error('Batch image upload failed', uploadError);
        toast.warning('Gallery upload encountered an issue, but your event was created.');
      }
    }

    eventsStore.creationStatus = 'complete';
    toast.success('Your event has been successfully published!');
    
    setTimeout(() => {
      resetForm();
      router.push('/events');
    }, 2000);
  } catch (e: any) {
    console.error('Failed to create event', e);
    const statusCode = e?.statusCode || e?.status;

    if (statusCode === 401) {
      toast.error('Unauthorized: Your session may have expired.');
      router.push({ path: '/auth/login', query: { redirect: '/events/create' } });
      return;
    }

    submitError.value = e?.data?.message || e?.message || 'Failed to create event.';
    toast.error(submitError.value as string);
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
