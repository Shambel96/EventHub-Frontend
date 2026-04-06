<template>
  <footer class="bg-brand-blue text-white pt-16 pb-8 border-t border-brand-blue/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <!-- Brand Section -->
        <div class="space-y-6">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <span class="text-brand-blue font-black text-xl">E</span>
            </div>
            <span class="text-2xl font-black tracking-tight text-white group-hover:text-brand-yellow transition-colors">Event<span class="text-brand-yellow">Hub</span></span>
          </NuxtLink>
          <p class="text-gray-300 text-sm leading-relaxed max-w-xs">
            Discover, manage, and experience high-rated events curated by our vibrant community. Empowering event enthusiasts since 2024.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-yellow hover:text-brand-blue transition-all">
               <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.984 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.584-.072 4.85c-.056 1.17-.251 1.805-.411 2.227-.221.562-.483.96-.902 1.382-.42.419-.824.679-1.38.896-.425.164-1.06.36-2.23.413-1.266.057-1.646.07-4.85.07s-3.584-.015-4.85-.072c-1.17-.056-1.805-.251-2.227-.411-.562-.221-.96-.483-1.382-.902-.419-.42-.679-.824-.896-1.38-.164-.425-.36-1.06-.413-2.23-.057-1.266-.07-1.646-.07-4.85s.015-3.584.072-4.85c.056-1.17.251-1.805.411-2.227.221-.562.483-.96.902-1.382.42-.419.824-.679 1.38-.896.425-.164 1.06-.36 2.23-.413 1.266-.057 1.646-.07 4.85-.07zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.645-1.44-1.44 0-.794.645-1.439 1.44-1.439.794 0 1.44.645 1.44 1.439z"/></svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-brand-yellow font-black uppercase tracking-widest text-xs mb-8">Navigation</h4>
          <ul class="space-y-4">
            <li v-for="link in quickLinks" :key="link.path">
              <NuxtLink :to="link.path" class="text-gray-300 hover:text-brand-yellow hover:translate-x-1 inline-block transition-all duration-300">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support Section -->
        <div>
          <h4 class="text-brand-yellow font-black uppercase tracking-widest text-xs mb-8">Support</h4>
          <ul class="space-y-4 text-gray-300">
            <li><a href="#" class="hover:text-brand-yellow transition-colors">Help Center</a></li>
            <li><a href="#" class="hover:text-brand-yellow transition-colors">Contact Us</a></li>
            <li><a href="#" class="hover:text-brand-yellow transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="hover:text-brand-yellow transition-colors">Terms of Service</a></li>
          </ul>
        </div>

        <!-- Newsletter Section -->
        <div>
          <h4 class="text-brand-yellow font-black uppercase tracking-widest text-xs mb-8">Stay in the Loop</h4>
          <p class="text-gray-300 text-sm mb-6">Receive exclusive event invitations directly in your inbox.</p>
          <div class="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-yellow transition-colors"
            />
            <button class="bg-brand-yellow text-brand-blue p-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p class="text-gray-400 text-xs font-medium">
          &copy; 2024 EventHub Platform. All rights reserved.
        </p>
        <div class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <span>Made with</span>
          <svg class="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          <span>for the Community</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Discover Events', path: '/events' },
  { name: 'Create Event', path: '/events/create' },
  { name: 'Your Bookmarks', path: '/bookmarks' }
];
</script>
