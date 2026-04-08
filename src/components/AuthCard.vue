<template>
  <div class="auth-scene">
    <!-- Animated gradient orbs -->
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <div class="orb orb-3" />
    <div class="orb orb-4" />

    <!-- Glass card -->
    <div :class="['glass-card', { 'glass-card--medium': medium, 'glass-card--wide': wide }]">
      <!-- Brand -->
      <div class="flex items-center gap-2.5 mb-7">
        <div class="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-white">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="text-white font-semibold text-sm tracking-wide">EventHub</span>
      </div>

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ medium?: boolean; wide?: boolean }>(), {
  medium: false,
  wide: false,
})
</script>

<style scoped>
.auth-scene {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: #0a0a1a;
  position: relative;
  overflow: hidden;
}

/* ── Orbs ── */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  opacity: 0.75;
  will-change: transform;
}

.orb-1 {
  width: 600px; height: 600px;
  background: #113672;
  top: -200px; left: -150px;
  animation: move1 12s ease-in-out infinite;
}
.orb-2 {
  width: 500px; height: 500px;
  background: #083765;
  bottom: -150px; right: -100px;
  animation: move2 14s ease-in-out infinite;
}
.orb-3 {
  width: 400px; height: 400px;
  background: #7a762c;
  bottom: 50px; left: 10%;
  animation: move3 10s ease-in-out infinite;
}
.orb-4 {
  width: 350px; height: 350px;
  background: #512ea1;
  top: 20%; right: 5%;
  animation: move4 16s ease-in-out infinite;
}

@keyframes move1 {
  0%, 100% { transform: translate(0px,   0px)   scale(1);    }
  33%       { transform: translate(80px,  60px)  scale(1.08); }
  66%       { transform: translate(-40px, 80px)  scale(0.95); }
}
@keyframes move2 {
  0%, 100% { transform: translate(0px,   0px)   scale(1);    }
  33%       { transform: translate(-70px,-50px)  scale(1.06); }
  66%       { transform: translate(60px, -80px)  scale(0.97); }
}
@keyframes move3 {
  0%, 100% { transform: translate(0px,  0px)  scale(1);    }
  50%       { transform: translate(60px,-70px) scale(1.1);  }
}
@keyframes move4 {
  0%, 100% { transform: translate(0px, 0px)  scale(1);    }
  40%       { transform: translate(-50px,60px) scale(1.05); }
  80%       { transform: translate(30px,-40px) scale(0.92); }
}

/* ── Glass card ── */
.glass-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(32px) saturate(180%);
  -webkit-backdrop-filter: blur(32px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  padding: 36px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: cardIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.glass-card--medium {
  max-width: 450px;
}

.glass-card--wide {
  max-width: 480px;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(32px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}

@media (max-width: 480px) {
  .glass-card { padding: 28px 24px; border-radius: 20px; }
}
</style>
