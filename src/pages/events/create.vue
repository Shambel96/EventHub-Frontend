<template>
  <div class="max-w-4xl mx-auto py-12 px-4 sm:px-6">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-brand-blue">Create Event</h1>
      <NuxtLink to="/events" class="text-gray-500 hover:text-brand-blue font-medium transition">
        &larr; Back to Events
      </NuxtLink>
    </div>

    <!-- Progress indicator -->
    <div v-if="isSubmitting" class="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <p class="text-sm font-semibold text-brand-blue mb-2">{{ submitStatus }}</p>
      <div class="w-full bg-gray-100 rounded-full h-1.5">
        <div class="bg-brand-blue h-1.5 rounded-full transition-all duration-500" :style="{ width: `${submitProgress}%` }" />
      </div>
    </div>

    <!-- Error banner -->
    <div v-if="submitError" class="mb-6 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      {{ submitError }}
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
            <label class="block text-sm font-semibold text-gray-700 mb-1">Price (USD)</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" placeholder="0 for free events" />
          </div>
          <div class="flex items-center gap-3 pt-6">
            <input type="checkbox" id="isPaid" v-model="form.isPaid" class="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
            <label for="isPaid" class="text-sm font-semibold text-gray-700">This is a paid event</label>
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
            <label class="block text-sm font-semibold text-gray-700 mb-1">End Date & Time</label>
            <input v-model="form.endDate" type="datetime-local" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" />
          </div>
          <div v-if="calculatedDuration" class="md:col-span-2 bg-blue-50/50 border border-blue-100 text-brand-blue p-3 rounded-lg text-sm font-semibold flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Calculated Duration: {{ calculatedDuration.label }} ({{ calculatedDuration.minutes }} minutes)
          </div>
        </div>
      </section>

      <!-- Category & Location -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Category & Location</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Location <span class="text-red-500">*</span></label>
            <input v-model="form.location" required type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none" placeholder="E.g., San Francisco, CA or Virtual" />
          </div>
        </div>
      </section>

      <!-- Images -->
      <section>
        <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Event Images</h2>
        <div class="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-blue-50/50 hover:border-brand-blue transition cursor-pointer relative group">
          <input type="file" multiple accept="image/*" @change="handleFileUpload" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div class="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
            <svg class="h-8 w-8 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p class="text-sm text-gray-700 font-semibold mb-1">Click or drag images to upload</p>
          <p class="text-xs text-gray-500">Images will be uploaded after the event is created.</p>
        </div>

        <div v-if="selectedFiles.length > 0" class="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          <div v-for="(file, idx) in selectedFiles" :key="idx" class="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition">
            <img :src="file.preview" class="w-full h-full object-cover" />
            <button type="button" @click="removeFile(idx)" class="absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-red-600 shadow-md">
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
                <textarea v-model="step.description" rows="2" class="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="Detail what happens during this step..."></textarea>
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
          {{ isSubmitting ? 'Publishing...' : 'Launch Event' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../../composables/useApi'

const router = useRouter()
const { $authFetch } = useApi()

const isSubmitting = ref(false)
const submitStatus = ref('')
const submitProgress = ref(0)
const submitError = ref('')

const presetCategories = ['Conference', 'Music Festival', 'Tech Workshop', 'Business Networking', 'Live Concert', 'Art Exhibition', 'Local Meetup', 'Online Webinar']

const selectedCategory = ref('')
const customCategory = ref('')

// Raw File objects for real upload
const selectedFiles = ref<{ file: File; preview: string }[]>([])

const form = ref({
  title: '',
  description: '',
  price: 0,
  isPaid: false,
  location: '',
  startDate: '',
  endDate: '',
  steps: [] as { id: string; title: string; description: string }[],
})

// ── Duration ─────────────────────────────────────────
const calculatedDuration = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return null
  const d1 = new Date(form.value.startDate)
  const d2 = new Date(form.value.endDate)
  if (d2 <= d1) return null
  const minutes = Math.round((d2.getTime() - d1.getTime()) / 60000)
  const hours = minutes / 60
  const label = hours < 24 ? `${hours.toFixed(1)} hours` : `${(hours / 24).toFixed(1)} days`
  return { minutes, label }
})

// ── Files ─────────────────────────────────────────────
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach(file => {
    selectedFiles.value.push({ file, preview: URL.createObjectURL(file) })
  })
  // Reset input so same file can be re-selected
  input.value = ''
}

const removeFile = (idx: number) => {
  const file = selectedFiles.value[idx]
  if (!file) return

  URL.revokeObjectURL(file.preview)
  selectedFiles.value.splice(idx, 1)
}

// ── Steps ─────────────────────────────────────────────
const addStep = () => {
  form.value.steps.push({ id: Math.random().toString(36).substring(7), title: '', description: '' })
}

// ── Submit ────────────────────────────────────────────
const submitEvent = async () => {
  submitError.value = ''

  // Basic validation
  if (!form.value.title || !form.value.description || !form.value.startDate || !form.value.location) {
    submitError.value = 'Please fill in all required fields.'
    return
  }
  if (!selectedCategory.value) {
    submitError.value = 'Please select a category.'
    return
  }

  isSubmitting.value = true
  submitProgress.value = 10

  try {
    const finalCategory = selectedCategory.value === 'Other' ? customCategory.value : selectedCategory.value

    // ── Step 1: Create the event ───────────────────────
    submitStatus.value = 'Creating event...'
    submitProgress.value = 20

    const eventPayload = {
      title: form.value.title,
      description: form.value.description,
      duration: calculatedDuration.value?.minutes ?? 0,   // backend expects number (minutes)
      location: form.value.location,
      isPaid: form.value.isPaid,
      price: form.value.isPaid ? form.value.price : 0,
      categoryId: finalCategory || 'unspecified',
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: form.value.endDate ? new Date(form.value.endDate).toISOString() : undefined,
    }

    const createdEvent = await $authFetch<any>('/events', {
      method: 'POST',
      body: eventPayload,
    })

    // Unwrap { success, message, data } envelope
    const eventId = createdEvent?.data?.id ?? createdEvent?.id
    if (!eventId) throw new Error('Event creation failed — no event ID returned.')

    submitProgress.value = 40

    // ── Step 2: Upload images ──────────────────────────
    if (selectedFiles.value.length > 0) {
      submitStatus.value = `Uploading ${selectedFiles.value.length} image(s)...`

      const formData = new FormData()
      selectedFiles.value.forEach(f => formData.append('images', f.file))

      await $authFetch(`/events/${eventId}/images`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type — browser sets it with boundary for FormData
        headers: {},
      })
    }

    submitProgress.value = 70

    // ── Step 3: Create steps one by one ───────────────
    if (form.value.steps.length > 0) {
      submitStatus.value = 'Adding event steps...'

      for (const step of form.value.steps) {
        if (!step.title) continue
        await $authFetch(`/events/${eventId}/steps`, {
          method: 'POST',
          body: { title: step.title, description: step.description },
        })
      }
    }

    submitProgress.value = 100
    submitStatus.value = 'Event published!'

    // Small delay so user sees 100%
    await new Promise(r => setTimeout(r, 600))

    router.push('/events')

  } catch (err: any) {
    submitError.value = err?.data?.message ?? err?.message ?? 'Something went wrong. Please try again.'
    console.error('Create event error:', err)
  } finally {
    isSubmitting.value = false
    submitProgress.value = 0
    submitStatus.value = ''
  }
}
</script>

<style scoped>
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>